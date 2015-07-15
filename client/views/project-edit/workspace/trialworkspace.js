// TODO: these functions might fit better in Meteor.isClient()
// because they are only used from the client side

function makeFramesConnectable() {
  jsPlumb.ready(function () {
    var instance = jsPlumb.getInstance({
      Endpoint: ["Dot", {radius: 2}],
      HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2 },
      ConnectionOverlays: [
        [ "Arrow", {
          location: 1,
          id: "arrow",
          length: 14,
          foldback: 0.8
        } ],
        [ "Label", {
          // label: "FOO",
          id: "label",
          cssClass: "aLabel"
        }]
      ],
      Container: "frame-items-container"
    });

    // FIXME: is this okay to tie this instance val to template?
    Template.TrialWorkSpace.jsp = instance;

    var frames = jsPlumb.getSelector(".frame-preview-item");
    instance.draggable(frames);

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
    // happening.
    instance.bind("click", function (con) {
      instance.detach(con);
      Meteor.call("deletePath", con.id);
    });

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    instance.bind("connection", function (info) {
      // FIXME: hacky hacky~ instead of Session, replace it with ReactiveVar
      // TrialToolbox will get this change and open up the modal
      // when a new connection is establisehd
      var pathInfo = {
        projectId: Session.get("projectId"),
        trialId: Session.get("trialId"),
        sourceId: info.sourceId.replace("frame-", ""),
        targetId: info.targetId.replace("frame-", ""),
        eventType: null,
        eventParam: null
      }

      Meteor.call("addPath", pathInfo, function (err, pathInfo) {
        var pathId = pathInfo.pathId;
        var numPaths = pathInfo.numPaths;
        Session.set("pathId", pathId);
        info.connection.id = pathId;

        // FIXME: set label to a more appropriate one
        info.connection.getOverlay("label").setLabel("path " + numPaths);
      });
    });

    // suspend drawing and initialise.
    instance.batch(function () {
      instance.makeSource(frames, {
        filter: ".ep",
        anchor: "Continuous",
        connector: [ "StateMachine", { curviness: 20 } ],
        connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 },
        maxConnections: 10,
        onMaxConnections: function (info, e) {
          alert("Maximum connections (" + info.maxConnections + ") reached");
        }
      });

      // initialise all '.frame-preview-item' elements as connection targets.
      instance.makeTarget(frames, {
        dropOptions: { hoverClass: "dragHover" },
        anchor: "Continuous",
        allowLoopback: true
      });

      // TODO: Paths will be saved in DB. Retrieve them and
      // render(i.e. connect) them accordingly
      // instance.connect({ source: "opened", target: "phone1" });
    });

    // Not really sure where I should need this event
    jsPlumb.fire("jsPlumbDemoLoaded", instance);
  });
}


/*
  Same as makeFramesConnectable, but only for a single
  frame
*/
function makeNewFrameConnectable (frameId) {
  var jsp = Template.TrialWorkSpace.jsp;
  var templateInstance = Template.instance();
  var numFrames = templateInstance.$('.frame-preview-item').length;
  var frameElement = templateInstance.$("#frame-" + frameId);

  jsp.draggable(frameElement);

  jsp.batch(function () {
    jsp.makeSource(frameElement, {
      filter: ".ep",
      anchor: "Continuous",
      connector: [ "StateMachine", { curviness: 20 } ],
      connectorStyle: {
        strokeStyle: "#5c96bc",
        lineWidth: 2,
        outlineColor:"transparent",
        outlineWidth: 4
      },
      maxConnections: 10,
      onMaxConnections: function (info, e) {
        alert("Maximum connections (" + info.maxConnections + ") reached");
      }
    });

    jsp.makeTarget(frameElement, {
      dropOptions: { hoverClass: "dragHover" },
      anchor: "Continuous",
      allowLoopback: true
    });
  });
}

/*
  Align all frame elements in DOM (3 elements/row).
  Since all jsPlumb elements should be absolutely positioned, they should
  be orederd using JS instead of CSS.
*/
function alignElements() {
  var frames = $('.frame-preview-item');
  var numFrames = frames.length;
  var containerWidth = $('.trial-workspace-container').width();
  var space = (containerWidth - 90) / 3;
  var topMargin = 30;

  _.each(frames, function (frame, idx) {
    var horizontalPos = idx % 3;
    var verticalPos = Math.floor(idx / 3);
    var leftMargin = (horizontalPos * space) + 50;
    var topMargin = (verticalPos * 180) + 30;
    $(frame).css({
      left: leftMargin,
      top: topMargin
    });
  });
}

if (Meteor.isClient) {
  var frameItemsTemplate;
  Template.TrialWorkSpace.onRendered(function() {
    this.autorun(function() {
      var trialId = Session.get("trialId");
      if (frameItemsTemplate) {

        // FIXME: there might be a way to replace Blaze.render and Blaze.remove
        // Using Meteor.defer() seems simpler but its performance is worse
        // -- for now, removing/inserting template manually to be able to use
        // onRenderd and onDestroyed callbacks
        Blaze.remove(frameItemsTemplate);
      }
      frameItemsTemplate = Blaze.render(Template.FrameItems,
        $('.frame-items-container')[0]);
    });
  });

  Template.TrialWorkSpace.events({
    "click .frame-preview-item": function (e, template) {
      Session.set("currentView", "frameView");
      Session.set("frameId", this._id);
    },
  });

  Template.FrameItems.helpers({
    frames: function() {
      var trialId = Session.get('trialId');
      return Frames.find({trialId: trialId});
    }
  });

  Template.FrameItems.onRendered(function() {
    alignElements();
    makeFramesConnectable();

    this.autorun(function() {
      var frameId = Session.get("frameAdded");
      if (frameId) {
        makeNewFrameConnectable(frameId);  
      }
    });
  });

  Template.FrameItems.onDestroyed(function() {
    var instance = Template.TrialWorkSpace.jsp;
    if (instance) {
      instance.detachEveryConnection();
    }

    // Remove frameAdded Session, to prevent autorun inside
    // FrameItems.onRendered from running when the template
    // is freshly rendered.
    // FIXME: using Session for this kind of stuff is hacky.
    // Would using ReactiveVar solve this problem?
    Session.set("frameAdded", null);
    Session.set("pathId", null);
  });
}

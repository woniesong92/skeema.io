if (Meteor.isClient) {
  // FIXME: find a better place for all these settings for jsPlumb
  var commonStrokeStyle = {
    strokeStyle: "#5c96bc",
    lineWidth: 2,
    outlineColor: "transparent",
    outlineWidth: 4
  };
  var commonAnchor = "Continuous";
  var commonConnectorStyle = [ "StateMachine", { curviness: 20 } ];
  var commonSrcSettings = {
    filter: ".ep",
    anchor: commonAnchor,
    connector: commonConnectorStyle,
    connectorStyle: commonStrokeStyle,
    maxConnections: 10,
    onMaxConnections: function (info, e) {
      alert("Maximum connections (" + info.maxConnections + ") reached");
    }
  }
  var commonTargetSettings = {
    dropOptions: { hoverClass: "dragHover" },
    anchor: commonAnchor,
    allowLoopback: true
  }

  // FIXME: where is the best place for these functions?
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

      // connect the frames that have paths between them
      var trialId = Session.get('trialId');
      var paths = Paths.find({trialId: trialId}).fetch();
      _.each(paths, function (path) {
        var con = instance.connect({
          source: path.sourceId,
          target: path.targetId
        }, {
          paintStyle: commonStrokeStyle,
          anchor: commonAnchor,
          connector: commonConnectorStyle
        });

        con.getOverlay("label").setLabel(path.name);
      });

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
        var trialId = Session.get("trialId");
        var numPaths = Paths.find({trialId: trialId}).count();
        var pathName = "Path " + numPaths;
        var path = {
          projectId: Session.get("projectId"),
          trialId: trialId,
          name: pathName,
          sourceId: info.sourceId,
          targetId: info.targetId,
          eventType: null,
          eventParam: null
        }

        Meteor.call("addPath", path, function (err, pathId) {
          Session.set("pathId", pathId);
          info.connection.id = pathId;
          info.connection.getOverlay("label").setLabel(pathName);
        });
      });

      // suspend drawing and initialise.
      instance.batch(function () {
        instance.makeSource(frames, commonSrcSettings);
        instance.makeTarget(frames, commonTargetSettings);
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
    var numFrames = templateInstance.$(".frame-preview-item").length;
    var frameElement = templateInstance.$("#" + frameId);

    jsp.draggable(frameElement);

    jsp.batch(function () {
      jsp.makeSource(frameElement, commonSrcSettings);
      jsp.makeTarget(frameElement, commonTargetSettings);
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

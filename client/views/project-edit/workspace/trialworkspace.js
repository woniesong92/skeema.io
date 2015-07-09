
/*
  Since all jsPlumb elements should be 
  absolutely positioned, I have to order them
  in JS rather than in CSS
*/
function positionElements() {
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

  // place add item box in the last position
  var lastLeftMargin = ((numFrames % 3) * space) + 50;
  var lastTopMargin = (Math.floor(numFrames / 3) * 180) + topMargin;
  $('.add-frame-item').css({
    left: lastLeftMargin,
    top: lastTopMargin
  });
}

if (Meteor.isClient) {
  Template.TrialWorkSpace.helpers({
    frames: function() {
      var trialId = Session.get('trialId');

      // check if new frame has just been added
      // this reactive var will make sure that every time
      // frameAdded value in Session changes, this function runs
      var frameId = Session.get("frameAdded");

      // return all frames whose parent is this trial
      return Frames.find({trialId: trialId});
    }
  });

  Template.TrialWorkSpace.onRendered(function() {
    positionElements();

    // jsPlumb helps users mark frames' connections
    jsPlumb.ready(function () {

      // setup some defaults for jsPlumb.
      // var instance = jsPlumb.getInstance({
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
        Container: "trial-workspace-container"
      });

      Template.TrialWorkSpace.jsp = instance;

      var windows = jsPlumb.getSelector(".frame-preview-item");

      // initialise draggable elements.
      instance.draggable(windows);

      // bind a click listener to each connection; the connection is deleted. you could of course
      // just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
      // happening.
      instance.bind("click", function (c) {
        instance.detach(c);
      });

      // bind a connection listener. note that the parameter passed to this function contains more than
      // just the new connection - see the documentation for a full list of what is included in 'info'.
      // this listener sets the connection's internal
      // id as the label overlay's text.
      instance.bind("connection", function (info) {
        info.connection.getOverlay("label").setLabel(info.connection.id);
      });

      // suspend drawing and initialise.
      instance.batch(function () {
        instance.makeSource(windows, {
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
        instance.makeTarget(windows, {
          dropOptions: { hoverClass: "dragHover" },
          anchor: "Continuous",
          allowLoopback: true
        });

        // and finally, make a couple of connections
        // TODO: iterate over the path collection and connect the nodes accordingly
        // instance.connect({ source: "opened", target: "phone1" });
      });

      jsPlumb.fire("jsPlumbDemoLoaded", instance);
    });

    /*
      autorun: every time a new frame is added, this is run and
      binds the new frame to a draggable state
    */
    this.autorun(function() {
      console.log("autorun");

      var trialId = Session.get("trialId");
      var frameId = Session.get("frameAdded");
      if (!frameId) {
        return false;
      }

      var jsp = Template.TrialWorkSpace.jsp;
      var numFrames = Frames.find({trialId: trialId}).count();

      var selector = "#frame-" + frameId;
      var frameElement = $(selector);

      jsp.draggable(frameElement);
      
      jsp.bind("click", function (c) {
        jsp.detach(c);
      });

      jsp.bind("connection", function (info) {
        info.connection.getOverlay("label").setLabel(info.connection.id);
      });

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

        // initialise all '.frame-preview-item' elements as connection targets.
        jsp.makeTarget(frameElement, {
          dropOptions: { hoverClass: "dragHover" },
          anchor: "Continuous",
          allowLoopback: true
        });
      });
    });

  });

  Template.TrialWorkSpace.events({
    "click .frame-preview-item": function (e, template) {
      Session.set("currentView", "frameView");
      Session.set("frameId", this._id);
    },

    // "click .add-frame-container": function (e, template) {
    //   var jsp = Template.TrialWorkSpace.jsp;
    //   var frameId = Session.get("frameAdded");
    //   var numFrames = Frames.find({trialId: trialId}).count();

      // Meteor.call('addFrame', {
      //   projectId: projectId,
      //   trialId: trialId,
      //   name: "Frame " + numFrames
      // }, function (err, frameId) {
      //   if (err) {
      //     console.log("adding Frame failed");
      //     return false;
      //   }

      //   // There is a bug in the library. Use frameElement
      //   // as an argument to jsp instance functions
      //   var selector = "#frame-" + frameId;
      //   var frameElement = $(selector);

      //   jsp.draggable(frameElement);
        
      //   jsp.bind("click", function (c) {
      //     jsp.detach(c);
      //   });

      //   jsp.bind("connection", function (info) {
      //     info.connection.getOverlay("label").setLabel(info.connection.id);
      //   });

      //   jsp.batch(function () {
      //     jsp.makeSource(frameElement, {
      //       filter: ".ep",
      //       anchor: "Continuous",
      //       connector: [ "StateMachine", { curviness: 20 } ],
      //       connectorStyle: {
      //         strokeStyle: "#5c96bc",
      //         lineWidth: 2,
      //         outlineColor:"transparent",
      //         outlineWidth: 4
      //       },
      //       maxConnections: 10,
      //       onMaxConnections: function (info, e) {
      //         alert("Maximum connections (" + info.maxConnections + ") reached");
      //       }
      //     });

      //     // initialise all '.frame-preview-item' elements as connection targets.
      //     jsp.makeTarget(frameElement, {
      //       dropOptions: { hoverClass: "dragHover" },
      //       anchor: "Continuous",
      //       allowLoopback: true
      //     });
      //   });

    //   });
    // }
  });
}

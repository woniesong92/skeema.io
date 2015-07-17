if (Meteor.isClient) {

  // FIXME: find a better place for all these settings for jsPlumb
  var instanceSetting = {
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
  };
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

  function drawPaths (instance, trialId) {
    console.log("drawPaths");

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

      // connection object is tied to Mongo's object by sharing the same id
      con.id = path._id;
      con.getOverlay("label").setLabel(path.name);
    });
  }

  Template.TrialWorkSpace.onCreated(function() {
    var self = this;
    
    jsPlumb.ready(function () {
      self.jspInstance = jsPlumb.getInstance(instanceSetting);
    });

    this.mustInitialize = true;
  });

  Template.TrialWorkSpace.onRendered(function() {
    var self = this;

    this.autorun(function() {
      var allFramesReady = Session.get("allFramesReady");
      var trialId = Session.get("trialId");

      if (allFramesReady) {
        console.log("TrialWorkSpace Rendered");

        var jspInstance = self.jspInstance;
        var $frames = $('.frame-preview-item');
        
        // delete previous elements and unbind events
        jspInstance.unbind();
        jspInstance.detachEveryConnection();

        // make things draggable
        jspInstance.draggable($frames);

        // draw existing paths
        drawPaths(jspInstance, trialId);

        // bind event: click a connection to detach it
        jspInstance.bind("click", function (con) {
          jspInstance.detach(con);
          Meteor.call("deletePath", con.id);
        });

        // bind event: when a new connection is added, add it to DB too
        jspInstance.bind("connection", function (info) {
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

        // make frames sources and sinks so they can be connected
        jspInstance.batch(function () {
          jspInstance.makeSource($frames, commonSrcSettings);
          jspInstance.makeTarget($frames, commonTargetSettings);
        });

        Session.set("allFramesReady", false);
        self.mustInitialize = false;
      }

    });
  });

  Template.TrialWorkSpace.events({
    "click .frame-edit-btn": function (e, template) {
      Session.set("currentView", "frameView");
      Session.set("frameId", this._id);
    },
  });

  Template.TrialWorkSpace.helpers({
    frames: function() {
      var trialId = Session.get('trialId');
      return Frames.find({trialId: trialId});
    }
  });

  Template.FrameItem.onRendered(function() {
    // position the frame item
    var $frame = this.$('.frame-preview-item');
    var position = Frames.findOne($frame.attr('id')).position;
    var frameIndex = this.data.index;
    var trialId = Session.get("trialId");
    var numFrames = Frames.find({trialId: trialId}).count();
    var isLastFrame = (frameIndex + 1 === numFrames) ? true : false;

    if (position) {
      $frame.css({
        top: position.top,
        left: position.left
      });
    } else {
      var frameId = $frame.attr('id');
      var containerWidth = $('.trial-workspace-container').width();
      var space = (containerWidth - 90) / 3;
      var horizontalPos = frameIndex % 3;
      var verticalPos = Math.floor(frameIndex / 3);
      var left = (horizontalPos * space) + 50;
      var top = (verticalPos * 180) + 30;
      
      $frame.css({
        left: left,
        top: top
      });

      Meteor.call('addFramePosition', frameId, {
        left: left,
        top: top
      });
    }

    if (isLastFrame && this.parent().mustInitialize) {
      debugger
      Session.set("allFramesReady", true);
    } else if (isLastFrame) {
      debugger
      var jspInstance = this.parent().jspInstance;
      jspInstance.draggable($frame);
      jspInstance.makeSource($frame, commonSrcSettings);
      jspInstance.makeTarget($frame, commonTargetSettings);
    }
  });
}

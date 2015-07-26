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


    // FIXME: a hacky way to solve a problem. Without this, when frames
    // are moved and not saved, the paths are drawn in reference to the old
    // frame positions. Maybe jsPlumb saves frames' position states separately?
    instance.repaintEverything();
  }

  Template.TrialWorkSpace.onCreated(function() {
    var self = this;

    // this is intentioally out of autorun scope
    var trialId = Session.get("trialId");
    
    jsPlumb.ready(function () {
      self.jspInstance = jsPlumb.getInstance(instanceSetting);
    });

    // TODO: add comments
    // HOWON: THESE ARE RUN FIRST WHEN THE TEMPLATE IS CREATED
    // ANY WAY TO AVOID IT?
    this.trialChanged = Tracker.autorun(function() {
      var trialId = Session.get("trialId");
      self.mustInitialize = true;
    });

    // This is another tracker for showing frameworkspace temporarily
    this.chooseElementToClick = Tracker.autorun(function() {

      // FIXME: usefulInfo contains sourceFrameId and pathId
      // think of a better name. Also, setting four session
      // values feels wrong
      var frameAndPathIds = Session.get("showFrameWorkspace");

      if (frameAndPathIds) {
        Session.set("showChoosingElementView", {
          trialId: trialId,
          pathId: frameAndPathIds.pathId,
          sourceFrame: frameAndPathIds.sourceFrame
        });
        Session.set("frameId", frameAndPathIds.sourceFrame);
        Session.set("currentView", "frameView");
      }
      // Blaze.render
    })

    // this session comes from Paths.js
    this.pathDeleted = Tracker.autorun(function() {

      // FIXME: learn how these trackers actually work and why
      // this is run in the beginning even when the session vars aren't set yet
      // debugger
      var deletedPathIds = Session.get("deletedPathIds");
      _.each(deletedPathIds, function (deletedPathId) {
        self.jspInstance.select().each(function (con) {
          if (con.id === deletedPathId) {
            self.jspInstance.detach(con);
          }
        });
      });
    });
  });

  // TODO: add comments
  Template.TrialWorkSpace.onRendered(function() {

    Session.set("pathId", null);

    $('.collasped-right-completely').removeClass("collasped-right-completely").addClass("expanded-right");
    $('.collasped-left-completely').removeClass("collasped-left-completely").addClass("expanded-left");

    var self = this;

    this.autorun(function() {
      var allFramesReady = Session.get("allFramesReady");
      // debugger

      if (allFramesReady) {
        var jspInstance = self.jspInstance;
        var $frames = $('.frame-preview-item');
        
        // delete previous elements and unbind events
        jspInstance.reset();

        // make things draggable
        jspInstance.draggable($frames, {
          stop: function (e, ui) {
            var frameId = ui.helper[0].id;
            // var position = $('#' + ui.id).position();

            //FIXME: THIS PROBABLY NEEDS TO BE IN %, not pixels
            var position = ui.position;
            Meteor.call("addFramePosition", frameId, position);
          }
        });

        // make frames sources and sinks so they can be connected
        jspInstance.batch(function () {
          jspInstance.makeSource($frames, commonSrcSettings);
          jspInstance.makeTarget($frames, commonTargetSettings);
        });

        // draw existing paths
        drawPaths(jspInstance, self.trialId);

        // bind event: click a connection to detach it
        jspInstance.bind("click", function (con) {
          // jspInstance.detach(con);
          // Meteor.call("deletePaths", [con.id]);
          Session.set("pathId", con.id);
        });

        // bind event: when a new connection is added, add it to DB too
        jspInstance.bind("connection", function (info) {
          var trialId = self.trialId;

          var existingPaths = Paths.find({
            sourceId: info.sourceId,
            targetId: info.targetId
          }).fetch();

          var existingEventTypes = _.map(existingPaths, function (path) {
            return path.eventType;
          });

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
            var pathInfo = {
              pathId: pathId,
              sourceFrame: info.source.id,
              existingEventTypes: existingEventTypes
            }
            Session.set("pathInfo", pathInfo);
            info.connection.id = pathId;
            info.connection.getOverlay("label").setLabel(pathName);
          });
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
    "click .frame-remove-btn": function (e, template) {
      var trialId = Session.get("trialId");
      var trial = Trials.findOne({_id: trialId});
      // var numFrames = Frames.find({trialId: trialId}).count();
      var frameId = this._id;

      // if there are only start and exit frames or this is a start frame,
      // you can't remove this frame
      if (trial.startFrameId === frameId) {
        var errMessage = "You cannot delete a start frame."
        $.bootstrapGrowl(errMessage, {
          ele: '.toast-container', // which element to append to
          type: 'danger', // (null, 'info', 'danger', 'success')
          offset: {from: 'top', amount: 97}, // 'top', or 'bottom'
          align: 'right', // ('left', 'right', or 'center')
          width: 220, // (integer, or 'auto')
          delay: 3000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
          allow_dismiss: true, // If true then will display a cross to close the popup.
          stackup_spacing: 10 // spacing between consecutively stacked growls.
        });
        return false;
      }

      Meteor.call("deleteFrames", [frameId], function (e){
        if (e) {
          console.log("Deleting frame "+frameId+" failed");
          return false;
        }
        // Utils.toast('Removed successfully', 2000);
        
        $.bootstrapGrowl("REMOVED SUCCESSFULLY", {
            ele: '.toast-container', // which element to append to
            type: 'success', // (null, 'info', 'danger', 'success')
            offset: {from: 'top', amount: 97}, // 'top', or 'bottom'
            align: 'right', // ('left', 'right', or 'center')
            width: 220, // (integer, or 'auto')
            delay: 3000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
            allow_dismiss: true, // If true then will display a cross to close the popup.
            stackup_spacing: 10 // spacing between consecutively stacked growls.
        });
      });
    },

  });

  Template.TrialWorkSpace.helpers({
    frames: function() {
      var trialId = Session.get('trialId');
      Template.instance().trialId = trialId;
      return Frames.find({trialId: trialId});
    },
  });

  Template.FrameItem.helpers({
    isStart: function() {
      var trialId = Session.get('trialId');
      if (Trials.findOne({_id: trialId}).startFrameId == this._id) {
        return "startFrame";
      }
      return "";
    },

  });

  Template.FrameItem.onRendered(function() {
    // position the frame item

    var $frame = this.$('.frame-preview-item');
    var position = Frames.findOne($frame.attr('id')).position;
    var frameIndex = this.data.index;
    var trialId = this.parent().trialId;
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
      var space = (containerWidth - 430) / 3;
      var horizontalPos = frameIndex % 3;
      var verticalPos = Math.floor(frameIndex / 3);
      var left = (horizontalPos * space) + 280;
      var top = (verticalPos * 180) + 100;
      
      $frame.css({
        left: left,
        top: top
      });

      Meteor.call('addFramePosition', frameId, {
        left: left,
        top: top
      });
    }

    // All frames are rendered for the first time
    if (isLastFrame && this.parent().mustInitialize) {
      Session.set("allFramesReady", true);

    // A new frame has been added and rendered for the first time
    } else if (isLastFrame) {
      var jspInstance = this.parent().jspInstance;
      jspInstance.draggable($frame, {
          stop: function (e, ui) {
            var frameId = ui.helper[0].id;
            // var position = $('#' + ui.id).position();

            //FIXME: THIS PROBABLY NEEDS TO BE IN %, not pixels
            var position = ui.position;
            Meteor.call("addFramePosition", frameId, position);
          }
        });
      jspInstance.makeSource($frame, commonSrcSettings);
      jspInstance.makeTarget($frame, commonTargetSettings);
    }
  });
}

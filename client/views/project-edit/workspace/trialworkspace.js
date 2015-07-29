if (Meteor.isClient) {
  var allFramesReady = new ReactiveVar;
  var jspInstance;
  var doInitializeWorkspace;

  var drawPaths = function (instance, trialId) {
    var paths = Paths.find({trialId: trialId}).fetch();

    _.each(paths, function (path) {
      var con = instance.connect({
        source: path.sourceId,
        target: path.targetId
      }, {
        paintStyle: jsPlumbSettings.commonStrokeStyle,
        anchor: jsPlumbSettings.commonAnchor,
        connector: jsPlumbSettings.commonConnectorStyle
      });
      // connection object is tied to Mongo's object by sharing the same id
      con.id = path._id;
      con.getOverlay("label").setLabel(path.name);
    });

    // FIXME: might be a better way to do this
    instance.repaintEverything();
  }

  var _showSidebars = function() {
    //FIXME: this should be handled by Sidenav and toolbar files like below.
    //Let Jenny handle it
    //ProjectEditSession.set("hideToolbar", true)
    //ProjectEditSession.set("hideSidnav", true)
    $('.collasped-right-completely').removeClass("collasped-right-completely").addClass("expanded-right");
    $('.collasped-left-completely').removeClass("collasped-left-completely").addClass("expanded-left");
  }

  var _addPathFromConnection = function (info, trialId) {
    var pathId = Random.id();

    var path = {
      _id: pathId,
      projectId: ProjectEditSession.get("projectId"),
      trialId: trialId,
      name: "Path",
      sourceId: info.sourceId,
      targetId: info.targetId,
      eventType: null,
      eventParam: null
    }

    // Open the modal to select an event for the path
    ProjectEditSession.set("pathInfo", path);

    // Make a jsPlumb connection. However, the actual
    // path hasn't been created yet.
    info.connection.id = pathId;
    info.connection.getOverlay("label").setLabel("Path");


    // Meteor.call("createPath", path, function (err, pathId) {
    //   if (err) {
    //     console.log(err);
    //   }
      
    //   var pathInfo = {
    //     pathId: pathId,
    //     sourceFrame: info.source.id,
    //     // existingEventTypes: existingEventTypes
    //   }

    //   debugger

    //   ProjectEditSession.set("pathInfo", pathInfo);
    //   info.connection.id = pathId;
    //   info.connection.getOverlay("label").setLabel("Path");
    // });
  }

  Template.TrialWorkSpace.onCreated(function() {
    var self = this;
    var trialId = ProjectEditSession.get("trialId");
    allFramesReady.set(false);

    jsPlumb.ready(function () {
      jspInstance = jsPlumb.getInstance(jsPlumbSettings.instanceSetting);
    });

    Tracker.autorun(function() {
      var trialId = ProjectEditSession.get("trialId");

      // initialize workspace
      doInitializeWorkspace = true;
    });

    // User is trying to create a path between two frames when this is run.
    // Show FrameView so the user can choose an element to click for the path he is creating
    Tracker.autorun(function() {
      var pathInfo = ProjectEditSession.get("startChoosingElementToClick");
      if (pathInfo) {
        debugger
        ProjectEditSession.set("frameId", pathInfo.sourceId);
        ProjectEditSession.set("currentView", FRAME_VIEW);
      }
    });

    // This is another tracker for showing frameworkspace temporarily
    // HOWON: THIS IS A PLACE WHERE LOCAL REACTIVE VAR MUST BE USED.
    // Tracker.autorun(function() {

    //   // FIXME: usefulInfo contains sourceFrameId and pathId
    //   // think of a better name. Also, setting four session
    //   // values feels wrong
    //   var frameAndPathIds = Session.get("showFrameWorkspace");
    //   if (frameAndPathIds) {

    //     //FIXME
    //     Session.set("showChoosingElementView", {
    //       trialId: trialId,
    //       pathId: frameAndPathIds.pathId,
    //       sourceFrame: frameAndPathIds.sourceFrame
    //     });

    //     ProjectEditSession.set("frameId", frameAndPathIds.sourceFrame);
    //     ProjectEditSession.set("currentView", FRAME_VIEW);
    //   }
    // })

    // HOWON: THIS IS A PLACE WHERE LOCAL REACTIVE VAR MUST BE USED.
    // this session comes from Paths.js
    Tracker.autorun(function() {
      // FIXME: learn how these trackers actually work and why
      // this is run in the beginning even when the session vars aren't set yet
      var deletedPathIds = Session.get("deletedPathIds");
      _.each(deletedPathIds, function (deletedPathId) {
        jspInstance.select().each(function (con) {
          if (con.id === deletedPathId) {
            jspInstance.detach(con);
          }
        });
      });
    });
  });

  // TODO: add comments
  Template.TrialWorkSpace.onRendered(function() {
    ProjectEditSession.set("pathId", null);

    // FIXME: this should belong to SideNav and Toolbar
    _showSidebars();

    var self = this;

    this.autorun(function() {
      var areAllFramesReady = allFramesReady.get();
      if (areAllFramesReady) {
        var $frames = $('.frame-preview-item');
        
        // delete previous elements and unbind events
        jspInstance.reset();

        // make things draggable
        jspInstance.draggable($frames, {
          stop: function (e, ui) {
            var frameId = ui.helper[0].id;

            //FIXME: THIS PROBABLY NEEDS TO BE IN %, not pixels
            var position = ui.position;
            Meteor.call("addFramePosition", frameId, position);
          }
        });

        // make frames sources and sinks so they can be connected
        jspInstance.batch(function () {
          jspInstance.makeSource($frames, jsPlumbSettings.commonSrcSettings);
          jspInstance.makeTarget($frames, jsPlumbSettings.commonTargetSettings);
        });

        // draw existing paths
        drawPaths(jspInstance, self.trialId);

        // bind event: click a connection to detach it
        jspInstance.bind("click", function (con) {
          ProjectEditSession.set("pathId", con.id);
        });

        // bind event: when a new connection is added, add it to DB too
        jspInstance.bind("connection", function (info) {
          var trialId = self.trialId;

          // var existingPaths = Paths.find({
          //   sourceId: info.sourceId,
          //   targetId: info.targetId
          // }).fetch();

          // var existingEventTypes = _.map(existingPaths, function (path) {
          //   return path.eventType;
          // });

          _addPathFromConnection(info, trialId);
        });

        allFramesReady.set(false);
        doInitializeWorkspace = false;
      }
    });
  });

  Template.TrialWorkSpace.events({
    "click .frame-edit-btn": function (e, template) {
      ProjectEditSession.set("currentView", FRAME_VIEW);
      ProjectEditSession.set("frameId", this._id);
    },

    "click .frame-remove-btn": function (e, template) {
      var trialId = ProjectEditSession.get("trialId");
      var trial = Trials.findOne({_id: trialId});
      var frameId = this._id;

      if (trial.startFrameId === frameId) {
        Utils.toast("You cannot delete a start frame.");
        return false;
      }

      Meteor.call("deleteFrames", [frameId], function (e){
        if (e) {
          console.log("Deleting frame "+frameId+" failed");
          return false;
        }
        
        Utils.toast("REMOVED SUCCESSFULLY");
      });
    },
  });

  Template.TrialWorkSpace.helpers({
    frames: function() {
      var trialId = ProjectEditSession.get('trialId');
      Template.instance().trialId = trialId;
      return Frames.find({trialId: trialId});
    },
  });

  Template.FrameItem.helpers({
    isStart: function() {
      var trialId = ProjectEditSession.get('trialId');
      if (Trials.findOne({_id: trialId}).startFrameId == this._id) {
        return "startFrame"; // ???
      }
      return "";
    },
  });

  Template.FrameItem.onRendered(function() {
    // FIXME: decide what to do to position frame items
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

    // All frames are rendered for the first time so
    // the workspace should be initialized
    if (isLastFrame && doInitializeWorkspace) {
      allFramesReady.set(true);

    // A new frame has been added and rendered for the first time
    } else if (isLastFrame) {
      jspInstance.draggable($frame, {
        stop: function (e, ui) {
          var frameId = ui.helper[0].id;

          //FIXME: THIS PROBABLY NEEDS TO BE IN %, not pixels
          var position = ui.position;
          Meteor.call("addFramePosition", frameId, position);
        }
      });

      jspInstance.makeSource($frame, jsPlumbSettings.commonSrcSettings);
      jspInstance.makeTarget($frame, jsPlumbSettings.commonTargetSettings);
    }
  });
}

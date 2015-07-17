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
  }

  /*
    Align all frame elements in DOM (3 elements/row).
    Since all jsPlumb elements should be absolutely positioned, they should
    be orederd using JS instead of CSS.
  */

  Template.TrialWorkSpace.onCreated(function() {
    var self = this;

    jsPlumb.ready(function () {
      self.jspInstance = jsPlumb.getInstance(instanceSetting);
    });

    // FIXME: this is a perfect place to use ReactiveVar
    // this.areFramesReady = new ReactiveVar;
    // this.areFramesReady.set(false);
    Session.set("areFramesReady", false);
  });

  Template.TrialWorkSpace.onRendered(function() {
    var self = this;
    this.autorun(function() {
      console.log("TrialWorkSpace Rendered");
      
      var trialId = Session.get("trialId");
      var areFramesReady = Session.get("areFramesReady");
      var jspInstance = self.jspInstance;
      
      // jsPlumb.ready(function () {
      // empty whatever that was left over
      jspInstance.unbind();
      jspInstance.detachEveryConnection();
      
      if (areFramesReady) {
        var $frames = $('.frame-preview-item');

        // make frames draggable
        jspInstance.draggable($frames);

        // bind a click listener to each connection; the connection is deleted. you could of course
        // just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
        // happening.
        jspInstance.bind("click", function (con) {
          jspInstance.detach(con);
          Meteor.call("deletePath", con.id);
        });

        // bind a connection listener. note that the parameter passed to this function contains more than
        // just the new connection - see the documentation for a full list of what is included in 'info'.
        // this listener sets the connection's internal
        // id as the label overlay's text.
        jspInstance.bind("connection", function (info) {
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
          
          debugger

          Meteor.call("addPath", path, function (err, pathId) {
            debugger
            Session.set("pathId", pathId);
            info.connection.id = pathId;
            info.connection.getOverlay("label").setLabel(pathName);
          });
        });

        // suspend drawing and initialise.
        jspInstance.batch(function () {
          jspInstance.makeSource($frames, commonSrcSettings);
          jspInstance.makeTarget($frames, commonTargetSettings);
        });

        // connect the frames that have paths between them
        drawPaths(jspInstance, trialId);

        // Session.set("areFramesReady", false);
        // intentionally using delete here to avoid reload
        delete Session.keys["areFramesReady"];
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

    console.log($frame);

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

    if (isLastFrame) {
      // FIXME: use ReactiveVar instead of Session. See the other comments
      debugger
      Session.set("areFramesReady", true);
    }
  });
}

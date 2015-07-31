if (Meteor.isClient) {

  var isPositiveInteger = function (str) {
    return /^\d+$/.test(str);
  }

  var _onDurationChange = function() {
    var duration = $.trim($('#duration').val());
    if (duration.length > 0 && isPositiveInteger(duration)) {
      $('.create-path-btn').removeClass('disabled');
    } else {
      $('.create-path-btn').addClass('disabled');
    }
  }

  var _addPath = function (pathInfo, eventType, eventParam) {
    var alreadyExisting = Paths.findOne({
      trialId: pathInfo.trialId,
      sourceId: pathInfo.sourceId,
      targetId: pathInfo.targetId,
      eventType: eventType,
      eventParam: eventParam,
    });

    if (alreadyExisting){
      Utils.toast("<center>THIS PATH ALREADY EXISTS</center>", {
          type: "danger",
          ele: '.workspace-container',
          align: 'center',
          offset: {from: 'bottom', amount: 97},
          width: 400,
        });
      Session.set("deletedPathIds", [pathInfo._id]);
      return false;
    }

    var updatedPathInfo = _.extend(pathInfo, {
      eventType: eventType,
      eventParam: eventParam
    });
    Meteor.call("addPath", updatedPathInfo, function (err, data) {
      if (err) {
        console.log("ERR: path couldn't be added", err);
      }
    });
  }

  Template.Modal.onCreated(function() {
    var self = this;
    this.addPathDeferred = null;
    this.pathInfo = null;

    this.autorun(function() {
      var pathInfo = ProjectEditSession.get("pathInfo");
      if (pathInfo) {
        self.pathInfo = pathInfo;
      }
    });

    Tracker.autorun(function() {
      var info = ProjectEditSession.get("doneChoosingElementToClick");
      if (info) {
        _addPath(info.pathInfo, info.eventType, info.eventParam);
        ProjectEditSession.set("currentView", TRIAL_VIEW);
        ProjectEditSession.set("doneChoosingElementToClick", undefined);
      }
    });
  });

  Template.Modal.onRendered(function() {
    $("#modal").on("show.bs.modal", function() {
      $('#modal .default-option').prop("selected", true);
      $('#key').prop('disabled', false);
      $('#modal .show').removeClass('show');
      ProjectEditSession.set("pathInfo", null);
    });
  });

  Template.Modal.events({
    'change #event-picker': function (e, template) {
      var pathInfo = template.pathInfo;
      var pickedevent = $('#event-picker').val();

      $('.create-path-btn').addClass('disabled');
      $('.show').removeClass('show');
      $('.modal input').val("");

      if (pickedevent === "keypress") {
        $('.key-options').addClass('show');
      } else if (pickedevent === "time") {
        $('.time-options').addClass('show');
      } else { // click
        if (pathInfo) {
          var numElts = Elements.find({frameId: pathInfo.sourceId}).count();
          if (numElts < 1) {
            $('.click-error-msg').addClass('show');
          } else {
            $('.create-path-btn').removeClass('disabled');
          }
        }
      }
    },

    'keyup #key': function (e, template) {
      var key;

      if (e.keyCode === 32) {
        key = "space";
        $('#key').val(key);
      } else if (e.keyCode === 13) {
        key = "enter";
        $('#key').val(key);
      }

      key = $.trim($('#key').val());

      if (key.length > 0) {
        $('.create-path-btn').removeClass('disabled');
        $('#key').prop('disabled', 'disabled');
      } else {
        $('.create-path-btn').addClass('disabled');
      }
    },

    'change #duration': function (e, template) {
      _onDurationChange();
    },

    'keyup #duration': function (e, template) {
      _onDurationChange();
    },

    'click .create-path-btn': function (e, template) {
      var eventType = $('#event-picker').val();
      var eventParam;
      var pathInfo = template.pathInfo;

      if (eventType === 'keypress') {
        eventParam = $.trim($('#key').val());
        _addPath(pathInfo, eventType, eventParam);

      } else if (eventType === 'time') {
        eventParam = $.trim($('#duration').val());
        _addPath(pathInfo, eventType, eventParam);

      } else if (eventType === 'click') {
        // We have to show the frame workspace temporarily
        // to let the user choose an element
        ProjectEditSession.set("startChoosingElementToClick", pathInfo);
      }
    },

    'click .delete-path-btn': function (e, template) {
      var pathInfo = template.pathInfo;
      Meteor.call("deletePaths", [pathInfo._id]);
    }
  });
}

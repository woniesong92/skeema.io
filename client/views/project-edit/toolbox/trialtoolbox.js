if (Meteor.isClient) {
  Template.TrialToolBox.onRendered(function() {
    // To prevent the modal to open up when it shouldn't,
    // invalidate the pathInfo Session
    // THIS FUCKING SUCKS
    Session.set("pathInfo", null);

    this.autorun(function() {
      var pathInfo = Session.get("pathInfo");
      if (pathInfo) {
        $('#modal').modal('show');
      }
    });
  });

  Template.TrialSettings.events({
    'change #trialname': function (e, template) { 
      var newname = $('#trialname').val().trim();
      var trialId = ProjectEditSession.get("trialId");
      Meteor.call('renameTrial', trialId, newname);
    },

    'change #exit-path-input': function (e, template) { 
      var respbool = $('#exit-path-input').is(':checked');
      var trialId = ProjectEditSession.get("trialId");
      Meteor.call('changeDoSaveResponse', trialId, respbool);
    },

    'change #time-elapsed-input': function (e, template) { 
      var reactbool = $('#time-elapsed-input').is(':checked');
      var trialId = ProjectEditSession.get("trialId");
      Meteor.call('changeDoSaveReactionTime', trialId, reactbool);
    },

    'change #occurences': function (e, template) { 
      var numoccur = $('#occurences').val().trim();

      //FIXME: VALIDATE THAT IT IS A POSITIVE INTEGER (> 0)
      var trialId = ProjectEditSession.get("trialId");
      Meteor.call('changeOccurences', trialId, numoccur);
    },

    'click .save-changes-btn': function (e, template) {
      var frames = $('.frame-preview-item');
      _.each(frames, function (frame) {
        var position = $(frame).position();
        Meteor.call("addFramePosition", frame.id, position);
      });
    },

    'click .add-frame': function (e, template) {
      var projectId = this._id;
      var trialId = ProjectEditSession.get('trialId');

      Meteor.call('addFrame', {
        projectId: projectId,
        trialId: trialId,
        name: "New Frame",
        type: "normal"
      }, function (err, frameId) {
        if (err) {
          console.log("Adding Frame failed", err);
          return false;
        }
        Session.set("frameAdded", frameId);
      });
    },

    'click .make-trial-duplicate': function (e, template) {
      var trialId = ProjectEditSession.get("trialId");
      Meteor.call("makeTrialDuplicate", trialId);
    }
  });

  Template.TrialPaths.helpers({
    paths: function() {
      var trialId = ProjectEditSession.get("trialId");
      return Paths.find({trialId: trialId});
    }
  });

  Template.TrialPaths.helpers({
    frameName: function (frameId) {

      // FIXME: this is called twice every time a path
      // is created, because path is updated twice.
      // maybe it's not a good idea to create a path
      // without eventType and Param. I should defer
      // creating a path until the user has entered
      // the event type and param.

      return Frames.findOne(frameId).name;
    }
  })

  Template.TrialPaths.events({

    'change #pathname': function (e, template) { 
      var newname = $('#pathname').val().trim();
      var pathId = ProjectEditSession.get("pathId");
      Meteor.call('renamePath', pathId, newname)
    },

    "click .path-item-delete": function (e, template) {
      var pathId = ProjectEditSession.get("pathId");
      Meteor.call("deletePaths", [pathId]);
      
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
    },

  });
}


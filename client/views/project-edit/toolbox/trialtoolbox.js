if (Meteor.isClient) {

  Template.TrialToolBox.helpers({
    // isMine: function(owner) {
    //   return owner == Meteor.userId();
    // }
  });

  Template.TrialToolBox.rendered = function () {

    // FIXME: MOVE THIS TO TRIALWORKSPACE.JS
    $('.modal-trigger').leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 100, // Transition in duration
      out_duration: 100, // Transition out duration
    });
  }

  Template.TrialToolBox.events({

  });

  Template.TrialSettings.events({
    'change #trialname': function(e, template) { 
      var newname = $('#trialname').val().trim();
      var trialId = Session.get("id");
      Meteor.call('renameTrial', trialId, newname);
    },

    'change #exit-path-input': function(e, template) { 
      var respbool = $('#exit-path-input').is(':checked');
      var trialId = Session.get("id");
      Meteor.call('changeDoSaveResponse', trialId, respbool);
    },

    'change #time-elapsed-input': function(e, template) { 
      var reactbool = $('#time-elapsed-input').is(':checked');
      var trialId = Session.get("id");
      Meteor.call('changeDoSaveReactionTime', trialId, reactbool);
    },

    'change #occurences': function(e, template) { 
      var numoccur = $('#occurences').val().trim();

      //FIXME: VALIDATE THAT IT IS A POSITIVE INTEGER (> 0)
      var trialId = Session.get("id");
      Meteor.call('changeOccurences', trialId, numoccur);
    },
  });

  Template.TrialPaths.events({
    'click .add-frame': function (e, template) {
      var projectId = this._id;
      var trialId = Session.get('id');
      var numFrames = Frames.find({trialId: trialId}).count();

      Meteor.call('addFrame', {
        projectId: projectId,
        trialId: trialId,
        name: "Frame " + numFrames
      }, function (err, frameId) {
        if (err) {
          console.log("Adding Frame failed", err);
          return false;
        }
        Session.set("frameAdded", frameId);
      });
    }
  });
}


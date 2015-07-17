if (Meteor.isClient) {
  Template.BlockWorkSpace.helpers({
    trials: function() {
      var blockId = Session.get('id');
      return Trials.find({blockId: blockId});
    },

    numFrames: function (trialId) {
      return Frames.find({trialId: trialId}).count();
    }
  });

  Template.BlockWorkSpace.events({
    "click .trial-preview-item": function (e, template) {
      var trialId = this._id;
      Session.set("currentView", "trialView");
      Session.set("trialId", trialId);
    }
  });
}

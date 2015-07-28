if (Meteor.isClient) {
  Template.BlockWorkSpace.helpers({
    trials: function() {
      var blockId = ProjectEditSession.get("blockId");
      return Trials.find({blockId: blockId});
    },

    numFrames: function (trialId) {
      return Frames.find({trialId: trialId}).count();
    }
  });

  Template.BlockWorkSpace.events({
    "click .trial-preview-item": function (e, template) {
      ProjectEditSession.set("currentView", TRIAL_VIEW);
      ProjectEditSession.set("trialId", this._id);
    }
  });
}

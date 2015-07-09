if (Meteor.isClient) {
  Template.TrialWorkSpace.helpers({
    frames: function() {
      var trialId = Session.get('id');
      return Frames.find({trialId: trialId});
    }
  });

  Template.TrialWorkSpace.onRendered(function() {
    console.log("TrialWorkSpace rendered");
    jsPlumb.ready(function() {
      console.log("js plumb is ready");
    });
  });

  Template.TrialWorkSpace.events({
    "click .frame-preview-item": function (e, template) {
      Session.set("currentView", "frameView");
      Session.set("id", this._id);
    },

    "click .add-frame-container": function (e, template) {
      var projectId = this._id;
      var trialId = Session.get('id');
      var numFrames = Frames.find({trialId: trialId}).count();
      Meteor.call('addFrame', {
        projectId: projectId,
        trialId: trialId,
        name: "Frame " + numFrames
      });
    }
  });
}

if (Meteor.isClient) {
  Template.ProjectEdit.onRendered(function() {
    Session.set("currentView", "trialView");
    var projectId = this.data._id;
    var firstBlock = Blocks.findOne({
      projectId: projectId,
      index: 0
    });

    var firstTrial = Trials.findOne({
      projectId: projectId,
      blockId: firstBlock._id,
      index: 0
    });

    Session.set("blockId", firstBlock._id);
    Session.set("trialId", firstTrial._id);
    Session.set("frameId", null);
    Session.set("pathId", null);
    Session.set("elementId", null);
  });

  Template.ProjectEdit.helpers({
    project: function() {
      return this;
    },
  });

  Template.ProjectEdit.events({

  });
}
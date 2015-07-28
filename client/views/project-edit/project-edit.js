if (Meteor.isClient) {
  ProjectEditSession = new ReactiveDict('ProjectEditSession');
  BLOCK_VIEW = "blockView";
  TRIAL_VIEW = "trialView";
  FRAME_VIEW = "frameView";

  Template.ProjectEdit.onCreated(function() {
    var projectId = this.data._id;
    
    var firstBlock = Blocks.findOne({
      projectId: projectId,
      index: 0
    });

    // Fail fast: debugging purpose
    if (!(firstBlock)) {
      console.log("ERR: firstBlock doesn't exist");
      return false;
    }

    var firstTrial = Trials.findOne({
      projectId: projectId,
      blockId: firstBlock._id,
      index: 0
    });

    ProjectEditSession.set("projectId", projectId);
    ProjectEditSession.set("blockId", firstBlock._id);
    ProjectEditSession.set("trialId", firstTrial._id);
    ProjectEditSession.set("frameId", null);
    ProjectEditSession.set("pathId", null);
    ProjectEditSession.set("elementId", null);
    ProjectEditSession.set("currentView", TRIAL_VIEW);
  });

  Template.ProjectEdit.helpers({
    project: function() {
      return this;
    },
  });

  Template.ProjectPanel.events({
    // FIXME: delete all the associated trials,
    // frames, elements, paths
    'click .project-delete': function (e, template) {
      var projectId = this._id;
      Meteor.call('deleteProject', projectId);
    }
  });
}

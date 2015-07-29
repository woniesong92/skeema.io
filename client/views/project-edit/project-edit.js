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

    // Fail fast: debugging purpose
    if (!(firstTrial)) {
      console.log("ERR: firstTrial doesn't exist");
      return false;
    }

    ProjectEditSession.set("projectId", projectId);
    ProjectEditSession.set("blockId", firstBlock._id);
    ProjectEditSession.set("trialId", firstTrial._id);
    ProjectEditSession.set("frameId", undefined);
    ProjectEditSession.set("pathId", undefined);
    ProjectEditSession.set("elementId", undefined);
    ProjectEditSession.set("currentView", TRIAL_VIEW);
    ProjectEditSession.set("addText", undefined);
    ProjectEditSession.set("addButton", undefined);
    ProjectEditSession.set("addImage", undefined);
  });

  Template.ProjectEdit.helpers({
    project: function() {
      return this;
    }
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

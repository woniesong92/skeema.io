if (Meteor.isClient) {
  Template.ProjectEdit.onRendered(function() {
    var projectId = this.data._id;
    var firstBlock = Blocks.findOne({
      projectId: projectId,
      index: 0
    });
    Session.set("blockId", firstBlock._id);
  });

  Template.ProjectEdit.helpers({
    project: function() {
      return this;
    },
  });

  Template.ProjectEdit.rendered = function () {

    // FIXME (LATER): NEED TO MAKE REACTIVE ONLY IN TEMPLATE (NOT GLOBAL); USE REACTIVE-VAR PACKAGE
    Session.set("currentView", "projectView");

    Session.set("projectId", UI.getData()._id);

    //should these be initialized?
    Session.set("blockId", null);
    Session.set("trialId", null);
    Session.set("frameId", null);
    Session.set("pathId", null);
    Session.set("elementId", null);
  }

  Template.ProjectEdit.events({

  });
}
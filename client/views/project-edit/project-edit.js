if (Meteor.isClient) {

  Template.ProjectEdit.helpers({
    project: function() {
      return this;
    }
  });

  Template.ProjectEdit.rendered = function () {
    Session.set("currentView", "projectView");
    Session.set("id", UI.getData()._id); // id of selected block, trial, or frame
    debugger
  }

  Template.ProjectEdit.events({
    "click .block": function (e, template) {

    },
  });
}
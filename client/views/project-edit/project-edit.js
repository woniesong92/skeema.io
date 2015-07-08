if (Meteor.isClient) {

  Template.ProjectEdit.helpers({
    project: function() {
      return this;
    },
  });

  Template.ProjectEdit.rendered = function () {

    // FIXME (LATER): NEED TO MAKE REACTIVE ONLY IN TEMPLATE (NOT GLOBAL); USE REACTIVE-VAR PACKAGE
    Session.set("currentView", "projectView");

    // id of selected block, trial, or frame
    Session.set("id", UI.getData()._id);
  }

  Template.ProjectEdit.events({
    "click .block-item": function (e, template) {
      debugger
      Session.set("currentView", "blockView");
      Session.set("id", this._id);
    },
    "click .trial-item": function (e, template) {
      debugger
      Session.set("currentView", "trialView");
      Session.set("id", this._id);
    },
    // "click .frame-item": function (e, template) {
    //   Session.set("currentView", "frameView");
    //   Session.set("id", this._id);
    // },



  });
}
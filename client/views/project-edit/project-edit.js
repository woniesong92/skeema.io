if (Meteor.isClient) {

  Template.ProjectEdit.helpers({
    project: function() {
      return this;
    },
    isBlockView: function () {
      return Session.get("currentView") == "blockView";
    },
    isTrialView: function () {
      return Session.get("currentView") == "trialView";
    },
    isFrameView: function () {
      return Session.get("currentView") == "frameView";
    },
    block: function() {
      var blockId = Session.get("id");
      return Blocks.findOne({_id: blockId});
    },
    trial: function() {
      var trialId = Session.get("id");
      return Trials.findOne({_id: trialId});
    },
    frame: function() {
      var frameId = Session.get("id");
      return Frames.findOne({_id: frameId});
    }
  });

  Template.ProjectEdit.rendered = function () {

    // FIXME (LATER): NEED TO MAKE REACTIVE ONLY IN TEMPLATE (NOT GLOBAL); USE REACTIVE-VAR PACKAGE
    Session.set("currentView", "projectView");

    // id of selected block, trial, or frame
    Session.set("id", UI.getData()._id);
  }

  Template.ProjectEdit.events({
    "click .block": function (e, template) {

    },
  });
}
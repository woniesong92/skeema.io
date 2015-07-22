if (Meteor.isClient) {
  Template.SideNav.onRendered(function() {
    this.$('.block-items').sortable({
      cancel: ".add-block, .add-trial",
      items: "> li",
      update: function (e, ui) {
        // TODO: handle backend
        console.log("block item rearranged");
      }
    });

    this.$('.trial-items').sortable({
      cancel: ".add-block, .add-trial",
      items: "> li",
      update: function (e, ui) {
        // TODO: handle backend
        console.log("trial item rearranged");
      }
    });

    this.$('.block-items, .trial-items').disableSelection();
  });

  Template.SideNav.helpers({
    projectName: function() {
      return this.name;
    },

    toUpperCase: function(str) {
      return str.toUpperCase();
    },

    blocks: function() {
      // "this" refers to what's returned
      // by iron router's data function: project object in this case
      var projectId = this._id;
      return Blocks.find({projectId: projectId});
    },

    trials: function (blockId) {
      return Trials.find({blockId: blockId});
    }
  });

  Template.SideNav.events({
    "click .project-name": function (e, template) {
      if ($('.sidenav-container').hasClass("collasped-left")){
        $('.sidenav-container').removeClass("collasped-left").addClass("expanded-left");
      } else {
        $('.sidenav-container').removeClass("expanded-left").addClass("collasped-left");
      }
    },

    "click .block-item": function (e, template) {
      $(e.currentTarget).toggleClass('is-open');
      Session.set("currentView", "blockView");
      Session.set("blockId", this._id);
    },

    "click .trial-item": function (e, template) {
      e.stopPropagation();
      Session.set("currentView", "trialView");
      Session.set("trialId", this._id);
    },

    "click .add-block": function (e, template) {
      e.stopPropagation();
      var projectId = this._id;
      var blockLength = Blocks.find({projectId: projectId}).count();
      Meteor.call("addBlock", {
        projectId: projectId,
        name: "Block " + blockLength,
        index: blockLength
      });
    },

    "click .add-trial": function (e, template) {
      e.stopPropagation();
      var projectId = this.projectId;
      var blockId = this._id;
      var trialLength = Trials.find({blockId: blockId}).count();
      Meteor.call("addTrial", {
        projectId: projectId,
        blockId: blockId,
        name: "Trial " + trialLength,
        index: trialLength
      });
    },

    "click .trial-edit-link": function (e, template) {
      e.stopPropagation();
    },

    "click .trial-delete-link": function (e, template) {
      e.stopPropagation();
      var trialId = this._id;
      Meteor.call("deleteTrial", trialId);
    }
  });
}

if (Meteor.isClient) {
  Template.SideNav.onRendered(function() {
    this.$('.block-items').sortable({
      cancel: ".add-block, .add-trial",
      items: "> li",
      update: function (e, ui) {
        $('.block-item').each(function (idx, el) {
          var context = Blaze.getData(el);
          var blockId = context._id;
          Meteor.call("changeBlockIndex", blockId, idx);
        });
      }
    });

    this.$('.trial-items').sortable({
      cancel: ".add-block, .add-trial",
      items: "> li",
      update: function (e, ui) {
        $('.trial-item').each(function (idx, el) {
          var context = Blaze.getData(el);
          var trialId = context._id;
          Meteor.call("changeTrialIndex", trialId, idx);
        });
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
      return Blocks.find({projectId: projectId}, {sort: {index: 1}});
    },

    trials: function (blockId) {
      return Trials.find({blockId: blockId}, {sort: {index: 1}});
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

    "click .block-delete-link": function (e, template) {
      e.stopPropagation();
      var blockId = this._id;
      Meteor.call("deleteBlocks", [blockId]);
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

    "mouseover .trial-item-link": function (e, template) {
      $('.sidenav-container').find('.show-inline-block').removeClass('show-inline-block');
      $(e.target).parent().find('.trial-delete-link').addClass('show-inline-block');
    },

    "mouseleave .trial-item": function (e, template) {
      $('.sidenav-container').find('.show-inline-block').removeClass('show-inline-block');
    },

    "click .trial-delete-link": function (e, template) {
      e.stopPropagation();
      var trialId = this._id;
      Meteor.call("deleteTrials", [trialId]);
    }
  });
}

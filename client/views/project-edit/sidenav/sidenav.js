if (Meteor.isClient) {
  var makeBlocksSortable = function() {
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
  };

  var makeTrialsSortable = function (trialItems) {
    // must be called again when a new block has been created
    var trialItems = trialItems || $('.trial-items');

    trialItems.sortable({
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
  }

  Template.SideNav.onRendered(function() {
    makeBlocksSortable();
    makeTrialsSortable();

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
      Meteor.call("addBlock", {
        projectId: projectId,
      }, function() {
        var lastBlock = $('li.block-item').last();
        var trialItems = lastBlock.children('.trial-items');
        makeTrialsSortable(trialItems);
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
      Meteor.call("addTrial", {
        projectId: projectId,
        blockId: blockId
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

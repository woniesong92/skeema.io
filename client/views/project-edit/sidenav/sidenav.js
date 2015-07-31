if (Meteor.isClient) {
  var _expandSidenav = function() {
    $('.sidenav-container').removeClass("collasped-left").addClass("expanded-left");
  };

  var _collapseSidenav = function() {
    $('.sidenav-container').removeClass("expanded-left").addClass("collasped-left");
  }

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
        $(this).find('.trial-item').each(function (idx, el) {
          var context = Blaze.getData(el);
          var trialId = context._id;
          Meteor.call("changeTrialIndex", trialId, idx);
        });
      }
    });
  }

  Template.SideNav.onCreated(function() {
    this.autorun(function() {
      var shouldExpandSideNav = ProjectEditSession.get("shouldExpandSideNav");
      if (shouldExpandSideNav) {
        _expandSidenav();

        //to prevent undefined session variable from invoking function, use "false"
      } else if (shouldExpandSideNav === false) {
        _collapseSidenav();
      }
    });
  })

  Template.SideNav.onRendered(function() {
    makeBlocksSortable();
    makeTrialsSortable();

    this.$('.block-items, .trial-items').disableSelection();

    // open the first block, first trial
    $(this.$('.block-item')[0]).addClass('is-open');
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
    },

    isActiveTrial: function (trialId) {
      return ProjectEditSession.get("trialId") == this._id;
    },

    // blockName: function (){
    //   var blockId = ProjectEditSession.get('blockId');
    //   if (blockId){
    //     return Blocks.findOne({_id: blockId}).name;
    //   }
    //   return "";
    // },

    // trialName: function (){
    //   var trialId = ProjectEditSession.get('trialId');
    //   if (trialId){
    //     return Trials.findOne({_id: trialId}).name;
    //   }
    //   return "";
    // },

    // frameName: function (){
    //   var frameId = ProjectEditSession.get('frameId');
    //   if (frameId){
    //     return Frames.findOne({_id: frameId}).name;
    //   }
    //   return "";
    // },

  });

  Template.SideNav.events({
    "change #project-name-sidenav": function (e, template) {
      var newname = $('#project-name-sidenav').val().trim();
      var projectId = this._id;
      Meteor.call('renameProject', projectId, newname);
    },

    "click .project-name i": function (e, template) {
      if ($('.sidenav-container').hasClass("collasped-left")){
        _expandSidenav();
      } else {
        _collapseSidenav();
      }
    },

    "click .block-item": function (e, template) {
      $(e.currentTarget).toggleClass('is-open');
      ProjectEditSession.set("currentView", "blockView");
      ProjectEditSession.set("blockId", this._id);
      ProjectEditSession.set("frameId", null);
      ProjectEditSession.set("trialId", null);
    },

    "click .trial-item": function (e, template) {
      e.stopPropagation();
      ProjectEditSession.set("currentView", "trialView");
      ProjectEditSession.set("trialId", this._id);
      var trial = Trials.findOne({_id: this._id});
      if (trial) {
        ProjectEditSession.set("blockId", trial.blockId);
      }
      ProjectEditSession.set("frameId", null);
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
      var numBlocks = Blocks.find().count();
      if (numBlocks <= 1) {
        Utils.toast("<center>YOU MUST HAVE AT LEAST ONE BLOCK</center>", {
          type: "danger",
          ele: '.workspace-container',
          align: 'center',
          offset: {from: 'bottom', amount: 97},
          width: 400,
        });
        return false;
      }
      Meteor.call("deleteBlocks", [blockId]);
    },

    "click .block-copy-link": function (e, template) {
      var blockId = this._id;
      var projectId = this.projectId;
      Meteor.call("makeBlockDuplicate", blockId, projectId);
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

    // "click li.trial-item": function (e, template) {
    //   $('.active-background').removeClass('active-background');
    //   $(e.currentTarget).addClass("active-background");
    // },

    "click .trial-edit-link": function (e, template) {
      e.stopPropagation();
    },

    "mouseover .trial-item-link": function (e, template) {
      $('.sidenav-container').find('.show-inline-block').removeClass('show-inline-block');
      $(e.target).parent().find('.trial-delete-link').addClass('show-inline-block');
      $(e.target).parent().find('.trial-copy-link').addClass('show-inline-block');
    },

    "mouseleave .trial-item": function (e, template) {
      $('.sidenav-container').find('.show-inline-block').removeClass('show-inline-block');
    },

    "click .trial-delete-link": function (e, template) {
      e.stopPropagation();
      var numTrials = Trials.find({blockId: this.blockId}).count();
      if (numTrials <= 1) {
        Utils.toast("<center>EACH BLOCK MUST HAVE AT LEAST ONE TRIAL</center>", {
          type: "danger",
          ele: '.workspace-container',
          align: 'center',
          offset: {from: 'bottom', amount: 97},
          width: 400,
        });
        return false;
      }

      var trialId = this._id;
      Meteor.call("deleteTrials", [trialId], function(err){
        if (err) {
          console.log(err);
          return false;
        }
          var $trialsItems = $(e.target).parents('.block-item').find('.trial-item');
         $trialsItems.each(function (idx, el) {
          var context = Blaze.getData(el);
          var trialId = context._id;
          Meteor.call("changeTrialIndex", trialId, idx);
        });
      });
    },

    "click .trial-copy-link": function (e, template) {
      var trialId = this._id;
      var blockId = this.blockId;
      Meteor.call("makeTrialDuplicate", trialId, blockId);
    },

    "click .block-breadcrumb": function (e, template) {
      ProjectEditSession.set("currentView", "blockView");
      ProjectEditSession.set("trialId", null);
      ProjectEditSession.set("frameId", null);
    },

    "click .trial-breadcrumb": function (e, template) {
      ProjectEditSession.set("currentView", "trialView");
      ProjectEditSession.set("frameId", null);
    },
  });
}

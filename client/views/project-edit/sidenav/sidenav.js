if (Meteor.isClient) {

  Template.SideNav.helpers({
    projectName: function() {
      return this.name;
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
    "click .block-item": function (e, template) {
      // debugger
      $(e.target).closest('.block-item').toggleClass('is-open');
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
      
    }
  });
}

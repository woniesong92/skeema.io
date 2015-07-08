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
      debugger
      return Trials.find({blockId: blockId});
    }

  });

  Template.SideNav.events({
    "click .project-item .rename": function (e, template) {
      // NOT implemented
    },
  });
}

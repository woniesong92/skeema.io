if (Meteor.isClient) {

  Template.SideNav.helpers({
    blocks: function() {
      // How can I retrieve the projectId here?
      debugger
      var projectId = 1;
      return Projects.find({_id: projectId}); // is UI.getData() the right choice?
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

if (Meteor.isClient) {

  Template.LeftNav.helpers({
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

  Template.LeftNav.events({
    "click .project-item .rename": function (e, template) {
      // NOT implemented
    },
  });
}

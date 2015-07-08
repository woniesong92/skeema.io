if (Meteor.isClient) {

  Template.ProjectEdit.helpers({
    project: function() {
      return this;
    }
  });

  Template.ProjectEdit.events({
  //   "click .project": function (e, template) {
  //     
  //   },
  });
}
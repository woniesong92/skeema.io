if (Meteor.isClient) {

  Template.ProjectEdit.helpers({
    project: function() {
      // debugger
      return this;
    }
  });

  Template.ProjectEdit.events({
  //   "click .project": function (e, template) {
  //     
  //   },
  });
}
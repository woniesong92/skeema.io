if (Meteor.isClient) {

  Template.ToolBox.helpers({
    // isMine: function(owner) {
    //   return owner == Meteor.userId();
    // }
  });

  Template.ToolBox.rendered = function () {
    
  }

  Template.ToolBox.events({
  //   "click .project": function (e, template) {
  //     
  //   },
  });
}
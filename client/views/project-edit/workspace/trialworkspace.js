if (Meteor.isClient) {

  Template.TrialWorkSpace.helpers({
    // projects: function() {
    //   return UI.getData();
    // }
  });

  Template.TrialWorkSpace.rendered = function () {
    
  }

  Template.TrialWorkSpace.events({
    // "click .frame-item": function (e, template) {
    //   Session.set("currentView", "frameView");
    //   Session.set("id", this._id);
    // },
  });
}
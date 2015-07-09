if (Meteor.isClient) {

  Template.FrameToolBox.helpers({
    // isMine: function(owner) {
    //   return owner == Meteor.userId();
    // }
  });

  Template.FrameToolBox.rendered = function () {
    Session.set("addText", false);
    Session.set("addImage", false);
    Session.set("addButton", false);
  }

  Template.FrameToolBox.events({
  });

  Template.FrameElements.events({
    'click .add-text-btn': function (e, template) {
      Session.set("addText", true);
    },
    'click .add-img-btn': function (e, template) {
      Session.set("addImage", true);
    },
    'click .add-btn-btn': function (e, template) {
      Session.set("addButton", true);
    },
  });
}
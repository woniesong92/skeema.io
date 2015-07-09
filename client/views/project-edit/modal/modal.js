if (Meteor.isClient) {

  Template.Modal.helpers({

  });

  Template.Modal.rendered = function () {
     $('select').material_select();
  }

  Template.Modal.events({

  });
}
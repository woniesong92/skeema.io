if (Meteor.isClient) {

  Template.FrameWorkSpace.helpers({
    // projects: function() {
    //   return UI.getData();
    // }
  });

  Template.FrameWorkSpace.rendered = function () {

    $( ".draggable" ).draggable();

    if (Session.get("getAddText")) {
      //TODO: ADD TEXT FIELD
    }
    if (Session.get("getAddImage")) {
      //TODO: UPLOAD IMAGE
    }
    if (Session.get("getAddButton")) {
      
      //FIXME: haven't tested this yet
      $('.frame-workspace-container').append('<a class="btn draggable"><a/>');
    }

  }

  Template.FrameWorkSpace.events({
  //   "click .project": function (e, template) {
  //     
  //   },
  });
}
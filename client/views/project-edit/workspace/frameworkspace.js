if (Meteor.isClient) {

  Template.FrameWorkSpace.helpers({
    // projects: function() {
    //   return UI.getData();
    // }
  });

  Template.FrameWorkSpace.rendered = function () {

    $( ".draggable" ).draggable();
    var projectId = this._id;

    if (Session.get("getAddText")) {
      Meteor.call("addElement", {
        projectId: projectId,
        frameId: "Block " + blockLength,
        index: blockLength
      });
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
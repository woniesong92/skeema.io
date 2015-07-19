if (Meteor.isClient) {

  Template.FrameModal.helpers({

  });

  Template.FrameModal.rendered = function () {
    if (Session.get("chooseClick")){
      var sourceId = Paths.findOne({_id: Session.get("pathId")}).sourceId;
      var frameElts = Elements.find({"frameId": Session.get("frameId") });
      frameElts.forEach(function(elt) {
          $('.frame-workspace-container').append(elt.html);
      });

    }
  }

  Template.FrameModal.events({

    'click .element-item': function (e, template) {
      Session.set("chooseClick", false);
      Meteor.call("updatePathEvent", {
          pathId: Session.get("pathId"),
          eventType: 'click',
          eventParam: e.target.id
        });

      // clear elements before closing the modal
      $('.frame-modal-content').html("");
      $('#modal').closeModal();
    }

  });
}
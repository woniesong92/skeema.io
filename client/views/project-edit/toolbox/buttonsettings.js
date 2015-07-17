if (Meteor.isClient) {

  Template.ButtonSettings.helpers({
    // isMine: function(owner) {
    //   return owner == Meteor.userId();
    // }
  });

  Template.ButtonSettings.rendered = function () {

    $('#button-text-colorpicker').colorpicker({
      displayIndicator: false
    });

    $('#button-bg-colorpicker').colorpicker({
      displayIndicator: false
    });
  }

  Template.ButtonSettings.events({
    'change #element-content': function(e, template) { 
      var newcontent = $('#element-content').val().trim();
      var elementId = Session.get("elementId");
      $('#' + elementId).text(newcontent);
    },
  });
}
if (Meteor.isClient) {

  Template.TextSettings.helpers({
    // isMine: function(owner) {
    //   return owner == Meteor.userId();
    // }
  });


  Template.TextSettings.rendered = function () {
    $('#text-colorpicker').colorpicker({
      displayIndicator: false
    });
  }

  Template.TextSettings.events({
    'change #element-content': function(e, template) { 
      var newcontent = $('#element-content').val().trim();
      var elementId = Session.get("elementId");
      $('#' + elementId).text(newcontent);
    },

  });
}
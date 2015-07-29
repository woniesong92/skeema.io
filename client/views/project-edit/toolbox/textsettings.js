if (Meteor.isClient) {
  Template.TextSettings.onRendered(function() {
    $('#text-colorpicker').colorpicker({
      displayIndicator: false
    });
  });

  Template.TextSettings.events({
    'change.color #text-colorpicker': function(e, template) { 
      var newcolor = $('#text-colorpicker').val().trim();
      var elementId = ProjectEditSession.get("elementId");
      $('#' + elementId).css('color', newcolor + ' !important');
      saveNewHTML(elementId);
    },

    'change #fontsize': function (e, template) { 
      var newsize = $('#fontsize').val().trim();
      var elementId = ProjectEditSession.get("elementId");
      $('#' + elementId).css('font-size', newsize + 'px');
      saveNewHTML(elementId);
    },
  });
}

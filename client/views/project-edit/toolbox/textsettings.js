if (Meteor.isClient) {
  Template.TextSettings.onRendered(function() {
    $('#text-colorpicker').colorpicker({
      displayIndicator: false
    });

    this.autorun(function() {
      var elementId = ProjectEditSession.get("elementId");
      if (elementId){
        var elementId = ProjectEditSession.get("elementId");
        var color = $("#" + elementId).css("color");
        $(".text-color-panel .evo-pointer.evo-colorind").css("background-color", color);
      }
    });

  });

  Template.TextSettings.events({
    'change.color #text-colorpicker': function(e, template) { 
      var newcolor = $('#text-colorpicker').val().trim();
      var elementId = ProjectEditSession.get("elementId");
      $('#' + elementId).css('color', newcolor + ' !important');
      // $(".text-color-panel .evo-pointer.evo-colorind").css("background-color", newcolor);
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

if (Meteor.isClient) {
  Template.ButtonSettings.onRendered(function() {
    $('#button-text-colorpicker').colorpicker({
      displayIndicator: false
    });

    $('#button-bg-colorpicker').colorpicker({
      displayIndicator: false
    });
  });

  Template.ButtonSettings.events({
    'change.color #button-text-colorpicker': function(e, template) { 
      var newcolor = $('#button-text-colorpicker').val().trim();
      var elementId = ProjectEditSession.get("elementId");
      $('#' + elementId).css('color', newcolor + ' !important');
      saveNewHTML(elementId);
    },

    'change.color #button-bg-colorpicker': function(e, template) { 
      // debugger
      var newcolor = $('#button-bg-colorpicker').val().trim();
      var elementId = ProjectEditSession.get("elementId");
      $('#' + elementId).css('background-color', newcolor + ' !important');
      saveNewHTML(elementId);
    },

    'change #button-fontsize': function (e, template) {
      //FIXME: NEED TO VERTICAL ALIGN BUTTON TEXT
      var newsize = $('#button-fontsize').val().trim();
      var newheight = parseFloat(newsize) * 2;
      var newlineheight = parseFloat(newsize) * 1.5;
      var elementId = ProjectEditSession.get("elementId");
      $('#' + elementId).css('font-size', newsize + 'px')
        .css('height', newheight + 'px').css('line-height', newlineheight + 'px');
      saveNewHTML(elementId);
    },
  });
}
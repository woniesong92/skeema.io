if (Meteor.isClient) {

  Template.ButtonSettings.helpers({
    
  });

  Template.ButtonSettings.onRendered(function() {
    $('#button-text-colorpicker').colorpicker({
      displayIndicator: false
    });

    $('#button-bg-colorpicker').colorpicker({
      displayIndicator: false
    });

    this.autorun(function() {
      var elementId = ProjectEditSession.get("elementId");
      if (elementId){
        var elementId = ProjectEditSession.get("elementId");
        var bgcolor =  $("#" + elementId).css("background-color");
        var color = $("#" + elementId).css("color");
        $(".bg-color-panel .evo-pointer.evo-colorind").css("background-color", bgcolor);
        $(".text-color-panel .evo-pointer.evo-colorind").css("background-color", color);
      }
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
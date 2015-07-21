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
    // 'change #element-content': function(e, template) { 
    //   var newcontent = $('#element-content').val().trim();
    //   var elementId = Session.get("elementId");
    //   $('#' + elementId).text(newcontent);
    // },
    'change.color #button-text-colorpicker': function(e, template) { 
      // debugger
      var newcolor = $('#button-text-colorpicker').val().trim();
      var elementId = Session.get("elementId");
      $('#' + elementId).css('color', newcolor + ' !important');
    },

    'change.color #button-bg-colorpicker': function(e, template) { 
      // debugger
      var newcolor = $('#button-bg-colorpicker').val().trim();
      var elementId = Session.get("elementId");
      $('#' + elementId).css('background-color', newcolor + ' !important');
    },

    'change #button-fontsize': function (e, template) { 
      var newsize = $('#button-fontsize').val().trim();
      var newheight = parseFloat(newsize) * 2;
      var newlineheight = newheight;
      var elementId = Session.get("elementId");
      $('#' + elementId).css('font-size', newsize + 'px')
        .css('height', newheight + 'px').css('line-height', newlineheight + 'px');
    },

  });
}
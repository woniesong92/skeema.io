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
    // 'change #element-content': function(e, template) { 
    //   var newcontent = $('#element-content').val().trim();
    //   var elementId = Session.get("elementId");
    //   $('#' + elementId).text(newcontent);
    // },
    'change.color #text-colorpicker': function(e, template) { 
      // debugger
      var newcolor = $('#text-colorpicker').val().trim();
      var elementId = Session.get("elementId");

      //FIXME: how to select without id?
      $('#' + elementId).css('color', newcolor + ' !important');

      // save new html automatically
      var currentHTML = $('#' + elementId).prop('outerHTML');
      Meteor.call("setHTML", elementId, currentHTML, function (err){
        if (err){
          console.log("saving HTML changes failed for " + elementId);
          return false;
          }
      });
    },

    'change #fontsize': function (e, template) { 
      var newsize = $('#fontsize').val().trim();
      var elementId = Session.get("elementId");
      $('#' + elementId).css('font-size', newsize + 'px');
      
      // save new html automatically
      var currentHTML = $('#' + elementId).prop('outerHTML');
      Meteor.call("setHTML", elementId, currentHTML, function (err){
        if (err){
          console.log("saving HTML changes failed for " + elementId);
          return false;
          }
      });

    },

  });
}
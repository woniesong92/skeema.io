function isPositiveInteger (str) {
    return /^\d+$/.test(str);
}

if (Meteor.isClient) {

  Template.Modal.helpers({

  });

  Template.Modal.rendered = function () {
     $('select').material_select();
  }

  Template.Modal.events({
    'change #event-picker': function(e, template) { 
        var pickedevent = $('#event-picker').val();
        $('.show').removeClass('show');
        $('.modal input').val("");
        $('#create-path-btn').addClass('disabled');
        switch (pickedevent) {
          case "keypress":
            $('.key-options').addClass('show');
            break;
          case "time":
            $('.time-options').addClass('show');
            break;
          case "click":
            // zoom into frame, prompt element selection
            break;
          default:
            break;
        }
    },
    'keyup #key': function (e, template) {
      var key = $.trim($('#key').val());
      if (key.length > 0) {
        $('#create-path-btn').removeClass('disabled');
      } else {
        $('#create-path-btn').addClass('disabled');
      }
    },
    'change #duration': function (e, template) {
      var duration = $.trim($('#duration').val());
      if (duration.length > 0 && isPositiveInteger(duration)) {
        $('#create-path-btn').removeClass('disabled');
      } else {
        $('#create-path-btn').addClass('disabled');
      }
    },

    'click #create-path-btn': function (e, template) {

    }

  });
}
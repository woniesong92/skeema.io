function isPositiveInteger (str) {
    return /^\d+$/.test(str);
}

function onDurationChange() {
  var duration = $.trim($('#duration').val());
  if (duration.length > 0 && isPositiveInteger(duration)) {
    $('.create-path-btn').removeClass('disabled');
  } else {
    $('.create-path-btn').addClass('disabled');
  }
}

if (Meteor.isClient) {

  Template.Modal.helpers({

  });

  Template.Modal.rendered = function () {
     $('select').material_select();
     Session.set("chooseClick", false);
  }

  Template.Modal.events({
    'change #event-picker': function(e, template) { 
        var pickedevent = $('#event-picker').val();
        $('.show').removeClass('show');
        $('.modal input').val("");
        $('.create-path-btn').addClass('disabled');
        switch (pickedevent) {
          case "keypress":
            $('.key-options').addClass('show');
            break;
          case "time":
            $('.time-options').addClass('show');
            break;
          case "click":
            $('.create-path-btn').removeClass('disabled');

            // FIXME: zoom into frame, prompt element selection
            break;
          default:
            break;
        }
    },

    'keyup #key': function (e, template) {
      var key = $.trim($('#key').val());
      if (key.length > 0) {
        $('.create-path-btn').removeClass('disabled');
      } else {
        $('.create-path-btn').addClass('disabled');
      }
    },

    'change #duration': function (e, template) {
      onDurationChange();
    },

    'keyup #duration': function (e, template) {
      onDurationChange();
    },

    'click .create-path-btn': function (e, template) {
      var eventType = $('#event-picker').val();
      var eventParam;
      if (eventType === 'keypress') {
        eventParam = $.trim($('#key').val());
      } else if (eventType === 'time') {
        eventParam = $.trim($('#duration').val());
      } else {
        // FIXME: this eventParam will be the element to be clicked
        eventParam = null;
        Session.set("chooseClick", true);
        // $('#modal').closeModal();
        $('#frame-modal').openModal();
      }

        Meteor.call("updatePathEvent", {
          pathId: Session.get("pathId"),
          eventType: eventType,
          eventParam: eventParam
        });
        $('#modal').closeModal();
    },

  });
}
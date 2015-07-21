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
      var pathInfo = Session.get("pathInfo");

      if (eventType === 'keypress') {
        eventParam = $.trim($('#key').val());
      } else if (eventType === 'time') {
        eventParam = $.trim($('#duration').val());
      } else {
        // since this is a click event, we have to show
        // the frame workspace temporarily for him to
        // choose an element

        Session.set("showFrameWorkspace", {
          sourceFrame: pathInfo.sourceFrame,
          pathId: pathInfo.pathId
        });

        eventParam = null;
      }

      Meteor.call("updatePathEvent", {
        pathId: pathInfo.pathId,
        eventType: eventType,
        eventParam: eventParam
      });

      $('#modal').closeModal();
    },

    'click .delete-path-btn': function (e, template) {
      var pathInfo = Session.get("pathInfo");
      Meteor.call("deletePaths", [pathInfo.pathId]);
    }
  });
}
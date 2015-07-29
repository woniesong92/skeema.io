var isPositiveInteger = function (str) {
  return /^\d+$/.test(str);
}

var _onDurationChange = function() {
  var duration = $.trim($('#duration').val());
  if (duration.length > 0 && isPositiveInteger(duration)) {
    $('.create-path-btn').removeClass('disabled');
  } else {
    $('.create-path-btn').addClass('disabled');
  }
}

if (Meteor.isClient) {
  Template.Modal.onCreated(function() {
    var self = this;
    this.pathInfo = null;

    this.autorun(function() {
      var pathInfo = ProjectEditSession.get("pathInfo");
      if (pathInfo) {
        self.pathInfo = pathInfo;

        // FIXME: should it be done as "modal shown" event callback instead?
        $('.default-option').prop("selected", true);
        $('.show').removeClass('show');

        // _.each(pathInfo.existingEventTypes, function (eventType) {
        //   if (eventType) {
        //     $('#event-picker option[value="'+eventType+'"]')
        //       .attr('disabled', 'disabled')
        //       .text(eventType +" - Path exists already");
        //   }
        // })
      }
    });
  })

  Template.Modal.events({
    'change #event-picker': function (e, template) {
      var pathInfo = template.pathInfo;
      var pickedevent = $('#event-picker').val();

      $('.create-path-btn').addClass('disabled');
      $('.show').removeClass('show');
      $('.modal input').val("");

      if (pickedevent === "keypress") {
        $('.key-options').addClass('show');
      } else if (pickedevent === "time") {
        $('.time-options').addClass('show');
      } else { // click
        if (pathInfo) {
          var numElts = Elements.find({frameId: pathInfo.sourceFrame}).count();
          if (numElts < 1) {
            $('.click-error-msg').addClass('show');
          } else {
            $('.create-path-btn').removeClass('disabled');
          }
        }
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
      _onDurationChange();
    },

    'keyup #duration': function (e, template) {
      _onDurationChange();
    },

    'click .create-path-btn': function (e, template) {
      var eventType = $('#event-picker').val();
      var eventParam;
      var pathInfo = template.pathInfo;

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
    },

    'click .delete-path-btn': function (e, template) {
      var pathInfo = template.pathInfo;
      Meteor.call("deletePaths", [pathInfo.pathId]);
    }
  });
}

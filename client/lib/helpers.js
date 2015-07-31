Meteor.startup(function() {
  if (Meteor.isClient) {
    // Global Constants
    BLOCK_VIEW = "blockView";
    TRIAL_VIEW = "trialView";
    FRAME_VIEW = "frameView";

    // Util helpers
    Utils = {};

    // Fisher-Yates Shuffle
    Utils.shuffle = function (array) {
      var counter = array.length;
      var temp;
      var index;

      // While there are elements in the array
      while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }

      return array;
    };

    Utils.toast = function (message, options) {
      var defaultOpt = {
        ele: '.toast-container', // which element to append to
        type: 'success', // (null, 'info', 'danger', 'success')
        offset: {from: 'top', amount: 97}, // 'top', or 'bottom'
        align: 'right', // ('left', 'right', or 'center')
        width: 220, // (integer, or 'auto')
        delay: 3000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
        allow_dismiss: true, // If true then will display a cross to close the popup.
        stackup_spacing: 10
      }

      var newOpt = _.extend(defaultOpt, options);
      $.bootstrapGrowl(message, newOpt);
    }

    // Other function helpers
    saveNewHTML = function (elementId) {
      var currentHTML = $('#' + elementId).prop('outerHTML');
      Meteor.call("setHTML", elementId, currentHTML, function (err) {
        if (err) {
          console.log("saving HTML changes failed for " + elementId);
          return false;
        }
      });
    };

    // Template Handlebar helpers
    Template.registerHelper("isProjectView", function (event, template) {
      return ProjectEditSession.get("currentView") !== "projectListView";
    });

    Template.registerHelper("isBlockView", function (event, template) {
      return ProjectEditSession.get("currentView") === BLOCK_VIEW;
    });

    Template.registerHelper("isTrialView", function (event, template) {
      return ProjectEditSession.get("currentView") === TRIAL_VIEW;
    });

    Template.registerHelper("isFrameView", function (event, template) {
      return ProjectEditSession.get("currentView") === FRAME_VIEW;
    });

    Template.registerHelper("block", function (event, template) {
      var blockId = ProjectEditSession.get("blockId");
      return Blocks.findOne({_id: blockId});
    });

    Template.registerHelper("trial", function (event, template) {
      var trialId = ProjectEditSession.get("trialId");
      return Trials.findOne({_id: trialId});
    });

    Template.registerHelper("frame", function (event, template) {
      var frameId = ProjectEditSession.get("frameId");
      return Frames.findOne({_id: frameId});
    });

    Template.registerHelper("element", function (event, template) {
      var elementId = ProjectEditSession.get("elementId");
      return Elements.findOne({_id: elementId});
    });

    Template.registerHelper("path", function (event, template) {
      var pathId = ProjectEditSession.get("pathId");
      if (pathId != null){
        return Paths.findOne({_id: pathId});
      }
      return false;
    });

    Template.registerHelper('isAdmin', function() {
      return (Meteor.user() && Meteor.user().role === "admin");
    });

    Template.registerHelper('formatDate', function (date) {
      return moment(date).format('MMMM Do YYYY, h:mm a');
    });

    // handlebar each function with index
    Template.registerHelper('withIndex', function (context, options) {
      if (context) {
        return context.map(function (item, idx) {
          item.index = idx;
          return item;
        });
      }
    });

    // FIXME: Can me merge the below three helpers into one?
    Template.registerHelper("selectedIsText", function (event, template) {
      var elementId = ProjectEditSession.get("elementId");
      if (elementId != null) {
        var element = Elements.findOne({_id: elementId});
        if (element) {
          return element.type === "text";
        }
      }
      return false;
    });

    Template.registerHelper("selectedIsButton", function (event, template) {
      var elementId = ProjectEditSession.get("elementId");
      if (elementId != null) {
        var element = Elements.findOne({_id: elementId});
        if (element) {
          return element.type === "button";
        }
      }
      return false;
    });

    Template.registerHelper("selectedIsImage", function (event, template) {
      var elementId = ProjectEditSession.get("elementId");
      if (elementId != null) {
        var element = Elements.findOne({_id: elementId});
        if (element) {
          return element.type === "image";
        }
      }
      return false;
    });

    Template.registerHelper("color", function (event, template) {
      var elementId = ProjectEditSession.get("elementId");
      return $('#' + elementId).css('color');
    });

    Template.registerHelper("backgroundColor", function (event, template) {
      var elementId = ProjectEditSession.get("elementId");
      return $('#' + elementId).css('background-color');
    });

    Template.registerHelper("fontSize", function (event, template) {
      var elementId = ProjectEditSession.get("elementId");
      return parseFloat($('#' + elementId).css('font-size'));
    });

    Template.registerHelper("textContent", function (event, template) {
      var elementId = ProjectEditSession.get("elementId");
      return $('#' + elementId).text();
    });

  }
});
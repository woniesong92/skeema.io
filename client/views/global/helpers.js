// Global helpers

if (Meteor.isClient) {

  Template.registerHelper("isBlockView", function (event, template) {
    return Session.get("currentView") == "blockView";
  });

  Template.registerHelper("isTrialView", function (event, template) {
    return Session.get("currentView") == "trialView";
  });

  Template.registerHelper("isFrameView", function (event, template) {
    return Session.get("currentView") == "frameView";
  });

  Template.registerHelper("block", function (event, template) {
    var blockId = Session.get("blockId");
    return Blocks.findOne({_id: blockId});
  });

  Template.registerHelper("trial", function (event, template) {
    var trialId = Session.get("trialId");
    return Trials.findOne({_id: trialId});
  });

  Template.registerHelper("frame", function (event, template) {
    var frameId = Session.get("frameId");
    return Frames.findOne({_id: frameId});
  });

  Template.registerHelper("element", function (event, template) {
    var elementId = Session.get("elementId");
    return Elements.findOne({_id: elementId});
  });

  // FIXME: there is no reason to have three functions for this.
  Template.registerHelper("selectedIsText", function (event, template) {
    var elementId = Session.get("elementId");
    if (elementId != null) {
      var element = Elements.findOne({_id: elementId});
      if (element) {
        return element.type === "text";
      }
    }
    return false;
  });

  Template.registerHelper("selectedIsButton", function (event, template) {
    var elementId = Session.get("elementId");
    if (elementId != null) {
      var element = Elements.findOne({_id: elementId});
      if (element) {
        return element.type === "button";
      }
    }
    return false;
  });

  Template.registerHelper("selectedIsImage", function (event, template) {
    var elementId = Session.get("elementId");
    if (elementId != null) {
      var element = Elements.findOne({_id: elementId});
      if (element) {
        return element.type === "image";
      }
    }
    return false;
  });

  Template.registerHelper("path", function (event, template) {
    var pathId = Session.get("pathId");
    if (pathId != null){
      return Paths.findOne({_id: pathId});
    }
    return false;
  });

  // Template.registerHelper("sourceId", function (event, template) {
  //   var pathId = Session.get("pathId");
  //   if (pathId != null){
  //     return Paths.findOne({_id: path}).sourceId;
  //   }
  //   return false;
  // });

  // Template.registerHelper("targetId", function (event, template) {
  //   var pathId = Session.get("pathId");
  //   if (pathId != null){
  //     return Paths.findOne({_id: path}).targetId;
  //   }
  //   return false;
  // });

  Template.registerHelper("color", function (event, template) {
    var elementId = Session.get("elementId");
    return $('#' + elementId).css('color');
  });

  Template.registerHelper("backgroundColor", function (event, template) {
    var elementId = Session.get("elementId");
    return $('#' + elementId).css('background-color');
  });

  Template.registerHelper("fontSize", function (event, template) {
    var elementId = Session.get("elementId");
    return parseFloat($('#' + elementId).css('font-size'));
  });

  Template.registerHelper("textContent", function (event, template) {
    var elementId = Session.get("elementId");
    return $('#' + elementId).text();
  });

  // Template.registerHelper("getAddButton", function (event, template) {
  //   return Session.get("addButton");
  // });

  // Template.registerHelper("getAddText", function (event, template) {
  //   return Session.get("addText");
  // });

  // Template.registerHelper("getAddImage", function (event, template) {
  //   return Session.get("addImage");
  // });
  

  // Template.registerHelper("isLoading", function() {
  //   return CourseSearch.getStatus().loading;
  // });

  Template.registerHelper('isAdmin', function() {
    return (Meteor.user() && Meteor.user().role == "admin");
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
}

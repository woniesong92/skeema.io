// Global helpers

if (Meteor.isClient) {

  Template.registerHelper("isBlockView", function(event, course) {
    return Session.get("currentView") == "blockView";
  });

  Template.registerHelper("isTrialView", function(event, course) {
    return Session.get("currentView") == "trialView";
  });

  Template.registerHelper("isFrameView", function(event, course) {
    return Session.get("currentView") == "frameView";
  });

  Template.registerHelper("block", function(event, course) {
    var blockId = Session.get("id");
    return Blocks.findOne({_id: blockId});
  });

  Template.registerHelper("trial", function(event, course) {
    var trialId = Session.get("id");
    return Trials.findOne({_id: trialId});
  });

  Template.registerHelper("frame", function(event, course) {
    var frameId = Session.get("id");
    return Frames.findOne({_id: frameId});
  });
  

  // Template.registerHelper("isLoading", function() {
  //   return CourseSearch.getStatus().loading;
  // });

  Template.registerHelper('isAdmin', function() {
    return (Meteor.user() && Meteor.user().role == "admin");
  });

  Template.registerHelper('formatDate', function(date) {
    return moment(date).format('MMMM Do YYYY, h:mm a');
  });
  
}

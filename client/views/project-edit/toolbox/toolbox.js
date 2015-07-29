if (Meteor.isClient) {
  Template.ToolBox.onRendered(function() {

  });

  Template.ToolBox.events({
    "click .toolbox-tab": function (e, template) {
      if ($('.toolbox-container').hasClass("collasped-right")){
        $('.toolbox-container').removeClass("collasped-right").addClass("expanded-right");
      } else {
        $('.toolbox-container').removeClass("expanded-right").addClass("collasped-right");
      }
    },
  });
}

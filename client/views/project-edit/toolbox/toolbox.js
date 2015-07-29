if (Meteor.isClient) {
  var _expandToolbox = function() {
    $('.toolbox-container').removeClass("collasped-right").addClass("expanded-right");
  };

  var _collapseToolbox = function() {
    $('.toolbox-container').removeClass("expanded-right").addClass("collasped-right");
  };

  Template.ToolBox.onCreated(function() {
    this.autorun(function() {
      var shouldExpandToolbox = ProjectEditSession.get("shouldExpandToolbox");
      if (shouldExpandToolbox) {
        _expandToolbox();

        //to prevent undefined session variable from invoking function, use "false"
      } else if (shouldExpandToolbox === false) {
        _collapseToolbox();
      }
    });
  })

  Template.ToolBox.events({
    "click .toolbox-tab": function (e, template) {
      if ($('.toolbox-container').hasClass("collasped-right")){
        _expandToolbox();
      } else {
        _collapseToolbox();
      }
    },
  });
}

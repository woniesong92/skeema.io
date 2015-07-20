if (Meteor.isClient) {

  Template.ToolBox.helpers({
    // isMine: function(owner) {
    //   return owner == Meteor.userId();
    // }
  });

  Template.ToolBox.rendered = function () {
    
  }

  Template.ToolBox.events({
    "click .toolbox-tab": function (e, template) {
      if ($('.toolbox-container').hasClass("collasped-right")){
        $('.toolbox-container').removeClass("collasped-right");
        $('.toolbox-container').addClass("expanded-right");
      } else {
        $('.toolbox-container').removeClass("expanded-right");
        $('.toolbox-container').addClass("collasped-right");
      }
    },
  });
}
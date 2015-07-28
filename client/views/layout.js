if (Meteor.isClient) {  

  Template.Layout.rendered = function() {
    var contentHeight = $(window).height() - 50;
	  $('body').css("height", contentHeight);
  }
}
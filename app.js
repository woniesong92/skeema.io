Meteor.startup(function() {
  if (Meteor.isClient) {
    // Do client side preparation
  }

  if (Meteor.isServer) {
    // Do server side preparation

    //http://stackoverflow.com/questions/26708437/require-jquery-in-meteor-server-side
    $ = Npm.require('jquery')(Npm.require('jsdom').jsdom().parentWindow);
  }
})
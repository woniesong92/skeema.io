if (Meteor.isClient) {

  Template.BlockToolBox.helpers({
    // isMine: function(owner) {
    //   return owner == Meteor.userId();
    // }
  });


  Template.BlockToolBox.rendered = function () {
    
  }


  Template.BlockToolBox.events({

    'change #blockname': function(e, template) { 
        var newname = $('#blockname').val().trim();
        var blockId = Session.get("blockId");
        Meteor.call('renameBlock', blockId, newname);
    },

    'change #randomize': function(e, template) { 
        var randbool = $('#randomize').is(':checked');
        var blockId = Session.get("blockId");
        Meteor.call('changeRandomize', blockId, randbool);
    }
  });


}
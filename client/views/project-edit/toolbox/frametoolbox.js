if (Meteor.isClient) {

  Template.FrameToolBox.helpers({
    // isMine: function(owner) {
    //   return owner == Meteor.userId();
    // }
  });

  Template.FrameToolBox.rendered = function () {
    Session.set("addText", false);
    Session.set("addImage", false);
    Session.set("addButton", false);
    // Session.set("elementAdded", null);
  }

  Template.FrameToolBox.events({

    'change #framename': function (e, template) { 
      var newname = $('#framename').val().trim();
      var frameId = Session.get("frameId");
      Meteor.call('renameFrame', frameId, newname);
    },

    'click .save-btn': function (e, template) {
      // for each .element-item
      $('.element-item').each(function (index){
          var newHTML = $(this).prop('outerHTML');
          Meteor.call("setHTML", this.id, newHTML, function(err){
            // debugger
            if (err){
              console.log("saving HTML changes failed for "+ this.id);
              return false;
            }
          });
      });
      Materialize.toast('Saved successfully', 4000);
    },

    'click .add-text-btn': function (e, template) {
      Session.set("addImage", false);
      Session.set("addButton", false);
      Session.set("addText", true);
    },

    'click .add-img-btn': function (e, template) {
      
    },

    'click .add-btn-btn': function (e, template) {
      Session.set("addImage", false);
      Session.set("addText", false);
      Session.set("addButton", true);
    },
    'click .remove-elt': function (e, template) {
      var elementId = Session.get("elementId");
      Meteor.call("deleteElement", elementId, function (e){
        if (e) {
          console.log("Deleting element "+elementId+" failed");
          return false;
        }
        Materialize.toast('Removed successfully', 4000);
        $('#'+elementId).remove();
      });
    },

  });
}
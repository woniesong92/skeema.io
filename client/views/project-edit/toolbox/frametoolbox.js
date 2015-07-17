if (Meteor.isClient) {

  Template.FrameToolBox.helpers({
    // isMine: function(owner) {
    //   return owner == Meteor.userId();
    // }
  });

  Template.FrameToolBox.rendered = function () {
    // Session.set("addText", false);
    // Session.set("addImage", false);
    // Session.set("addButton", false);
    Session.set("elementAdded", null);
  }

  Template.FrameToolBox.events({

    'click .save-btn': function (e, template) {
      // for each .element-item
      $('.element-item').each(function (index){
          var newHTML = $(this).prop('outerHTML');
          Meteor.call("setHTML", this.id, newHTML, function(err){
            debugger
            if (err){
              console.log("saving HTML changes failed for "+ this.id);
              return false;
            }
          });
      });
      Materialize.toast('Saved successfully', 4000);
    },

    'click .add-text-btn': function (e, template) {
      var projectId = this._id;
      // Session.set("addText", true);
       Meteor.call("addElement", {
        projectId: projectId,
        frameId: Session.get("frameId"),
        type: "text",
      }, function (err, elementId) {
       if (err) {
          console.log("Adding element failed", err);
          return false;
        }
        var htmlStr = "<span id= '" + elementId
                      + "' class='draggable element-item' "
                      + "style='font-family:Arial;"
                      + "font-size:18px;"
                      + "color:#000;"
                      + "position:absolute;"
                      + "top:50%;"
                      + "left:50%;'"
                      +">Text</span>";
        Meteor.call("setHTML", elementId, htmlStr, function(e) {
          if (e) {
            console.log("Setting selector failed");

            // Delete the object if setting HTML fails
            Meteor.call("deleteElement", elementId);
            return false;
          }
          Session.set("elementAdded", elementId);
        });
      });
    },

    'click .add-img-btn': function (e, template) {
      
    },

    'click .add-btn-btn': function (e, template) {
      var projectId = this._id;
      // Session.set("addText", true);
       Meteor.call("addElement", {
        projectId: projectId,
        frameId: Session.get("frameId"),
        type: "button",
      }, function (err, elementId){
       if (err) {
          console.log("Adding element failed", err);
          return false;
        }

        // removed the shadow on hover, but there's still lag when dragging
        var htmlStr = "<span id= '" + elementId
                      + "' class='btn btn-no-hover draggable element-item' "
                      +"style='font-family:Arial;"
                      + "font-size:18px;"
                      + "position:absolute;"
                      + "background-color:blue !important;"
                      + "color:#fff !important;"
                      + "top:50%;"
                      + "left:50%;'"
                      +">Button</span>";
        Meteor.call("setHTML", elementId, htmlStr, function(e) {
          if (e) {
            console.log("Setting selector failed");

            // Delete the object if setting HTML fails
            Meteor.call("deleteElement", elementId);
            return false;
          }
          Session.set("elementAdded", elementId);
        });
      });
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
if (Meteor.isClient) {


  Template.FrameWorkSpace.helpers({
    elements: function() {
      var frameId = Session.get('frameId');

      // check if new frame has just been added
      // this reactive var will make sure that every time
      // frameAdded value in Session changes, this function runs
      var elementId = Session.get("elementAdded");

      // return all frames whose parent is this trial
      return Elements.find({frameId: frameId});
    },

    isText: function() {
      return this.type == "text";
    },

    isButton: function () {
      return this.type == "button";
    },

    isImage: function () {
      return this.type == "image";
    }
  });


  Template.FrameWorkSpace.rendered = function () {

    Session.set("elementId", null);

    var frameElts = Elements.find({"frameId": Session.get("frameId") });
    frameElts.forEach(function(elt) {
        $('.frame-workspace-container').append(elt.html);
    });


    // FIXME: does not save the new position in the css..
    $( ".draggable" ).draggable({
          containment: ".frame-workspace-container",
          scroll: false,
          stop: function (event, ui) {
            console.log(this.id);
          }
        });


    this.autorun(function() {
      debugger
      var elementAdded = Session.get("elementAdded");
      if (elementAdded) {
        Session.set("elementAdded", null);
        console.log(elementAdded);
        //FIXME: IS THIS THE BEST WAY? Kind of repetitive..

        var elt = Elements.findOne({_id: elementAdded});
        $('.frame-workspace-container').append(elt.html);

        $( ".draggable" ).draggable({
          containment: ".frame-workspace-container",
          scroll: false,
          stop: function (event, ui) {
            console.log(this.id);
           }
         });

      }
    });
    
  }

  Template.FrameWorkSpace.events({

    "click .element-item": function (e, template) {
      Session.set("elementId", e.target.id);
    },
  });
}
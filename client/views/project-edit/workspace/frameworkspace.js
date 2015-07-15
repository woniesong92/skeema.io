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
    var sPositions = localStorage.positions || "{}",
    positions = JSON.parse(sPositions);
    $.each(positions, function (id, pos) {
        $("#" + id).css(pos)
    });

    $( ".draggable" ).draggable({
          containment: ".frame-workspace-container",
          scroll: false,
          stop: function (event, ui) {
            positions[this.id] = ui.position
            localStorage.positions = JSON.stringify(positions)
          }
        });

    this.autorun(function() {
      var elementId = Session.get("elementAdded");
      if (elementId) {
        console.log(elementId);
        //FIXME: IS THIS THE BEST WAY? Kind of repetitive..
        $( ".draggable" ).draggable({
          containment: ".frame-workspace-container",
          scroll: false,
          stop: function (event, ui) {
            positions[this.id] = ui.position
            localStorage.positions = JSON.stringify(positions)
          }
        });
      }
    });
    // var projectId = this._id;

    // if (Session.get("addText")) {
    //   //TODO
    //   Meteor.call("addElement", {
    //     projectId: projectId,
    //     frameId: Session.get("frameId"),
    //     index: blockLength
    //   });
    //   Session.set("addText", false);
    // }
    // if (Session.get("addImage")) {
    //   //TODO: UPLOAD IMAGE
    //   Session.set("addImage", false);
    // }
    // if (Session.get("addButton")) {
    //   debugger
    //   //FIXME: haven't tested this yet
    //   // $('.frame-workspace-container').append('<a class="btn draggable">HELLOOO<a/>');
    //   Session.set("addButton", false);
    // }

  }

  Template.FrameWorkSpace.events({
  //   "click .project": function (e, template) {
  //     
  //   },
  });
}
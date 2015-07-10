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
  }

  Template.FrameToolBox.events({
  });

  Template.FrameElements.events({
    'click .add-text-btn': function (e, template) {
      var projectId = this._id;
      var cssObj = {'color': '#000', 'font-size': '18px'};
      debugger
      // Session.set("addText", true);
       Meteor.call("addElement", {
        projectId: projectId,
        frameId: Session.get("frameId"),
        type: "text",

        //FIXME: THIS IS ALWAYS NULL...
        // css: JSON.stringify(cssObj),

        css: "color:#000;font-size:18px;",
        content: "Text"
      }, function (err, elementId) {
        if (err) {
          console.log("Adding element failed", err);
          return false;
        }
        Session.set("elementAdded", elementId);
      });
    },
    'click .add-img-btn': function (e, template) {
      // Session.set("addImage", true);
    },
    'click .add-btn-btn': function (e, template) {
      // Session.set("addButton", true);
    },
  });
}
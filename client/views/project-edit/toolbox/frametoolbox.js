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
    'click .add-text-btn': function (e, template) {
      var projectId = this._id;
      var cssObj = {"color": "#000", "font-size": "18px"};
      var cssStr = JSON.stringify(cssObj);
      // Session.set("addText", true);
       Meteor.call("addElement", {
        projectId: projectId,
        frameId: Session.get("frameId"),
        type: "text",
        css: cssStr,
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
      
    },
    'click .add-btn-btn': function (e, template) {
      var projectId = this._id;
      var cssObj = {"color": "#fff", "font-size": "18px"};
      var cssStr = JSON.stringify(cssObj);
      // Session.set("addText", true);
       Meteor.call("addElement", {
        projectId: projectId,
        frameId: Session.get("frameId"),
        type: "button",
        css: cssStr,
        content: "Button"
      }, function (err, elementId) {
        if (err) {
          console.log("Adding element failed", err);
          return false;
        }
        Session.set("elementAdded", elementId);
      });
    },
  });
}
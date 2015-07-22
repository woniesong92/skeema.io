Elements = new Mongo.Collection("elements");

Meteor.methods({
  addElement: function (data) {
    var element = {
      "projectId": data["projectId"],
      "frameId": data["frameId"],

      // button, image, or text
      "type": data["type"], 

      // html of element. includes css
      "html": null,
      "createdAt": Date.now()
    };

    // new frameId will be returned to the caller
    return Elements.insert(element);
  },

  setHTML: function (elementId, html) {
    Elements.update(elementId, {
       $set: {'html': html}
     });
  },

  deleteElement: function (elementId) {
    Elements.remove(elementId);
  },

  // editContent: function (elementId, newContent){
  //   Elements.update(elementId, {
  //     $set: {'content': newContent}
  //   });
  // },

  // editCss: function (elementId, newCssObj){
  //   var newCssStr = JSON.stringify(newCssObj);
  //   Elements.update(elementId, {
  //     $set: {'css': newCssStr}
  //   })
  // }
});

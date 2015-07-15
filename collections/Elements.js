Elements = new Mongo.Collection("elements");

Meteor.methods({
  addElement: function (data) {
    var element = {
      "projectId": data["projectId"],
      "frameId": data["frameId"],

      // button, image, or text
      "type": data["type"], 

      // object of css attributes
      "css": data["css"],

      // html content (text and button)
      "content": data["content"],
      "createdAt": Date.now()
    };

    // new frameId will be returned to the caller
    return Elements.insert(element);
  },

  editContent: function (elementId, newContent){
    Elements.update(elementId, {
      $set: {'content': newContent}
    });
  },

  editCss: function (elementId, newCssObj){
    var newCssStr = JSON.stringify(newCssObj);
    Elements.update(elementId, {
      $set: {'css': newCssStr}
    })
  }
});

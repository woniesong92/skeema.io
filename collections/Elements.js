Elements = new Mongo.Collection("elements");

Meteor.methods({
  addElement: function (data) {
    var element = {
      "projectId": data["projectId"],
      "frameId": data["frameId"],

      // button, image, or text
      "type": data["type"], 

      // object of css attributes
      "css": data["attributes"],

      // html content (text and button)
      "content": data["content"],
      "createdAt": Date.now()
    };

    // new frameId will be returned to the caller
    return Elements.insert(element);
  }
});

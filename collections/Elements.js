Elements = new Mongo.Collection("elements");

Meteor.methods({
  addElement: function (data) {
    var element = {
      "projectId": data["projectId"],

      // FIXME: We need trialId to use for subscribing
      // can we get rid of it?
      "trialId": data["trialId"],
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
    // FIXME: if we are removing an image,
    // we should remove it from S3 storage as well.
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

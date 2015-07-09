Frames = new Mongo.Collection("frames");

Meteor.methods({
  addFrame: function (data) {
    var frame = {
      "projectId": data["projectId"],
      "trialId": data["trialId"],
      "name": data["name"],
      
      // User can place frame4 before frame3, so we need
      // an index field
      // FIXME: not sure how to deal with images yet
      // Jenny note: maybe we should have a collection of elements
        // each element has properties like the xy-coordinates, css props, etc.
      "images": null,
      "createdAt": Date.now()
    };

    // new frameId will be returned to the caller
    return Frames.insert(frame);
  }
});

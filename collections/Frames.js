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
      "images": null,
      "createdAt": Date.now(),
      "position": null
    };

    // new frameId will be returned to the caller
    return Frames.insert(frame);
  },

  addFramePosition: function (frameId, position) {
    return Frames.update(frameId, {
      $set: {position: position}
    });
    console.log("update frame position")
  }
});

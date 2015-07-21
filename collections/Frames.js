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

  renameFrame: function (frameId, newname){
    return Frames.update(frameId, {
      $set: {name: newname}
    });
  },

  addFramePosition: function (frameId, position) {
    return Frames.update(frameId, {
      $set: {position: position}
    });
    console.log("update frame position")
  },

  deleteFrame: function (frameId) {
    Frames.remove(frameId);

    var sourcePathIds = _.map(Paths.find({ sourceId: frameId }).fetch(),
      function (path) { return path._id; }
    );
    var targetPathIds = _.map(Paths.find({ targetId: frameId }).fetch(),
      function (path) { return path._id; }
    );
    var pathIds = _.union(sourcePathIds, targetPathIds);

    Meteor.call("deletePaths", pathIds);
  }
});

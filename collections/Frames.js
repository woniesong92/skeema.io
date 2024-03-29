Frames = new Mongo.Collection("frames");

Meteor.methods({
  addFrame: function (data) {
    var frame = {
      "projectId": data["projectId"],
      "trialId": data["trialId"],
      "name": data["name"],

      // "normal" or "exit"
      "type": data["type"],
      "images": null,
      "createdAt": Date.now(),
      "position": null,
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
    console.log("update frame position");
  },

  // setType: function (frameId, newtype) {
  //   return Frames.update(frameId, {
  //     $set: {type: newtype}
  //   });
  // },

  deleteFrames: function (frameIds) {
    Frames.remove({
      _id: { $in: frameIds }
    });

    var pathIds = [];

    _.each(frameIds, function (frameId) {
      var sourcePathIds = _.map(Paths.find({ sourceId: frameId }).fetch(),
        function (path) { return path._id; }
      );
      var targetPathIds = _.map(Paths.find({ targetId: frameId }).fetch(),
        function (path) { return path._id; }
      );

      pathIds = _.union(pathIds, sourcePathIds, targetPathIds);
    });

    Meteor.call("deletePaths", pathIds);
  },

  makeFrameDuplicate: function (trialId, frameId) {
    var frame = Frames.findOne({_id: frameId});
    frame.name = frame.name + " Copy";
    var oldFrameId = frame._id;
    delete frame._id;
        
    Frames.insert(frame, function (err, newFrameId) {
      // copy elements
      var elements = Elements.find({
        frameId: oldFrameId
      }).fetch();
      _.each(elements, function (element) {
        element.frameId = newFrameId;
        delete element._id;
        Elements.insert(element);
      });

      debugger;
    });
  }
});

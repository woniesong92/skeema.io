Trials = new Mongo.Collection("trials");

Meteor.methods({

  addTrial: function (data, callback) {
    var projectId = data["projectId"];
    var blockId = data["blockId"];

    var trial = {
      "projectId": projectId,
      "blockId": blockId,

      // NOT SURE WE NEED THIS
      // "nextTrialId": null,

      "name": "New Trial",

      // starting frame
      "startFrameId": null,

      // this is used when you re-order
      "index": Trials.find({blockId: blockId}).count(),

      // number of times shown within its block
      "occurences": 1,

      // FIXME: not sure if paths should be a collection
      "paths": null,

      // Checkbox for save response
      "doSaveResponse": true,
      // Checkbox for save reaction time
      "doSaveReactionTime": true,
      // "pathTaken" might be a better name than response
      "response": null,
      "reactionTime": null,
      "createdAt": Date.now(),
    };

    Trials.insert(trial, function (err, trialId) {
      // When trial is created, let's add one frame to it
      // by default
      if (err) {
        console.log(err, "Frame making failed");
        return;
      }

      //FIXME: WHAT TO DO WITH INDEX?
       Meteor.call("addFrame", {
        projectId: projectId,
        trialId: trialId,
        name: "Exit",
        type: "exit",
        index: -1
      });

       Meteor.call("addFrame", {
        projectId: projectId,
        trialId: trialId,
        name: "New Frame",
        type: "normal",
        index: 0
      }, function (err, frameId) {
        Trials.update(trialId, {
          $set: {'startFrameId': frameId}
        });
      });

    });
  },

  deleteTrials: function (trialIds) {
    // If multiple trialIds, then the whole block was
    // deleted and we don't have to update indices. Otherwise,
    // shift all trials that were after the deleted trial
    // forward

    if (trialIds.length === 1) {
      var trial = Trials.findOne(trialIds[0]);
      var trialIdx = trial.index;
      var trials = Trials.find({blockId: trial.blockId}).fetch();
      _.each(trials, function (t) {
        if (t.index > trialIdx) {
          Trials.update(t._id, { $set: {'index': t.index-1 }});
        }
      });
    }

    Trials.remove({
      _id: { $in: trialIds }
    });

    // delete associated frames
    _.each(trialIds, function (trialId) {
      var frameIds = _.map(Frames.find({trialId: trialId}).fetch(),
        function (frame) { return frame._id; });
      Meteor.call("deleteFrames", frameIds);
    });
  },

  setTrialStart: function (trialId, newStartFrameId) {
    Trials.update(trialId, {
      $set: {'startFrameId': newStartFrameId}
    });
  },

  renameTrial: function (trialId, newName) {
    Trials.update(trialId, {
      $set: {'name': newName}
    });
  },

  changeTrialIndex: function (trialId, newIndex) {
    Trials.update(trialId, {
      $set: {"index": newIndex}
    });
  },

  changeOccurences: function (trialId, newOcc) {
    Trials.update(trialId, {
      $set: {"occurences": newOcc}
    });
  },

  changeDoSaveResponse: function (trialId, respBool) {
    Trials.update(trialId, {
      $set: {"doSaveResponse": respBool}
    })
  },

  changeDoSaveReactionTime: function (trialId, reactBool) {
    Trials.update(trialId, {
      $set: {"doSaveReactionTime": reactBool}
    })
  },

  makeTrialDuplicate: function (trialId) {
    // making a trial duplicate gets trikcy with
    // so many children and children of children
    var trial = Trials.findOne(trialId);
    var frames = Frames.find({
      trialId: trialId
    }).fetch();
    var paths = Paths.find({
      trialId: trialId
    }).fetch();

    var allFramesInsertedDeferred = $.Deferred();
    allFramesInsertedDeferred.then(function() {
      // copy paths when all the frames have been inserted
      _.each(paths, function (path) {
        delete path._id;
        Paths.insert(path);
      });
    });

    var numFramesAdded = 0;
    var numFrames = frames.length;

    trial.name = trial.name + " Copy";
    delete trial._id;
    Trials.insert(trial, function (err, newTrialId) {
      _.each(frames, function (frame) {
        frame.trialId = newTrialId;
        var oldFrameId = frame._id;
        delete frame._id;
        
        Frames.insert(frame, function (err, newFrameId) {
          // update paths
          _.each(paths, function (path) {
            if (path.sourceId === oldFrameId) {
              path.sourceId = newFrameId;
            } else if (path.targetId === oldFrameId) {
              path.targetId = newFrameId;
            }
            path.trialId = newTrialId;
          });

          // copy elements
          var elements = Elements.find({
            frameId: oldFrameId
          }).fetch();
          _.each(elements, function (element) {
            element.frameId = newFrameId;
            delete element._id;
            Elements.insert(element);
          });

          // check if all the frames have been added and
          // resolve the Deferred object if they have
          numFramesAdded += 1;
          if (numFramesAdded === numFrames) {
            allFramesInsertedDeferred.resolve();
          }
        });
      });
    });
  }

});

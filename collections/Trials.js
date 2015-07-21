Trials = new Mongo.Collection("trials");

Meteor.methods({

  addTrial: function (data, callback) {
    var projectId = data["projectId"];

    var trial = {
      "projectId": projectId,
      "blockId": data["blockId"],

      // NOT SURE WE NEED THIS
      // "nextTrialId": null,

      "name": data["name"],

      // this is used when you re-order
      "index": data["index"],

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
      "createdAt": Date.now()
    };

    Trials.insert(trial, function (err, trialId) {
      // When trial is created, let's add one frame to it
      // by default
      if (err) {
        console.log(err, "Frame making failed");
        return;
      }
      Meteor.call("addFrame", {
        projectId: projectId,
        trialId: trialId,
        name: "Frame " + 0,
        index: 0
      });
    });
  },

  deleteTrial: function (trialId) {
    Trials.remove(trialId);

    // delete associated frames
    var frameIds = _.map(Frames.find({trialId: trialId}).fetch(),
      function (frame) { return frame._id; });
    Meteor.call("deleteFrames", frameIds);
  },

  renameTrial: function (trialId, newName) {
  Trials.update(trialId, {
    $set: {'name': newName}
  });
  },

  //FIXME: MUST SHIFT THE INDECES OF THE OTHER TRIALS
  changeTrialIndex: function (trialId, newIndex) {
    Trials.update(trialId, {
      $set: {"index": newIndex}
    });
  },

  //FIXME: MUST SHIFT THE INDECES OF THE OTHER TRIALS
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

});

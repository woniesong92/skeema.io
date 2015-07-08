Trials = new Mongo.Collection("trials");

Meteor.methods({

  addTrial: function (data, callback) {
    var trial = {
      "projectId": data["projectId"],
      "blockId": data["blockId"],

      // NOT SURE WE NEED THIS
      // "nextTrialId": null,

      "name": data["name"],

      // this is used when you re-order
      "index": data["index"],

      // number of times shown within its block
      "occurances": 1,

      // FIXME: not sure if paths should be a collection
      "paths": null,

      // Checkbox for save response
      "doSaveResponse": false,
      // Checkbox for save reaction time
      "doSaveReactionTime": false,
      // "pathTaken" might be a better name than response
      "response": null,
      "reactionTime": null,
      "createdAt": Date.now()
    };

    Trials.insert(trial);
  },

  deleteTrial: function (trialId) {
    Trials.remove(trialId);
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
  changeOccurances: function (trialId, newOcc) {
    Trials.update(trialId, {
      $set: {"occurances": newOcc}
    });
  },

});

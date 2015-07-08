Trials = new Mongo.Collection("trials");

Meteor.methods({
  addTrial: function (data, callback) {
    var trial = {
      "projectId": data["projectId"],
      "blockId": data["blockId"],
      "nextTrialId": null,
      "name": data["name"],

      // this is used when you re-order
      "index": data["index"],

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
  }
});

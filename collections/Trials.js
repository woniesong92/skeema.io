Trials = new Mongo.Collection("trials");

Meteor.methods({
  addTrial: function (data, callback) {
    var trial = {
      "blockId": data["block_id"],
      "nextTrialId": null,
      "name": data["name"],
      "index": data["index"],
      // FIXME: not sure if paths should be a collection
      "paths": data["paths"],
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

});

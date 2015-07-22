Blocks = new Mongo.Collection("blocks");

Meteor.methods({

  addBlock: function (data, callback) {
    var projectId = data["projectId"];

    var block = {
      "projectId": projectId,
      "name": data["name"],
      "randomize": false,

      // this is used when you re-order
      "index": data["index"],

      // number of trials
      // "length": 0,
      "createdAt": Date.now()
    };

    Blocks.insert(block, function (err, blockId) {
      // When block is created, let's add one trial to it
      // by default
      if (err) {
        console.log(err, "Block making failed");
        return;
      }
      Meteor.call("addTrial", {
        projectId: projectId,
        blockId: blockId,
        name: "Trial " + 0,
        index: 0
      });
    });
  },

  renameBlock: function (blockId, newName) {
    Blocks.update(blockId, {
      $set: {'name': newName}
    });
  },

  changeBlockIndex: function (blockId, newIndex) {
    Blocks.update(blockId, {
      $set: {"index": newIndex}
    });
  },

  changeRandomize: function (blockId, randomizeBool) {
    Blocks.update(blockId, {
      $set: {"randomize": randomizeBool}
    });
  },

  deleteBlocks: function (blockIds) {
    Blocks.remove({
      _id: { $in: blockIds }
    });

    // delete associated trials
    _.each(blockIds, function (blockId) {
      var trialIds = _.map(Trials.find({blockId: blockId}).fetch(),
        function (trial) { return trial._id; });
      Meteor.call("deleteTrials", trialIds);
    });
  }
});

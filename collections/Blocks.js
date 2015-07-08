Blocks = new Mongo.Collection("blocks");

Meteor.methods({

  addBlock: function (data, callback) {
    var block = {
      "projectId": data["projectId"],
      "name": data["name"],
      "randomize": false,

      // this is used when you re-order
      "index": data["index"],

      // number of trials
      // "length": 0,
      "createdAt": Date.now()
    };

    Blocks.insert(block);
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
});

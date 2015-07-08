Blocks = new Mongo.Collection("blocks");

Meteor.methods({
  addBlock: function (data, callback) {
    var block = {
      "projectId": data["projectId"],
      "name": data["name"],
      "index": data["index"], // this is used when you re-order
      "createdAt": Date.now()
    };

    Blocks.insert(block);
  },
});

Blocks = new Mongo.Collection("blocks");

Meteor.methods({
  addBlock: function (data, callback) {
    var block = {
      "projectId": data["projectId"],
      "name": data["name"],
      "createdAt": Date.now()
    };

    Blocks.insert(block);
  },
});

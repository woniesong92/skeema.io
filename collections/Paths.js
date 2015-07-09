Paths = new Mongo.Collection("paths");

Meteor.methods({

  addPath: function (data, callback) {
    var path = {

      // id of the origin trial
      "fromId": data["fromId"],

      // id of the destination trial
      "toId": data["toId"],

      // time, keypress, click, etc.
      "event": data["event"],
      "createdAt": Date.now()
    };

    Paths.insert(path);
  },

  deletePath: function (pathId) {
    Paths.remove(pathId);
  },


});

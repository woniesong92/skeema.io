Paths = new Mongo.Collection("paths");

Meteor.methods({

  addPath: function (data, callback) {
    var path = {

      "frameId": data["frameId"],

      // id of the origin trial
      "sourceId": data["sourceId"],

      // id of the destination trial
      "targetId": data["targetId"],

      // time, keypress, click, etc.
      "eventType": data["eventType"],
      "createdAt": Date.now()
    };

    return Paths.insert(path);
  },

  updatePathEvent: function (pathId, eventType, eventParam) {
    Paths.update(pathId, {
      $set: {
        'eventType': eventType,
        'eventParam': eventParam
      }
    });
  }

  deletePath: function (pathId) {
    Paths.remove(pathId);
  },


});

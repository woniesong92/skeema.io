Paths = new Mongo.Collection("paths");

Meteor.methods({
  addPath: function (data) {
    var path = {

      // Manually created _id because I need it
      // before inserting the doc to DB. If
      // the user cancels the modal, the path
      // shouldn't be created
      "_id": data["_id"],
      
      "projectId": data["projectId"],
      "trialId": data["trialId"],
      "name": data["name"],

      // id of the origin trial
      "sourceId": data["sourceId"],

      // id of the destination trial
      "targetId": data["targetId"],

      // time, keypress, click, etc.
      "eventType": data["eventType"],
      "eventParam": data["eventParam"],
      "createdAt": Date.now()
    };

    return Paths.insert(path);
  },

  renamePath: function(pathId, newname){
    Paths.update(pathId, {
      $set: {'name': newname}
    });
  },

  updatePathEvent: function (data) {
    Paths.update(data['pathId'], {
      $set: {
        'eventType': data['eventType'],
        'eventParam': data['eventParam']
      }
    });
  },

  deletePaths: function (pathIds) {
    Paths.remove({
      _id: { $in: pathIds }
    });

    if (Meteor.isClient) {
      Session.set("deletedPathIds", pathIds);
    }
  }
});

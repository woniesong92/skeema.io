Paths = new Mongo.Collection("paths");

Meteor.methods({

  addPath: function (data) {
    var path = {
      "projectId": data["projectId"],
      "trialId": data["trialId"],

      // id of the origin trial
      "sourceId": data["sourceId"],

      // id of the destination trial
      "targetId": data["targetId"],

      // time, keypress, click, etc.
      "eventType": data["eventType"],
      "eventParam": data["eventParam"],
      "createdAt": Date.now()
    };

    return {
      pathId: Paths.insert(path),
      numPaths: Paths.find({trialId: data["trialId"]}).count()
    }
  },

  updatePathEvent: function (data) {
    Paths.update(data['pathId'], {
      $set: {
        'eventType': data['eventType'],
        'eventParam': data['eventParam']
      }
    });
  },

  deletePath: function (pathId) {
    Paths.remove(pathId);

    // if this function was invoked from the toolbox,
    // we should detach the connection
    if (Meteor.isClient) {
      //FIXME: the way to retreive a jsp instance might
      //change in future.
      var instance = Template.TrialWorkSpace.jsp;
      instance.select().each(function (con) {
        if (con.id === pathId) {
          instance.detach(con);
        }
      });
    }
  }
});

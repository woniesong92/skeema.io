Frames = new Mongo.Collection("frames");

Meteor.methods({
  addFrame: function (data, callback) {
    var frame = {
      "trialId": data["trial_id"],
      "name": data["name"],
      
      // User can place frame4 before frame3, so we need
      // an index field
      // FIXME: not sure how to deal with images yet
      "images": null,
      "createdAt": Date.now()
    };

    Frames.insert(frame);
  },

});

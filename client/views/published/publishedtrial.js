if (Meteor.isClient) {

  Template.PublishedTrial.helpers({
    frames: function() {
      return Frames.find();
    }
  });


  Template.PublishedTrial.onRendered(function() {
    console.log("trial rendered");
  });

  Template.PublishedTrial.events({


  });


  Template.PublishedFrame.helpers({
    elements: function() {
      return Elements.find({frameId: this._id});
    }
  });


  Template.PublishedFrame.onRendered(function() {
    console.log("frame rendered");
    // debugger
  });

  Template.PublishedFrame.events({

  });

  Template.PublishedElement.onRendered(function() {
    var htmlStr = this.data.html;
    var element = $(htmlStr);
    this.$('.element-container').append(element);
  });
}
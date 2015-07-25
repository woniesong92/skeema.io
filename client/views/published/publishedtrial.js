if (Meteor.isClient) {

  Template.PublishedTrial.helpers({
    frames: function() {
      return Frames.find({type: "normal"});
    },
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

    var frameDOM = this.$('.frame-container');

    console.log("frame rendered");

    var isExit = this.data.type === "exit";

    if (isExit){

      //FIXME: when index is at end --> next block
      var trial = Trials.findOne({_id: this.data.trialId});
      var nextTrialId = Trials.findOne({index: trial.index + 1})._id;
      Router.go('/preview/'+trial.blockId+'/'+nextTrialId);
    }


    var paths = Paths.find({sourceId: this.data._id}).fetch();

    _.each(paths, function (path) {
      var targetId = path.targetId;
      var targetIsExit = Frames.findOne({_id: targetId}).type === "exit";


      var scriptStr = "<script>" +
        "var stepFrame = function() {" +
          "if(targetIsExit){" +
            "frameDOM.hide();" +
            "$('.frame-container[data-framdId="'+ targetId +'"]').show();" +
          "}" +
        "}"+

        "switch (path.eventType){" +
          'case "keypress":' +
            '$("document").keypress(function(e) {' +
              'var code = e.keyCode || e.which;' +
                'if (code === path.eventParam.charCodeAt(0)) {' +
                  'stepFrame();' +
                '}' +
              '});' +
            'break;' +

          'case "time":' +

            'setTimeout(function() {' +
              'stepFrame();' +
            '}, parseInt(path.eventParam));' +
            'break;' +

          'case "click":' +

            "$('#' + path.eventParam).click(function() {" +
              "stepFrame();" +
            '});' +
            'break;' +
        '}' +
      "</script>";

      frameDOM.append(scriptStr);
      debugger

    });

  });

  Template.PublishedFrame.events({

  });

  Template.PublishedElement.onRendered(function() {
    var htmlStr = this.data.html;
    var element = $(htmlStr);
    this.$('.element-container').append(element);
  });
}
if (Meteor.isClient) {

  Template.PublishedTrial.helpers({
    frames: function() {
      return Frames.find({type: "normal"});
    },
  });


  Template.PublishedTrial.onRendered(function() {
    // console.log("trial rendered");
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
    var isExit = this.data.type === "exit";
    var isStart = this.data.type === "start";
    var trial = Trials.findOne({_id: this.data.trialId});

    if (isExit){

      //FIXME: when index is at end --> next block
      var nextTrialIndex = trial.index + 1;
      var blockId = trial.blockId;

      if (nextTrialIndex === Trials.find({blockId: blockId}).count()) {
        alert("end of block!");

        var nextBlockIndex = Blocks.findOne({_id: blockId}).index + 1;
        var nextBlock = Blocks.findOne({index: nextBlockIndex});
        var nextBlockId = nextBlock._id;
        var nextTrialId = Trials.findOne({blockId: nextBlockId})._id;
        Router.go('/preview/'+nextBlockId+'/'+nextTrialId);
        return;
      }

      nextTrialIndex = trial.index + 1;
      var nextTrialId = Trials.findOne({index: nextIndex})._id;
      Router.go('/preview/'+trial.blockId+'/'+nextTrialId);
      return;
    }


    var paths = Paths.find({sourceId: this.data._id}).fetch();

    _.each(paths, function (path) {
      var sourceId = path.sourceId;
      var targetId = path.targetId;
      var targetIsExit = Frames.findOne({_id: targetId}).type === "exit";

      var scriptStr = "<script>" +
        "var stepFrame = function() {" +
          'if('+targetIsExit+') {' +
            '$(".frame-container[data-framdId=\''+ sourceId +'\']").hide();' +
            '$(".frame-container[data-framdId=\''+ targetId +'\']").show();' +
          "}" +
        "};\n"+
        'if ("'+path.eventType+'" === "keypress") {' +
          '$("document").keypress(function(e) {' +
            'var code = e.keyCode || e.which;' +
              'if (code === '+path.eventParam.charCodeAt(0)+') {' +
                'stepFrame();' +
              '}' +
            '});' +
        '} else if ("'+path.eventType+'" === "time") {' +
          'setTimeout(function() {' +
            'stepFrame();' +
          '}, parseInt("'+path.eventParam+'"));' +
        '} else if ("'+path.eventType+'" === "click") {' +
          '$("#' + path.eventParam + '").click(function() {' +
            "stepFrame();" +
          '});' +
        '}' +
      "</script>";

      frameDOM.append(scriptStr);
    });

    if (trial.startFrameId !== this.data._id) {
      frameDOM.hide();
    }

  });

  Template.PublishedFrame.events({

  });

  Template.PublishedElement.onRendered(function() {
    var htmlStr = this.data.html;
    var element = $(htmlStr);
    this.$('.element-container').append(element);
  });
}
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




   // if (isExit) {
   //    var nextTrialIndex = trial.index + 1;
   //    var blockId = trial.blockId;

   //    if (nextTrialIndex === Trials.find({blockId: blockId}).count()) {
   //      alert("end of block!");

   //      var nextBlockIndex = Blocks.findOne({_id: blockId}).index + 1;
   //      var nextBlock = Blocks.findOne({index: nextBlockIndex});
   //      var nextBlockId = nextBlock._id;
   //      var nextTrialId = Trials.findOne({blockId: nextBlockId})._id;
   //      Router.go('/preview/'+nextBlockId+'/'+nextTrialId);
   //      return;
   //    }

   //    nextTrialIndex = trial.index + 1;
   //    var nextTrialId = Trials.findOne({index: nextIndex})._id;
   //    Router.go('/preview/'+trial.blockId+'/'+nextTrialId);
   //    return;
   //  }



  Template.PublishedFrame.onRendered(function() {



    var frameDOM = this.$('.frame-container');
    // var isExit = this.data.type === "exit";
    var isStart = this.data.type === "start";
    var currentTrial = Trials.findOne({_id: this.data.trialId});

    var sourceId = this.data._id;
    var paths = Paths.find({sourceId: sourceId}).fetch();

    _.each(paths, function (path) {
      debugger
      var targetId = path.targetId;
      var targetFrame = Frames.findOne({_id: targetId});
      var isTargetExit = targetFrame.type === 'exit';
      //FIXME: feel weird to have this in the Frame template, not the Trial template...
      // anyway to set a global variable?
      var isLastTrial = currentTrial.index === Trials.find({blockId: currentTrial.blockId}).count() - 1;

      var routerURL = "/preview/" + currentTrial.projectId + "/";
      if (isLastTrial) {
        var nextBlockIndex = Blocks.findOne({_id: currentTrial.blockId}).index + 1;
        var nextBlockId = Blocks.findOne({index: nextBlockIndex})._id;
        var nextTrialId = Trials.findOne({
          blockId: nextBlockId,
          index: 0
        })._id;
        routerURL += nextBlockId + "/" + nextTrialId;

      } else {
        var nextTrialId = Trials.findOne({
          blockId: currentTrial.blockId,
          index: currentTrial.index + 1
        })._id;
        routerURL += nextBlockId + "/" + nextTrialId;
      }

      // if (isTargetExit) {
      //   var nextTrialIndex = targetTrial.index;
      //   var blockId = currentTrial.blockId;

      //   if (nextTrialIndex === Trials.find({blockId: blockId}).count()) {
      //     var nextBlockIndex = Blocks.findOne({_id: blockId}).index + 1;
      //     var nextBlock = Blocks.findOne({index: nextBlockIndex});
      //     var nextBlockId = nextBlock._id;
      //     var nextTrialId = Trials.findOne({
      //       blockId: nextBlockId,
      //       index: 0
      //     })._id;
      //     Router.go('/preview/'+nextBlockId+'/'+nextTrialId);
      //   } else {
      //     var nextTrialId = targetId;
      //     Router.go('/preview/'+blockId+'/'+nextTrialId);
      //   }
      // }

      var scriptStr = (function() {
        return "<script>" +
            'if ("'+path.eventType+'" === "keypress") {' +
              '$(window).keypress(function(e) {' +
                'var code = e.keyCode || e.which;' +
                  'if (code === '+path.eventParam.charCodeAt(0)+') {' +
                    'if (' + isTargetExit + ') {' +
                      'Router.go(\'' + routerURL + '\');' +
                    '} else {' +
                      '$(".frame-container[data-frameId=\''+ sourceId +'\']").hide();' +
                      '$(".frame-container[data-frameId=\''+ targetId +'\']").show();' +
                    '}' +
                  '}' +
                '});' +
            '} else if ("'+path.eventType+'" === "time") {' +
              'setTimeout(function() {' +
                'if (' + isTargetExit + ') {' +
                      'Router.go(\'' + routerURL + '\');' +
                    '} else {' +
                      '$(".frame-container[data-frameId=\''+ sourceId +'\']").hide();' +
                      '$(".frame-container[data-frameId=\''+ targetId +'\']").show();' +
                    '}' +
              '}, parseInt("'+path.eventParam+'"));' +
            '} else if ("'+path.eventType+'" === "click") {' +
              '$("#' + path.eventParam + '").click(function() {' +
                  'if (' + isTargetExit + ') {' +
                      'Router.go(\'' + routerURL + '\');' +
                    '} else {' +
                      '$(".frame-container[data-frameId=\''+ sourceId +'\']").hide();' +
                      '$(".frame-container[data-frameId=\''+ targetId +'\']").show();' +
                    '}' +
              '});' +
            '}' +
        "</script>";
      });
      debugger
      frameDOM.append(scriptStr);
    });
  debugger
    if (currentTrial.startFrameId !== this.data._id) {
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
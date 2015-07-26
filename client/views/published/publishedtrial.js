if (Meteor.isClient) {

  Template.PublishedTrial.helpers({
    frames: function() {
      var trialId = Session.get("publishedTrialId");
      return Frames.find({type: "normal", trialId: trialId});
    },
  });

  Template.PublishedTrial.onRendered(function() {
    var projectId = this.data._id;

    var blockId = Blocks.findOne({projectId: projectId, index: 0})._id;
    var trialId = Trials.findOne({projectId: projectId, index: 0})._id;

    Session.set("publishedTrialId", trialId);
  });

  Template.PublishedFrame.helpers({
    elements: function() {
      return Elements.find({frameId: this._id});
    }
  });


  Template.PublishedFrame.onRendered(function() {
    var currentFrame = Frames.findOne({_id: Blaze.getData()._id});
    var frameDOM = this.$('.frame-container');
    var currentTrial = Trials.findOne({_id: currentFrame.trialId});
    var sourceId = currentFrame._id;
    var isStart = sourceId === currentTrial.startFrameId;
    var paths = Paths.find({sourceId: sourceId}).fetch();
    var isFirstTrial = (currentTrial.startFrameId === this.data._id);

    _.each(paths, function (path) {
      var targetId = path.targetId;
      var targetFrame = Frames.findOne({_id: targetId});
      var isTargetExit = targetFrame.type === 'exit';
      
      //FIXME: feel weird to have this in the Frame template, not the Trial template...
      // anyway to set a global variable?

      var isLastTrial = currentTrial.index === Trials.find({blockId: currentTrial.blockId}).count() - 1;

      var nextBlockId;
      var nextTrialId;

      if (isLastTrial) {
        var nextBlockIndex = Blocks.findOne({_id: currentTrial.blockId}).index + 1;
        var nextBlock = Blocks.findOne({index: nextBlockIndex});

        if (nextBlock) {
          nextTrialId = Trials.findOne({
            blockId: nextBlock._id,
            index: 0
          })._id;
        } else {
          alert("this is the end of trial!")
          return false;
        }
      } else {
        nextTrialId = Trials.findOne({
          blockId: currentTrial.blockId,
          index: currentTrial.index + 1
        })._id;
        nextBlockId = currentTrial.blockId;
      }

      var scriptStr = (function() {
        return "<script>" +
          'if ("'+path.eventType+'" === "keypress") {' +
            '$(window).keypress(function(e) {' +
              'var code = e.keyCode || e.which;' +
                'if (code === '+path.eventParam.charCodeAt(0)+') {' +
                  'if (' + isTargetExit + ') {' +
                    'Session.set(\'publishedTrialId\', \'' + nextTrialId + '\');' +
                  '} else {' +
                    '$(".frame-container[data-frameId=\''+ sourceId +'\']").hide();' +
                    '$(".frame-container[data-frameId=\''+ targetId +'\']").show();' +
                    '$(".frame-container[data-frameId=\''+ targetId +'\']").trigger("frameActivated");' +
                  '}' +
                '}' +
              '});' +
          '} else if ("'+path.eventType+'" === "time") {' +
            'var startClock = function() {' +
              'setTimeout(function() {' +
                'if (' + isTargetExit + ') {' +
                  'Session.set(\'publishedTrialId\', \'' + nextTrialId + '\');' +
                '} else {' +
                  '$(".frame-container[data-frameId=\''+ sourceId +'\']").hide();' +
                  '$(".frame-container[data-frameId=\''+ targetId +'\']").show();' +
                  'debugger;' +
                  '$(".frame-container[data-frameId=\''+ targetId +'\']").trigger("frameActivated");' +
                '}' +
              '}, parseInt("'+path.eventParam+'"));' +
            '};' +
            '$(".frame-container[data-frameId=\''+ sourceId +'\']").on("frameActivated", startClock)' +
          '} else if ("'+path.eventType+'" === "click") {' +
            '$("#' + path.eventParam + '").click(function() {' +
              'if (' + isTargetExit + ') {' +
                'Session.set(\'publishedTrialId\', \'' + nextTrialId + '\');' +
              '} else {' +
                '$(".frame-container[data-frameId=\''+ sourceId +'\']").hide();' +
                '$(".frame-container[data-frameId=\''+ targetId +'\']").show();' +
                '$(".frame-container[data-frameId=\''+ targetId +'\']").trigger("frameActivated");' +
              '}' +
            '});' +
          '}' +
        "</script>";
      });
      frameDOM.append(scriptStr);
    });

    frameDOM.hide();
    if (isFirstTrial) {
      frameDOM.show();
      frameDOM.trigger("frameActivated");
    }
  });

  Template.PublishedElement.onRendered(function() {
    var htmlStr = this.data.html;
    var element = $(htmlStr);
    element.prop("contenteditable", false);
    this.$('.element-container').append(element);
  });
}

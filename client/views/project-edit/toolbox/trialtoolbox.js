if (Meteor.isClient) {

  Template.TrialToolBox.helpers({
    // isMine: function(owner) {
    //   return owner == Meteor.userId();
    // }
  });

  Template.TrialToolBox.rendered = function () {
    
  }

  Template.TrialToolBox.events({
    'change #trialname': function(e, template) { 
        var newname = $('#trialname').val().trim();
        var trialId = Session.get("id");
        Meteor.call('renameTrial', trialId, newname);
    },

    'change #exit-path-input': function(e, template) { 
        var respbool = $('#exit-path-input').is(':checked');
        var trialId = Session.get("id");
        Meteor.call('changeDoSaveResponse', trialId, respbool);
    },

    'change #time-elapsed-input': function(e, template) { 
        var reactbool = $('#time-elapsed-input').is(':checked');
        var trialId = Session.get("id");
        Meteor.call('changeDoSaveReactionTime', trialId, reactbool);
    },
    
  });
}
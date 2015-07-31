if (Meteor.isClient) {

  Template.FrameToolBox.helpers({
    "uploaded_files": function(){
      return S3.collection.find();
    },
  });

  Template.FrameSettings.helpers({
    "isStart": function() {
      var frameId = ProjectEditSession.get("frameId");
      var trialId = ProjectEditSession.get("trialId");
      var trial = Trials.findOne({_id: trialId});
      if (!trial) {
        console.log("startTrial doesnt exist. Returning");
        return false;
      }
      return trial.startFrameId === frameId;
    }
  });

  Template.FrameToolBox.onRendered(function() {

    ProjectEditSession.set("addText", undefined);
    ProjectEditSession.set("addImage", undefined);
    ProjectEditSession.set("addButton", undefined);

  });

  Template.FrameToolBox.events({
    'change #framename': function (e, template) { 
      var newname = $('#framename').val().trim();
      var frameId = ProjectEditSession.get("frameId");
      Meteor.call('renameFrame', frameId, newname);
    },

    'click .grid-btn': function (e, template) {
      $('.frame-workspace-container').toggleClass('grid');
    },

    'change #isStart': function(e, template) { 
      var startBool = $('#isStart').is(':checked');
      var trialId = ProjectEditSession.get("trialId");
      var frameId = ProjectEditSession.get("frameId");
      Meteor.call('setTrialStart', trialId, frameId);
    },

    'click .add-text-btn': function (e, template) {
      ProjectEditSession.set("addImage", false);
      ProjectEditSession.set("addButton", false);
      ProjectEditSession.set("addText", true);
    },

    'change input.file-upload-input': function (e, template) {
      var files = $("input.file-upload-input")[0].files;

      // FIXME: eventually we might want to resize the images from the
      // server side using imagemagick, and upload to S3 from the server
      // instead of directly from the client side.

      // FIXME: check file size from both the client and
      // server side before uploading it to S3

      var errMessage;
      $.each(files, function (idx, file) {
        var isImage = (file.type.indexOf('image') >= 0);
        var isSmall = (file.size < 10000000); // 10MB

        if (!isImage) {
          // errMessage = "You can only upload images";
          errMessage = "YOU CAN ONLY UPLOAD IMAGES";
        } else if (!isSmall) {
          // errMessage = "File size should be less than 10MB"
          errMessage = "FILE SIZE SHOULD BE LESS THAN 10MB"
        }
        if (errMessage) {
          Utils.toast(errMessage, {type: 'danger'});
          return false; // break out of loop
        }
      });

      // execute no further if err exists
      if (errMessage) { return; }

      // start uploading
      $('.frame-workspace-container').css('cursor', 'wait');

      S3.upload({
        files: files,
        path: "images"
      }, function (err, uploadedFile) {
        // uploading finished
        if (err) {
          ProjectEditSession.set("addImage", false);
          Utils.toast(err, {type: 'danger'});
        } else {
          ProjectEditSession.set("addImage", uploadedFile.url);  
        }
        $('.frame-workspace-container').css('cursor', 'auto');      
        ProjectEditSession.set("addText", false);
        ProjectEditSession.set("addButton", false);
      });
    },

    'click .add-btn-btn': function (e, template) {
      ProjectEditSession.set("addImage", false);
      ProjectEditSession.set("addText", false);
      ProjectEditSession.set("addButton", true);
    },

    'click .remove-elt': function (e, template) {
      var elementId = ProjectEditSession.get("elementId");

      Meteor.call("deleteElement", elementId, function (e){
        if (e) {
          console.log("Deleting element "+elementId+" failed");
          return false;
        }
        
        $('#'+elementId).remove();
        Utils.toast("REMOVED SUCCESSFULLY");
      });
    }
  });
}
if (Meteor.isClient) {

  Template.FrameToolBox.helpers({

    "uploaded_files": function(){
      return S3.collection.find();
    },

  });

  Template.FrameSettings.helpers({
    "isStart": function() {
      var frameId = Session.get("frameId");
      var trialId = Session.get("trialId");
      return Trials.findOne({_id: trialId}).startFrameId == frameId;
    }
  });

  Template.FrameToolBox.rendered = function () {
    Session.set("addText", false);
    Session.set("addImage", false);
    Session.set("addButton", false);
    // Session.set("elementAdded", null);
  }

  Template.FrameToolBox.events({
    'change #framename': function (e, template) { 
      var newname = $('#framename').val().trim();
      var frameId = Session.get("frameId");
      Meteor.call('renameFrame', frameId, newname);
    },

    'click .grid-btn': function (e, template) {
      $('.frame-workspace-container').toggleClass('grid');
    },

    //  we save everything automatically now
    // 'click .save-btn': function (e, template) {
    //   $('.element-item').each(function (index) {
    //     // Strip off resizable wrappers before saving the content
    //     if (this.className.indexOf("frame-image-container") >= 0) {
    //       var $image = $(this).find('.frame-image');
    //       $(this).children().replaceWith($image);
    //     }

    //     var newHTML = $(this).prop('outerHTML');
    //     Meteor.call("setHTML", this.id, newHTML, function (err){
    //       if (err){
    //         console.log("saving HTML changes failed for " + this.id);
    //         return false;
    //       }
    //     });
    //   });

    //   $.bootstrapGrowl("SAVED SUCCESSFULLY", {
    //     ele: '.toast-container', // which element to append to
    //     type: 'success', // (null, 'info', 'danger', 'success')
    //     offset: {from: 'top', amount: 97}, // 'top', or 'bottom'
    //     align: 'right', // ('left', 'right', or 'center')
    //     width: 220, // (integer, or 'auto')
    //     delay: 3000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
    //     allow_dismiss: true, // If true then will display a cross to close the popup.
    //     stackup_spacing: 10 // spacing between consecutively stacked growls.
    //   });
    // },

    'change #isStart': function(e, template) { 
      var startBool = $('#isStart').is(':checked');
      var trialId = Session.get("trialId");
      var frameId = Session.get("frameId");
      Meteor.call('setTrialStart', trialId, frameId);
    },

    'click .add-text-btn': function (e, template) {
      Session.set("addImage", false);
      Session.set("addButton", false);
      Session.set("addText", true);
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
          $.bootstrapGrowl(errMessage, {
            ele: '.toast-container', // which element to append to
            type: 'danger', // (null, 'info', 'danger', 'success')
            offset: {from: 'top', amount: 97}, // 'top', or 'bottom'
            align: 'right', // ('left', 'right', or 'center')
            width: 220, // (integer, or 'auto')
            delay: 3000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
            allow_dismiss: true, // If true then will display a cross to close the popup.
            stackup_spacing: 10 // spacing between consecutively stacked growls.
          });
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
          Session.set("addImage", false);
          Utils.toast(err, 2000);
        } else {
          Session.set("addImage", uploadedFile.url);  
        }
        $('.frame-workspace-container').css('cursor', 'auto');      
        Session.set("addText", false);
        Session.set("addButton", false);
      });
    },

    'click .add-btn-btn': function (e, template) {
      Session.set("addImage", false);
      Session.set("addText", false);
      Session.set("addButton", true);
    },

    'click .remove-elt': function (e, template) {
      var elementId = Session.get("elementId");

      Meteor.call("deleteElement", elementId, function (e){
        if (e) {
          console.log("Deleting element "+elementId+" failed");
          return false;
        }

        $.bootstrapGrowl('REMOVED SUCCESSFULLY', {
            ele: '.toast-container', // which element to append to
            type: 'success', // (null, 'info', 'danger', 'success')
            offset: {from: 'top', amount: 97}, // 'top', or 'bottom'
            align: 'right', // ('left', 'right', or 'center')
            width: 220, // (integer, or 'auto')
            delay: 3000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
            allow_dismiss: true, // If true then will display a cross to close the popup.
            stackup_spacing: 10 // spacing between consecutively stacked growls.
          });


        $('#'+elementId).remove();
      });
    },

  });
}
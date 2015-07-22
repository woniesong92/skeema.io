if (Meteor.isClient) {

  Template.FrameToolBox.helpers({
    "uploaded_files": function(){
      return S3.collection.find();
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

    'click .save-btn': function (e, template) {
      $('.element-item').each(function (index) {
        // Strip off resizable wrappers before saving the content
        if (this.className.indexOf("frame-image-container") >= 0) {
          var $image = $(this).find('.frame-image');
          $(this).children().replaceWith($image);
        }

        var newHTML = $(this).prop('outerHTML');
        Meteor.call("setHTML", this.id, newHTML, function (err){
          if (err){
            console.log("saving HTML changes failed for " + this.id);
            return false;
          }
        });
      });

      Materialize.toast('Saved successfully', 4000);
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
          errMessage = "You can only upload images";
        } else if (!isSmall) {
          errMessage = "File size should be less than 10MB"
        }
        if (errMessage) {
          Materialize.toast(errMessage, 4000);
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
          Materialize.toast(err, 4000);
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
      // FIXME: some error when deleting an image?
      // probably another div id, image id thing

      Meteor.call("deleteElement", elementId, function (e){
        if (e) {
          console.log("Deleting element "+elementId+" failed");
          return false;
        }
        Materialize.toast('Removed successfully', 4000);
        $('#'+elementId).remove();
      });
    },

  });
}
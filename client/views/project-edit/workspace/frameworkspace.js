if (Meteor.isClient) {

  /* Helper funcitons for adding elements */
  function toggleShadow() {
    $('.sidenav-container, .toolbox-container').toggleClass('shadow');
    $('.overshadow').toggle();
  }

  function getPosition (e) {
    var x;
    var y;
    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    }
    else { 
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 
    
    // relative to parent
    x -= $('.frame-workspace-container').offset().left;
    y -= $('.frame-workspace-container').offset().top;
    
    x = (x / $('.frame-workspace-container').width()) * 100;
    y = (y / $('.frame-workspace-container').height()) * 100;
    // debugger
    return {top: y, left: x};
  }


  Template.FrameWorkSpace.helpers({
    elements: function() {
      var frameId = Session.get('frameId');

      // check if new frame has just been added
      // this reactive var will make sure that every time
      // frameAdded value in Session changes, this function runs
      // var elementId = Session.get("elementAdded");

      // return all frames whose parent is this trial
      return Elements.find({frameId: frameId});
    },

    isText: function() {
      return this.type == "text";
    },

    isButton: function () {
      return this.type == "button";
    },

    isImage: function () {
      return this.type == "image";
    },
  });

  Template.FrameWorkSpace.onCreated(function() {
    // FIXME: is it okay to add it here?
    // this is to prevent the modal from showing up
    // after clicking a trial from a frame view

    // this view is only showing for the user to choose
    // an element from the frame. After the user picks
    // one, the view should revert to the past trialView
    this.chooseElement = Tracker.autorun(function() {
      var infoForChoosing = Session.get("showChoosingElementView");
      if (infoForChoosing) {

        // collapse sidenav and toolbox

        $('.sidenav-container').removeClass("expanded-left").addClass("collasped-left-completely");
        $('.toolbox-container').removeClass("expanded-right").addClass("collasped-right-completely");
        

        var choosingElementDeferred = $.Deferred();
        choosingElementDeferred.then(function (selector) {
          // if ($('#' + selector).hasClass('.element-item')) {
          
          // add this selector to the click event's param
          $('.show').removeClass('show').addClass('hide');
          
          Meteor.call('updatePathEvent', {
            pathId: infoForChoosing.pathId,
            eventType: 'click',
            eventParam: selector
          }, function (err, data) {
            // TODO: we prob don't need err/data params
            // go back to the trialWorkSpace view when it's done

            // FIXME: doesn't it feel weird to invalidate sessions
            // like this?
            Session.set("showChoosingElementView", null);
            Session.set("showFrameWorkspace", null);
            Session.set("trialId", infoForChoosing.trialId);
            Session.set("currentView", "trialView");

            // FIXME: not sure how to apply it when the width is 100%
            // toggleShadow();
          });
        // } else {
        //    Materialize.toast("Please choose an element", 2000);
        // }

        }, function (err) {
          // FIXME: handle when deferred is rejected for any reason
        });

        // show a backdrop to highlight the frame workspace
        // FIXME: not sure how to apply it when the width is 100%
        // toggleShadow();

        // dynamically register a click event
        $('body').one("click", function (e) {
          var selector = e.target.id;

          // FIXME: the user should only choose valid elements
          // check if target is valid
          // if (selector is valid) { ... }
          if (true) {
            choosingElementDeferred.resolve(selector);  
          } else {
            choosingElementDeferred.reject("err message");
          }
        });
      }
    })
  })


  Template.FrameWorkSpace.onRendered(function() {
    Session.set("elementId", null);

    var frameElts = Elements.find({"frameId": Session.get("frameId") });
    
    frameElts.forEach(function(elt) {
      $('.frame-workspace-container').append(elt.html);
    });

    if (Session.get("showChoosingElementView")){

      // toast instructions
      $.bootstrapGrowl("<center>CHOOSE AN ELEMENT TO BE CLICKED</center>", {
            ele: '.frame-workspace-container', // which element to append to
            type: 'info', // (null, 'info', 'danger', 'success')
            offset: {from: 'bottom', amount: 80}, // 'top', or 'bottom'
            align: 'center', // ('left', 'right', or 'center')
            width: 800, // (integer, or 'auto')
            delay: 3000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
            allow_dismiss: true, // If true then will display a cross to close the popup.
            stackup_spacing: 10 // spacing between consecutively stacked growls.
        });

      $('.element-item')
            .attr('contenteditable', 'false')
            .css('cursor', 'pointer')
            .attr('title', 'Select')
            .attr('data-toggle', 'tooltip')
            .tooltip();
    } else {
      $('.frame-workspace-container span')
          .attr('contenteditable', 'true');
    }
 
    // make images resizable
    // FIXME: eventually we might want to resize the images from the
    // server side using imagemagick, and upload to S3 from the server
    // instead of directly from the client side.

    $('.frame-image').waitForImages(function() {
      $('.frame-image').resizable();
    });

    $(".draggable").draggable({
      containment: ".frame-workspace-container",
      scroll: false,
      stop: function (event, ui) {
        Session.set("elementId", this.id);

        // save new html automatically
        var currentHTML = $('#' + this.id).prop('outerHTML');
        Meteor.call("setHTML", this.id, currentHTML, function (err){
          if (err){
            console.log("saving HTML changes failed for " + this.id);
            return false;
            }
        });

      }
    });

    // make images resizable
    // why is workspace container resizalbe?
    $('.frame-workspace-container').resizable();

    this.autorun(function() {
      var addText = Session.get("addText");
      var addButton = Session.get("addButton");
      var addImage = Session.get("addImage");
      if (addText || addButton || addImage) {
        $('.frame-workspace-container').css('cursor', 'copy');
      }
    });
  });

  Template.FrameWorkSpace.events({

    "click .element-item": function (e, template) {
      var elementId = e.currentTarget.id;
      Session.set("elementId", elementId);
    },

    "blur .element-item[contenteditable='true']": function (e, template) {
      var elementId = e.currentTarget.id;

      // save html automatically
      var currentHTML = $('#' + elementId).prop('outerHTML');
      if (Elements.findOne({_id: elementId}).html != currentHTML) {
        Meteor.call("setHTML", elementId, currentHTML, function (err){
          if (err){
            console.log("saving HTML changes failed for " + elementId);
            return false;
          }
        });
      }
    },

    "mouseup .frame-image-container": function (e, template) {
      var elementId = e.currentTarget.id;
      var imageContainer = e.currentTarget;
      var $image = $(imageContainer).find('.frame-image');

      // have to destroy the resizable wrapper before we store HTML
      $image.resizable('destroy');
      var currentHTML = imageContainer.outerHTML;
      
      // wrap the image with resizble wrapper again
      $image.resizable();

      if (Elements.findOne({_id: elementId}).html != currentHTML) {
        Meteor.call("setHTML", elementId, currentHTML, function (err){
          if (err){
            console.log("saving HTML changes failed for " + elementId);
            return false;
          }
        });
      }
    },

    "click .frame-workspace-container": function (e, template) {
      var doAddText = Session.get("addText");
      var doAddButton = Session.get("addButton");
      var doAddImage = Session.get("addImage");
      var position = getPosition(e);
      var top = position.top;
      var left = position.left;
      var projectId = this._id;

      if (doAddText) {
        Session.set("addText", false);

        Meteor.call("addElement", {
          projectId: projectId,
          frameId: Session.get("frameId"),
          type: "text",
        }, function (err, elementId) {
          if (err) {
            console.log("Adding element failed", err);
            return false;
          }

          var htmlStr = "<span id= '" + elementId
                        + "' class='draggable element-item' "
                        + "style='font-family:Arial;"
                        + "font-size:18px;"
                        + "color:#000;"
                        + "position:absolute;"
                        + "top:" + top + "%;"
                        + "left:" + left + "%;'"
                        +">Text</span>";

          Meteor.call("setHTML", elementId, htmlStr, function(e) {
            if (e) {
              console.log("Setting selector failed");

              // Delete the object if setting HTML fails
              Meteor.call("deleteElement", elementId);
              return false;
            }
            
            var elt = Elements.findOne({_id: elementId});
              $('.frame-workspace-container').append(elt.html);
              $('#' + elementId).attr('contenteditable', 'true');

              $( ".draggable" ).draggable({
                containment: ".frame-workspace-container",
                scroll: false,
                stop: function (event, ui) {
                  Session.set("elementId", this.id);

                  // save new html automatically
                  var currentHTML = $('#' + this.id).prop('outerHTML');
                  Meteor.call("setHTML", this.id, currentHTML, function (err){
                    if (err){
                      console.log("saving HTML changes failed for " + this.id);
                      return false;
                      }
                  });
                 }
               });
          });
        });
        $('.frame-workspace-container').css('cursor', 'auto');

      } else if (doAddButton) {
        Session.set("addButton", false);

        Meteor.call("addElement", {
          projectId: projectId,
          frameId: Session.get("frameId"),
          type: "button",
        }, function (err, elementId){
          if (err) {
            console.log("Adding element failed", err);
            return false;
          }

          // removed the shadow on hover, but there's still lag when dragging
          var htmlStr = "<span id= '" + elementId
                        + "' class='btn btn-no-hover draggable element-item' "
                        + "style='font-family:Arial;"
                        + "font-size:18px;"
                        + "position:absolute;"
                        + "background-color:#00b0f0;"
                        + "color:#fff;"
                        + "top:" + top +"%;"
                        + "left:" + left + "%;'"
                        +">Button</span>";

          Meteor.call("setHTML", elementId, htmlStr, function (e) {
            if (e) {
              console.log("Setting selector failed");

              // Delete the object if setting HTML fails
              Meteor.call("deleteElement", elementId);
              return false;
            }

            var elt = Elements.findOne({_id: elementId});
            $('.frame-workspace-container').append(elt.html);

            $('#' + elementId).attr('contenteditable', 'true');

            $('#' + elementId).draggable({
              containment: ".frame-workspace-container",
              scroll: false,
              stop: function (event, ui) {
                Session.set("elementId", this.id);

                  // save new html automatically
                  var currentHTML = $('#' + this.id).prop('outerHTML');
                  Meteor.call("setHTML", this.id, currentHTML, function (err){
                    if (err){
                      console.log("saving HTML changes failed for " + this.id);
                      return false;
                      }
                  });
               }
            });
          });
        });
       $('.frame-workspace-container').css('cursor', 'auto');

      } else if (doAddImage) {
        Session.set("addImage", false);
        var imageUrl = doAddImage;

        Meteor.call("addElement", {
          projectId: projectId,
          frameId: Session.get("frameId"),
          type: "image",
        }, function (err, elementId) {
          if (err) {
            console.log("Adding element failed", err);
            return false;
          }

          var htmlStr = "<div class='draggable element-item frame-image-container' "
                        + "id='" + elementId + "'"
                        + "style='position:absolute;"
                        + "display: inline-block;"
                        + "top:" + top + "%;"
                        + "left:" + left + "%;'>"
                        + "<img class='frame-image' src='"
                        + imageUrl + "'>"
                        + "</div>";

          Meteor.call("setHTML", elementId, htmlStr, function(e) {
            if (e) {
              console.log("Setting selector failed");

              // Delete the object if setting HTML fails
              Meteor.call("deleteElement", elementId);
              return false;
            }

            var elt = Elements.findOne({_id: elementId});
            var $elt = $(elt.html);
            $('.frame-workspace-container').append($elt);

            // You have to wait until the image is loaded
            // before making it resziable
            var $image = $elt.find('.frame-image');
            $image.load(function() {
              $image.resizable();
            });

            $elt.draggable({
              containment: ".frame-workspace-container",
              scroll: false,
              stop: function (event, ui) {
                Session.set("elementId", this.id);

                  // save new html automatically
                  var currentHTML = $('#' + this.id).prop('outerHTML');
                  Meteor.call("setHTML", this.id, currentHTML, function (err){
                    if (err){
                      console.log("saving HTML changes failed for " + this.id);
                      return false;
                      }
                  });
              }
            });
          });
        });
        $('.frame-workspace-container').css('cursor', 'auto');
      }
    },
  });
}
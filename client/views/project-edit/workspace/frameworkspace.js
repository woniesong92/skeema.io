if (Meteor.isClient) {
  /* Helper funcitons for adding elements */
  var toggleShadow = function() {
    $('.sidenav-container, .toolbox-container').toggleClass('shadow');
    $('.overshadow').toggle();
  }

  var getPosition = function (e) {
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

    return {top: y, left: x};
  }

  //FIXME: merge overlaps with other _addTextElement and _addImageElement
  var _addButtonElement = function (position, projectId) {
    var top = position.top;
    var left = position.left;
    
    ProjectEditSession.set("addButton", false);

    Meteor.call("addElement", {
      projectId: projectId,
      trialId: ProjectEditSession.get("trialId"),
      frameId: ProjectEditSession.get("frameId"),
      type: "button",
    }, function (err, elementId){
      if (err) {
        console.log("Adding element failed", err);
        return false;
      }

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
            ProjectEditSession.set("elementId", this.id);

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
  };

  var _addImageElement = function (position, projectId) {
    var top = position.top;
    var left = position.left;

    ProjectEditSession.set("addImage", false);
    var imageUrl = doAddImage;

    Meteor.call("addElement", {
      projectId: projectId,
      trialId: ProjectEditSession.get("trialId"),
      frameId: ProjectEditSession.get("frameId"),
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
            ProjectEditSession.set("elementId", this.id);

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

  var _addTextElement = function (position, projectId) {
    var top = position.top;
    var left = position.left;

    ProjectEditSession.set("addText", undefined);

    Meteor.call("addElement", {
      projectId: projectId,
      trialId: ProjectEditSession.get("trialId"),
      frameId: ProjectEditSession.get("frameId"),
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

          $( ".draggable" ).draggable({
            containment: ".frame-workspace-container",
            scroll: false,
            stop: function (event, ui) {
              ProjectEditSession.set("elementId", this.id);

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

  Template.FrameWorkSpace.onCreated(function() {
    
    // this view is only showing for the user to choose
    // an element from the frame. After the user picks
    // one, the view should revert to the past trialView
    Tracker.autorun(function() {
      var pathInfo = ProjectEditSession.get("startChoosingElementToClick");
      if (pathInfo) {
        // collapse sidenav and toolbox
        ProjectEditSession.set("shouldExpandSideNav", false);
        ProjectEditSession.set("shouldExpandToolbox", false);
        
        var choosingElementDeferred = $.Deferred();
        choosingElementDeferred.then(function (selector) {
          ProjectEditSession.set("doneChoosingElementToClick", {
            pathInfo: pathInfo,
            eventType: "click",
            eventParam: selector
          });

          ProjectEditSession.set("startChoosingElementToClick", undefined);
          $('.show').removeClass('show').addClass('hide');

        }, function (err) {
          // FIXME: handle when deferred is rejected for any reason
        });

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
    });
  });

  Template.FrameWorkSpace.onRendered(function() {
    ProjectEditSession.set("elementId", null);

    var frameElts = Elements.find({
      "frameId": ProjectEditSession.get("frameId")
    });
    
    frameElts.forEach(function(elt) {
      $('.frame-workspace-container').append(elt.html);
    });

    if (Session.get("showChoosingElementView")){
      Utils.toast("<center>CHOOSE AN ELEMENT TO BE CLICKED</center>", {
        ele: '.frame-workspace-container',
        type: 'info'
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
 
    $('.frame-image').waitForImages(function() {
      $('.frame-image').resizable();
    });

    $(".draggable").draggable({
      containment: ".frame-workspace-container",
      scroll: false,
      stop: function (event, ui) {
        ProjectEditSession.set("elementId", this.id);

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
      var addText = ProjectEditSession.get("addText");
      var addButton = ProjectEditSession.get("addButton");
      var addImage = ProjectEditSession.get("addImage");
      if (addText || addButton || addImage) {
        $('.frame-workspace-container').css('cursor', 'copy');
      }
    });
  });

  Template.FrameWorkSpace.helpers({
    elements: function() {
      var frameId = ProjectEditSession.get('frameId');

      // check if new frame has just been added
      // this reactive var will make sure that every time
      // frameAdded value in Session changes, this function runs
      // var elementId = ProjectEditSession.get("elementAdded");

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

  Template.FrameWorkSpace.events({

    "click .element-item": function (e, template) {
      var elementId = e.currentTarget.id;
      ProjectEditSession.set("elementId", elementId);
    },

    "blur .element-item[contenteditable='true']": function (e, template) {
      var elementId = e.currentTarget.id;

      // Save html automatically
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
      var doAddText = ProjectEditSession.get("addText");
      var doAddButton = ProjectEditSession.get("addButton");
      var doAddImage = ProjectEditSession.get("addImage");
      var position = getPosition(e);
      var projectId = this._id;

      if (doAddText) {
        _addTextElement(position, projectId);
      } else if (doAddButton) {
        _addButtonElement(position, projectId);
      } else if (doAddImage) {
        _addImageElement(position, projectId);
      }
    },
  });
}

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
    
    // delete this after frame-workspace-container is 100% of body
    // x -= $('.frame-workspace-container').offset().left;
    // y -= $('.frame-workspace-container').offset().top;
    
    x = (x / $('.frame-workspace-container').width()) * 100;
    y = (y / $('.frame-workspace-container').height()) * 100;
    debugger
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
    }
  });

  Template.FrameWorkSpace.onCreated(function() {
    // FIXME: is it okay to add it here?
    // this is to prevent the modal from showing up
    // after clicking a trial from a frame view
    Session.set("pathInfo", null);

    // this view is only showing for the user to choose
    // an element from the frame. After the user picks
    // one, the view should revert to the past trialView
    this.chooseElement = Tracker.autorun(function() {
      var infoForChoosing = Session.get("showChoosingElementView");
      if (infoForChoosing) {
        var choosingElementDeferred = $.Deferred(function() {
          console.log("new deferred obj created");
        });

        choosingElementDeferred.then(function (selector) {
          

          // add this selector to the click event's param
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
            Session.set("pathInfo", null);
            Session.set("trialId", infoForChoosing.trialId);
            Session.set("currentView", "trialView");

            // FIXME: not sure how to apply it when the width is 100%
            // toggleShadow();
          });

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


  Template.FrameWorkSpace.rendered = function () {

    Session.set("elementId", null);

    var frameElts = Elements.find({"frameId": Session.get("frameId") });
    frameElts.forEach(function(elt) {
        $('.frame-workspace-container').append(elt.html);
    });

    $('.frame-workspace-container span').attr('contenteditable', 'true');

    $( ".draggable" ).draggable({
      containment: ".frame-workspace-container",
      scroll: false,
      stop: function (event, ui) {
        Session.set("elementId", this.id);
        console.log(this.id);
      }
    });


    this.autorun(function() {
      var addText = Session.get("addText");
      var addButton = Session.get("addButton");
      var addImage = Session.get("addImage");
      if (addText || addButton || addImage) {
        $('.frame-workspace-container').css('cursor', 'copy');
      }
    });
    
  }

  Template.FrameWorkSpace.events({

    "click .element-item": function (e, template) {
      Session.set("elementId", e.target.id);
    },

    "click .frame-workspace-container": function (e, template) {

      if (Session.get("addText")){
        Session.set("addText", false);
        var position = getPosition(e);
        var top = position.top;
        var left = position.left;

        var projectId = this._id;
      // Session.set("addText", true);
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
                 }
               });
          });
        });
        $('.frame-workspace-container').css('cursor', 'auto');
      }

      if (Session.get("addButton")){
            Session.set("addButton", false);
            var position = getPosition(e);
            var top = position.top;
            var left = position.left;
            var projectId = this._id;
        // Session.set("addText", true);
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
                        +"style='font-family:Arial;"
                        + "font-size:18px;"
                        + "position:absolute;"
                        + "background-color:blue;"
                        + "color:#fff;"
                        + "top:" + top +"%;"
                        + "left:" + left + "%;'"
                        +">Button</span>";
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

              $('#' + elementId).draggable({
                containment: ".frame-workspace-container",
                scroll: false,
                stop: function (event, ui) {
                  Session.set("elementId", this.id);
                 }
               });

          });
        });
       $('.frame-workspace-container').css('cursor', 'auto');
      }

      if (Session.get("addImage")){
        Session.set("addImage", false);
        //TODO
      }

    },

    
  });
}
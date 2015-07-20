if (Meteor.isClient) {

  /* Helper funcitons for adding elements */

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
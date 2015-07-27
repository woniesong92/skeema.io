if (Meteor.isClient) {
  Template.Projects.helpers({
    projects: function() {
      return UI.getData(); // is UI.getData() the right choice?
    }
  });

  Template.Projects.onRendered(function() {
    Session.set("currentView", "projectListView");

    Session.set("projectId", null);
    Session.set("blockId", null);
    Session.set("trialId", null);
    Session.set("frameId", null);
    Session.set("pathId", null);
    Session.set("elementId", null);

  });

  Template.Projects.events({
    "change .project-name": function (e, template) {
      var newname = $(e.target).val().trim();
      var projectId = this._id;
      Meteor.call('renameProject', projectId, newname);
    },

    "click .add-project": function (e, template) {
      e.preventDefault();
      var numProjects = UI.getData().fetch().length;
      var name = "Project " + numProjects;
      Meteor.call('addProject', name);
    },

    "click .project-item .rename": function (e, template) {
      // NOT implemented
    },

    "click .project-item .edit": function (e, template) {
      // NOT implemented
    },

    "click .project-item .delete": function (e, template) {
      Meteor.call('deleteProject', this._id, function (err, data) {
        if (err) {
          console.log("delete err");
          return
        }
        console.log("delete success");
      });
    }
  });
}

//       if (e.keyCode == 38 && template.search_index > 1) {
//         $('.search-result:nth-child('+ template.search_index +')').removeClass('highlight');
//         template.search_index--;
//         $('.search-result:nth-child('+ template.search_index +')').addClass('highlight');
//       } else if (e.keyCode == 40 && template.search_index >= 1) {
//         $('.search-result:nth-child('+ template.search_index +')').removeClass('highlight');
//         template.search_index++;
//         $('.search-result:nth-child('+ template.search_index +')').addClass('highlight');
//         return;
//       } else if (e.keyCode == 13 && template.search_index > 1) {
//         var course_no = $('.highlight').find($('.catalog-no')).text();
//          Router.go('/courses/'+course_no);
//          return;
//       } else {
//         template.search_index = 1;
//         $('.highlight').removeClass('highlight');
//       }
      
//       var text = $(e.target).val().trim();
//       CourseSearch.search(text);
//       // if ($('.search-results').children().length <= 1 || text == "") {
//       //   $('.search-results').css('visibility', 'hidden');
//       // }else{
//       //   $('.search-results').css('visibility', 'visible');
//       // }
//     },

//      'focus .main-search-bar':function() {
//         $('#custom-search-input')
//           .animate({
//           "border-bottom-width": "10px",
//           "border-bottom-color": "#595959",
//           "border-bottom-style": "solid",
//           "padding-bottom":"0px"
//         }, 200, function(){});
//        //$('.search-results').css('visibility', 'visible');
//    },
//      'blur .main-search-bar':function(){
//        $('#custom-search-input')
//        .animate({
//        "border-bottom-width": "1px",
//        "border-bottom-color": "#E4E4E4",
//        "border-bottom-style": "solid",
//        "padding-bottom":"10px"
//        }, 200, function(){});
//        //$('.search-results').css('visibility', 'hidden');
//      },
//      'mouseenter .search-result':function(e, template) {
//       $('.search-result:nth-child('+ template.search_index +')').removeClass('highlight');
//       $(e.currentTarget).addClass("highlight");
//       template.search_index = $('.highlight').index() +1;
//      },
//      'mouseleave .search-result':function(e, template) {
//       $('.search-result:nth-child('+ template.search_index +')').addClass('highlight');
//       $(e.currentTarget).removeClass("highlight");
//       template.search_index = $('.highlight').index() +1;
//      },
//      'click .search-result':function(e, template) {
//       var course_no = $('.highlight').find($('.catalog-no')).text();
//          Router.go('/courses/'+course_no);
//      }
//   });

// }


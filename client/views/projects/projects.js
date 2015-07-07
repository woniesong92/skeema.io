if (Meteor.isClient) {

  Template.Projects.helpers({
    projects: function() {
      return Projects.find();
    }
  });

  Template.Main.events({
    "click .project-item .rename": function (e, template) {
      // NOT implemented
    },

    "click .project-item .edit": function (e, template) {
      // NOT implemented
    },

    "click .project-item .delete": function (e, template) {
      // NOT implemented
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


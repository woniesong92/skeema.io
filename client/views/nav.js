if (Meteor.isClient) {
  Template.Nav.rendered = function() {
    this.search_index = -1;    
  }

  Template.Nav.helpers({
    'isMainPage': function(e, template) {
      return (Router.current().location.get().path == '/');
    }
  })

  Template.Nav.events({
    'click .user-dropdown': function(event, target){
      $('.user-dropdown-menus').slideToggle();
    },
    'click .logout': function(event){
      event.preventDefault();
      Meteor.logout();
      Router.go("/");
    },
    'click .user-profile': function(event){
      event.preventDefault();
      Router.go('/users/' + Meteor.userId());
    },
    'click .edit-account': function(event){
      event.preventDefault();
      Router.go('/users/' + Meteor.userId() +'/edit');
    },
    
  
    'keyup .course-nav-search':function(e, template) {
      if (e.keyCode == 38) {
        template.search_index--;
      } else if (e.keyCode == 40) {
        template.search_index++;
      } else if (e.keyCode == 13 && template.search_index >= 0) {
        var course_no = $('.highlight').find($('.catalog-no')).text();
        $('.course-nav-search').val("");
        Router.go('/courses/'+course_no);
      } else {
        template.search_index = -1;
        $('.highlight').removeClass('highlight');
        var text = $(e.target).val().trim();
        CourseSearch.search(text);
        return;
      }

      $('.search-result-item.highlight').removeClass('highlight');
      $('.search-result-item').eq(template.search_index).addClass('highlight');

    },

    'mouseenter .search-result-item':function(e, template) {
      $('.search-result-item').eq(template.search_index).removeClass('highlight');
      $(e.currentTarget).addClass("highlight");
      template.search_index = $('.highlight').index();
    },

    'mouseleave .search-result-item':function(e, template) {
      $('.search-result-item').eq(template.search_index).addClass('highlight');
      $(e.currentTarget).removeClass("highlight");
    },

    'click .search-result-item':function(e, template) {
      $('.course-nav-search').val("");
      var course_no = $('.highlight').find($('.catalog-no')).text();
      Router.go('/courses/'+course_no);
    }



    // 'mouseenter .search-results-nav':function(e, template) {
    //   $('.search-result-item').eq(template.search_index).removeClass('highlight');
    //   debugger
    //   $(e.currentTarget).addClass("highlight");
    //   template.search_index = $('.highlight').index() +1;
    //  },

    //  'mouseleave .search-results-nav':function(e, template) {
    //   $('.search-result-item').eq(template.search_index).addClass('highlight');
    //   $(e.currentTarget).removeClass("highlight");
    //   template.search_index = $('.highlight').index() +1;
    //  },

    //  'click .search-results-nav':function(e, template) {
    //   $('.course-nav-search').val("");
    //   var course_no = $('.highlight').find($('.catalog-no')).text();
    //      Router.go('/courses/'+course_no);
    //   }
    
    });
}





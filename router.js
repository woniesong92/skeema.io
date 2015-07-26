// Router.configure({
//   // this will be the default controller
//   controller: 'ApplicationController'
// });

Router.configure({
  layoutTemplate: 'Layout',
  waitOn: function() {
    // return Meteor.subscribe('userData');
  },
  onAfterAction: function() {
    // Clear previous search results
    // CourseSearch.store.remove({});
  }
});

Router.route('/', function () {
  this.render('Landing', {
    to: 'content'
  }); // Yield Main template to where {{> yield "content"}} is in layout.html
});

Router.route('/projects', {
  waitOn: function() {
    // FIXME(Important): subscribe project should be based on userId
    return Meteor.subscribe("projects");
    // return Meteor.subscribe("projects", userId);
  },

  action: function() {
    this.render('Projects', {
      data: Projects.find(),
      to: 'content'
    });
  }
});

Router.route('/projects/:_id', {
  waitOn: function() {
    var projectId = this.params._id;

    return [
      // FIXME: subscribe project should be based on userId
      Meteor.subscribe("project", projectId),
      Meteor.subscribe("blocks", projectId),
      Meteor.subscribe("trials", projectId),
      Meteor.subscribe("frames", projectId),
      Meteor.subscribe("paths", projectId),
      Meteor.subscribe("elements", projectId)
    ];
  },

  action: function() {
    var projectId = this.params._id;
    this.render('ProjectEdit', {
      data: Projects.findOne({_id: projectId}),
      to: 'content'
    });
  }
});

Router.route('/preview/:_projectid/', {
  waitOn: function() {
    var projectId = this.params._projectid;

    return [
      Meteor.subscribe("project", projectId),
      Meteor.subscribe("blocks", projectId),
      Meteor.subscribe("trials", projectId),
      Meteor.subscribe("frames", projectId),
      Meteor.subscribe("paths", projectId),
      Meteor.subscribe("elements", projectId)
    ];
  },

  action: function() {
    // debugger
    // var trialId = this.params._trialid;
    // var trialId = Trials.findOne({projectId: projectId, index: 0})._id;
    var projectId = this.params._projectid;
    var project = Projects.findOne({_id: projectId});
    
    this.render('PublishedTrial', {
      to: 'content',
      data: project
    });
  },
});

// HOWON: should I have a router for each action
// or should I just call Meteor method directly from
// client?
// Router.route('/projects/delete/:_id', function() {
//   var projectId = this.params._id;
//   Meteor.call("deleteProject", projectId);
// });



// Router.route('/about', {
//   'name': 'About',

//   'action': function() {
//     GARecordPage('/about');
//     CourseSearch.store.remove({});
//     this.render('About', {
//       to: 'content'
//     });
//   },

//   'onAfterAction': function() {
//     if (!Meteor.isClient) {
//       return;
//     }

//     SEO.set({
//       title: "Cornell Course Review",
//       meta: {
//         'description': "Cornell Course Review is a collaborative website that helps students select the best classes to enroll."
//       },
//       og: {
//         'image': 'http://cornellcoursereview.me/fbimg.png',
//         'title': 'Cornell Course Review',
//         'type': 'website',
//         'url': 'http://cornellcoursereview.me/about',
//         'site_name': 'Cornell Course Review',
//         'description': 'Cornell Course Review is a collaborative website that helps students select the best classes to enroll.'
//       }
//     });
//   }
// });

// Router.route('/courses/:_catalog', {
//   waitOn: function() {
//     var courseCatalog = this.params._catalog.toUpperCase();
//     return [Meteor.subscribe("comments", courseCatalog), Meteor.subscribe("courseCatalog", courseCatalog)];
//   },

//   action: function() {
//     var courseCatalog = this.params._catalog.toUpperCase();
//     // GARecordPage('/courses/'+courseCatalog);

//     // if (!Meteor.user()) {
//     //   Session.set("openSignInModal", true);
//     //   Session.set("redirectAddr", "/courses/"+courseCatalog);
//     //   Router.go('/');
//     //   return;
//     // }

//     var course = Courses.findOne({catalog: courseCatalog});


//     SEO.set({
//       title: "Cornell Course Review: " + course.catalog + " - " + course.titleLong + '('+ course.instructor +')',
//       meta: {
//         'description': "Cornell Course Review: " + course.catalog + " - " + course.titleLong + " : " + course.description
//       },
//       og: {
//         'image': 'http://cornellcoursereview.me/fbimg.png',
//         'title': "Cornell Course Review: " + course.catalog + " - " + course.titleLong + '('+ course.instructor +')',
//         'type': 'website',
//         'url': 'http://cornellcoursereview.me/courses/'+course.catalog,
//         'site_name': 'Cornell Course Review'
//       }
//     });
    
//     this.render('CourseDetail', {
//       to: 'content',
//       data: function () {
//         return course;
//       }
//     });

//   },
// });

// Router.route('/users/:_userId/edit', function () {
//   var userId = this.params._userId;
  
//   if (!Meteor.user()) {
//     Session.set("openSignInModal", true);
//     Router.go('/');
//     return;
//   }

//   GARecordPage("/users/"+userId+"/edit");
  

//   if (userId == Meteor.userId()) {
//       this.render('EditProfile', {
//         to: 'content',
//         data: function () {
//           return Meteor.users.findOne({_id: userId});
//         }
//        });
//   } else {
//     Router.go("/users/"+Meteor.userId()+"/edit");
//   }

//  });

// Router.route('/users/:_userId', function() {
//   var userId = this.params._userId;

//   if (!Meteor.user()) {
//     Session.set("openSignInModal", true);
//     Router.go('/');
//     return;
//   }

//   Meteor.subscribe("userReviews", userId);

//   GARecordPage("/users/"+userId);

//   if (userId != Meteor.userId()) {
//     Meteor.subscribe("otherUserData", userId); // allow limited information about other user
//   }

//   this.render('UserProfile', {
//     to: 'content',
//     data: function () {
//       return Meteor.users.findOne({_id: userId});
//     }
//    });
// });

// Router.route('/secret/admin', function() {
//   if (!Meteor.user()) {
//     Session.set("openSignInModal", true);
//     Router.go('/');
//     return;
//   } else if (Meteor.user().role != "admin") {
//     Router.go('/');
//     return;
//   }

//   var that = this;
//   Meteor.subscribe('infoForAdmin', function() {
//     that.render('Admin', {
//       to: 'content',
//     });
//   });

// });

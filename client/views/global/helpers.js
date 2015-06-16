// Global helpers

if (Meteor.isClient) {

  Template.registerHelper("courseSelected", function(event, course) {
    Router.go('/courses/'+course.catalog);
  });

  Template.registerHelper("emailAddress", function(userId) {
    if (userId == Meteor.user()._id) {
      return Meteor.user().emails[0].address;
    }

    // needs publish/subscribe to fetch the user data
    var user = Meteor.users.find({"_id":userId});
    if (user) {
      return user.emails[0].address;
    } else {
      return "n/a";
    }
  });
  
  //Template.registerHelper("isVerified", function() {
  //  return (Meteor.userId() && Meteor.user().emails[0].verified);
  //});
  

  Template.registerHelper("getCourses", function() {
    return CourseSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      }
    });
  });

  Template.registerHelper("isLoading", function() {
    return CourseSearch.getStatus().loading;
  });

  Template.registerHelper('isAdmin', function() {
    return (Meteor.user() && Meteor.user().role == "admin");
  });

  Template.registerHelper('formatDate', function(date) {
    return moment(date).format('MMMM Do YYYY, h:mm a');
  });
  
}

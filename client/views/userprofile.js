if (Meteor.isClient) {

  Template.UserProfile.events({
      'click .edit-account-btn': function(event, target){
        Router.go('/users/'+ Meteor.userId() +'/edit');
      },
      'click .link-to-detail': function(event, target){
        var course_no = $(event.target).text();
         Router.go('/courses/'+course_no);
      }
  });

  Template.UserProfile.helpers({
      'isMyProfile': function() {
        return Meteor.userId() == this._id;
      },
      'reviews': function() {
        // var reviews = Comments.find({owner: userId});
        var reviews = Comments.find();
        return reviews;
      }
  });

  Template.EditProfile.rendered = function() {
    $('#username-update').focus();
  }

  Template.EditProfile.events({
    'submit form#password-change-form': function(event, template) {
        event.preventDefault();
        var passwordVar = template.find('#password-update').value;
        var passwordConfirmVar = template.find("#password-update-confirm").value;
        var oldPasswordVar = template.find("#old-password").value;
        if (passwordVar == passwordConfirmVar) {
          Accounts.changePassword(oldPasswordVar, passwordVar, function(err){
            if (err) {
              $('.update-account-success').text("");
              if (err.reason == "Incorrect password") {
                $('.update-account-error').text("Incorrect password.");
              }else{
                alert("Some error happened");
              }
            }else{
              $('.update-account-error').text("");
              $('.update-account-success').text("Your password has been updated.");
              $(".password-input").val("");
            }
          });
        }else{
          $('.update-account-success').text("");
          $('.update-account-error').text("Passwords do not match.");
        }
        return false;
    },
    
    'submit form#username-change-form': function(event, target) {
      event.preventDefault();
      var newUsername = $('#username-update').val();
      if (isValid(newUsername)) {
        Meteor.call('editUsername', newUsername, function(err, result) {
          if (err) {
              $('.update-account-error').text("Some error occurred.");
              $('.update-account-success').text("");
          } else if (result) {
              if (result.err == "That username already exists! Try a different one.") {
                 $('.update-account-error').text("");
                $('.update-account-success').text("Your username has been updated.");
              }else{
              $('.update-account-error').text("Username failed to update.");
              $('.update-account-success').text("");
              }
          } else {
              $('.update-account-error').text("");
              $('.update-account-success').text("Your username has been updated.");
          }
        });
      }
    }
  });

  Template.EditProfile.helpers({
    'welcomeMessage': function() {
      if (Session.get("welcomeMessage")) {
        var welcomeMessage = Session.get("welcomeMessage");
        delete Session.keys['welcomeMessage']
        return welcomeMessage;
      } else {
        return "People will see your username on your comments.";  
      }
    }
  })
}


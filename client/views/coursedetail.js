if (Meteor.isClient) {

  Template.Comments.helpers({
    comments: function() {
      return Comments.find({}, {sort: {votes: -1, createdAt: -1}});
    }
  });

  Template.Comment.helpers({
    isMine: function(owner) {
      return owner == Meteor.userId();
    }
  });

  Template.Comment.rendered = function() {
    var comment = UI.getData();
    var myId = Meteor.userId();
    var date = comment.createdAt;
    var formattedDate = moment(date).format('MMMM Do YYYY, h:mm a');
    $('.createdat').text(formattedDate);
    if (comment && comment.upvoters && comment.upvoters.indexOf(myId) > -1) {
      $(this.find('.upvote')).css('color', '#B23636');
    } else if (comment.downvoters.indexOf(myId) > -1) {
      $(this.find('.downvote')).css('color', '#B23636');
    }
  }

  Template.CourseUpvote.events({
    'click button.btn-course-upvote': function(event, target) {
      event.preventDefault();
      if (!Meteor.user()) {
        $('#SigninModal').modal('show');
        return;
      }
      
      Meteor.call('courseUpvote', UI.getData().catalog);
    }
  })


  Template.Comment.events({
    'click button.upvote': function(event, target) {
      if (!Meteor.user()) {
        $('#SigninModal').modal('show');
        return;
      }
      if (Meteor.userId() == target.data.owner) {
        console.log("cannot vote for your own comment");
        return;
      }
      Meteor.call('upVote', target.data._id, function (err, result) {
        if (result) {
          $(target.find('.upvote')).css('color', '#B23636');
          Meteor.call('upvotePoint', target.data.owner);
          if (target.data.downvoters.indexOf(Meteor.userId()) > -1) {
            Meteor.call('upvotePoint', target.data.owner);
            $(target.find('.downvote')).css('color', 'black');
          }
        } else {
          $(target.find('.upvote')).css('color', 'black');
          Meteor.call('downvotePoint', target.data.owner);
        }
      });
    },

    'click button.downvote': function(event, target) {
      if (!Meteor.user()) {
        $('#SigninModal').modal('show');
        return;
      }
      if (Meteor.userId() == target.data.owner) {
        console.log("cannot vote for your own comment");
        return;
      }
      Meteor.call('downVote', target.data._id, function (err, result) {
        if (result) {
          $(target.find('.downvote')).css('color', '#B23636');
          Meteor.call('downvotePoint', target.data.owner);
          if (target.data.upvoters.indexOf(Meteor.userId()) > -1) {
            Meteor.call('downvotePoint', target.data.owner);
            $(target.find('.upvote')).css('color', 'black');
          }
        } else {
          $(target.find('.downvote')).css('color', 'black');
          Meteor.call('upvotePoint', target.data.owner);
        }
      });
    },

    'click .delete-comment': function(event, target) {
      Meteor.call('deleteComment', target.data._id);
      Meteor.call('deletePoints', Meteor.userId());
    },

    'click .edit-comment': function(event, target) {
      var editLink = $(event.target);
      var submitLink = $("<a class='submit-edit-comment' href='#'>Submit</a>");
      var commentBody = $(event.target).siblings('.comment-body');
      var prevText = commentBody.text().trim();
      var editableText = $("<textarea rows='3' minlength='10' maxlength='500' class='edit-body' />");
      editableText.val(prevText);
      commentBody.replaceWith(editableText);
      editableText.focus();
      editLink.replaceWith(submitLink);
      submitLink.on("click", function() {
        var newText = $('.edit-body').val();
        if (!isValidComment(newText)) {
          $(this).siblings('.edit-error-msg').show();
        } else {
          Meteor.call('editComment', target.data._id, newText);
          var newCommentBody = $("<div class='comment-body'></>");
          newCommentBody.text(newText);
          $(this).siblings('.edit-error-msg').hide();
          $(this).siblings(".edit-body").replaceWith(newCommentBody);
          $(this).replaceWith($("<a class='edit-comment' href='#'>Edit</a>"));
        }
      });
    },
    
    'click .commenter-username': function(event, target) {
       Router.go('/users/' + target.data.owner);
    }
  });  

  Template.NewComment.events({
    'submit #write-comment': function(event) {
      event.preventDefault();
      var text = $('#new-comment-body').val();
      var catalog = UI.getData().catalog;
      Meteor.call("addComment", text, catalog);
      Meteor.call('commentPoints', Meteor.userId());
      $('#new-comment-body').val("");
    },

    'submit .tt-input':function() {
      $('#custom-search-input')
      .animate({
      "border-bottom-width": "10px",
      "border-bottom-color": "#C7C7C7",
      "border-bottom-style": "solid",
      "padding-bottom":"0px"
      }, 200, function(){});
    }
  });
  
  Template.CourseUpvote.helpers({
    hasVoted: function() {
      if (this && this.upvoters) {
        return this.upvoters.indexOf(Meteor.userId()) > -1;
      }
    }
  });
  
  Template.CourseAbout.helpers({
    isGold: function() {
      if (this && this.upvoters) {
        return this.upvoters.length >= 100;
      }
    }
  });
  
  Template.CourseAbout.helpers({
    isSilver: function() {
      if (this && this.upvoters) {
        return this.upvoters.length >= 50;
      }
    }
  });

}

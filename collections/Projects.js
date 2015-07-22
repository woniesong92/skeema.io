Projects = new Mongo.Collection("projects");

Meteor.methods({
  addProject: function (name) {
    var project = {
      "name": name,
      "createdAt": Date.now()
    };

    Projects.insert(project);
  },

  deleteProject: function (projectId) {
    Projects.remove({_id: projectId});

    // FIXME: this doesn't work because publications.js must be
    // edited to take userId into account first
    // var blockIds = _.map(Blocks.find({projectId: projectId}).fetch(),
    //   function (block) { return block._id; });
    // Meteor.call("deleteBlocks", blockIds);
  }
});


// Courses = new Mongo.Collection("courses");
// Meteor.methods({
//   addCourse: function (data, callback) {
//     var course = {
//       "subject": data["subject"],
//       "catalogNbr": data["catalogNbr"],
//       "catalog": data["subject"] + data["catalogNbr"],
//       "titleLong": data["titleLong"],
//       "titleShort": data["titleShort"],
//       "instructor": data["instructor"],
//       "catalogWhenOffered": data["catalogWhenOffered"],
//       "description": data["description"],
//       "crseId": data["crseId"],
//       "classNbrs": [],
//       "votes": 0
//     };

//     Courses.insert(course);
//   },

//   deleteCourse: function (courseId) {
//     Courses.remove({"_id": courseId});
//   },

//   courseUpvote: function(courseCatalog) {
//     var course = Courses.findOne({"catalog": courseCatalog});
//     var courseId = course._id;

//     if (!Meteor.userId()) {
//       alert("You need to sign in first!");
//       return;
//     }

//     if (course.upvoters.indexOf(Meteor.userId()) > -1) {
//       var idx = course.upvoters.indexOf(Meteor.userId());
//       course.upvoters.splice(idx, 1); // updates in place
//       Courses.update(courseId, {
//         $set: {'upvoters': course.upvoters},
//         $inc: {'votes': -1}
//       });

//     } else {
//       course.upvoters.push(Meteor.userId());
//       Courses.update(courseId, {
//         $set: {'upvoters': course.upvoters},
//         $inc: {'votes': 1}
//       });
//     }
//   }
  
// });
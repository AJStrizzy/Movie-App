const db = require('./models')

// db.Review.create({
//   userId: 1,
//   movieId: 1,
//   review: 'Great Movie'

// }).then(function(Review) {
//   console.log(Review.review)
// })

// db.User.findOrCreate({
//     where: {
//       name: "Project 1",
//       githubLink: "github.com",
//       deployLink: "github.com",
//       description: "blah blah"
//     }
//   }).then(function([project, created]) {
//     // Second, get a reference to a toy.
//     db.category.findOrCreate({
//       where: {name: "literature"}
//     }).then(function([category, created]) {
//       // Finally, use the "addModel" method to attach one model to another model.
//       project.addCategory(category).then(function(relationInfo) {
//         console.log(category.name, "added to", project.name);
//       });
//     });
//   });
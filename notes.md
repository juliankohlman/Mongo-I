// RELATIONSHIPS IN MONGO
subdocument (embedded document)
// on each model
  // import mongoose
  // export

// THINK ABOUT ACCESS PATTERNS WHEN DESIGNING DATA
// index: true --> inside schema

// one to one: --> book --> author || (user <> profile)
  // subdoc

// one to many: author --> books
  // ref

// many to many


const AuthorModel = mongoose.model('Author', AuthorSchema);
type: ObjectId, ref: 'Model Name'

Bookstore
  Books
  Authors
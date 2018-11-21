const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
  bookId: { type: Number, required: false }, // The id of the user who posted,
  title: { type: String, required: false }, // the id of the business this is attached to. WE WILL LET MONGODB MAKE IT'S UNIQUE PRIMARY KEY ID FOR THIS SINCE IT'S NOT SPECIFIED.
  author: { type: String, required: false }, // the display name of the business this is attached to for our own navigation purposes (just to make the db easier to read.)
  publisher: { type: String, required: false }, // Whether it has a food special
  publicationDate: { type: String, required: false }, // Whether it has a drink special
  licenseRights: { type: String, required: false }, // Day of deal SET FALSE NOW BUT WHEN WE IMPLMENET TIME THIS WILL BE TRUE
  titles: { type: Array, required: false }, // Beginning of deal time SET FALSE NOW BUT WHEN WE IMPLMENET TIME THIS WILL BE TRUE


})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book


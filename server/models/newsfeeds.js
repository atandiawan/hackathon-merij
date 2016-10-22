let mongoose = require('mongoose')
let Schema = mongoose.Schema

let newsfeedsSchema = new Schema({
  title: String,
  content: String,
  createdAt: Date
  //can be updated later
})

let Newsfeeds = mongoose.model('newsfeeds', newsfeedsSchema)
module.exports = Newsfeeds

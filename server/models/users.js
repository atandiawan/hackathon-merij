let mongoose = require('mongoose')
mongoose.connect('localhost:27017/test-merij-1')
let Schema = mongoose.Schema

let usersSchema = new Schema({
  username: String,
  password: String,
  partner_username: String,
  registration_status: String,
  list_of_timeline: [{
    content: String,
    like: String,
    createdAt: Date
  }],
  list_of_favorite_newsfeed:[{
    newsfeed:{
      type: Schema.Types.ObjectId,
      ref: 'newsfeed'
    }
  }],
  list_of_important_moment:[{
    moment_title: String,
    moment_date: Date,
    moment_detail: String
  }],
  mentor_name: String
})

let Users = mongoose.model('users', usersSchema)
module.exports = Users

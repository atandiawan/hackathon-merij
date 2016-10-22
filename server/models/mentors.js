let mongoose = require('mongoose')
let Schema = mongoose.Schema

let mentorsSchema = new Schema({
  mentor_name: String,
  list_of_content: [{
    title: String,
    content: String
  }]
})

let Mentors = mongoose.model('mentors', mentorsSchema)
module.exports = Mentors

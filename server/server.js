let express = require('express')
let app = express()
let port = process.env.PORT || 3000
let api = require('./routes/api.js')
let bodyParser = require('body-parser')

app.use(bodyParser())

app.use('/api', api)

app.listen(port, function(){
  console.log("listening on", port)
})

let express = require('express')
let router = express.Router()
let Users = require('../models/users.js')

router.get('/test', function(req,res,next){
  res.send('test')
})

//USERS

router.get('/users', function(req,res,next){
  Users.find({}, function(err,result){
    res.json(result)
  })
})

router.post('/users/register', function(req,res,next){
  Users.findOne({username: req.body.partner_username}, function(err_partner, partner){
    if(partner == null){
      let newuser = new Users({username: req.body.username, password: req.body.password, partner_username: req.body.partner_username, registration_status:"not done"}).save(function(err_save_result, save_result){
        if(err_save_result){
          res.json({message:"error", detail: err_save_result})
        } else {
          res.json(save_result)
        }
      })
    } else {
      Users.update({_id: partner._id}, {registration_status:"done"}, function(err_partner_update, partner_update){
        if(err_partner_update){
          console.log(err_partner_update)
        } else {
          console.log(partner_update)
        }
      })

      let newuser = new Users({username: req.body.username, password: req.body.password, partner_username: req.body.partner_username, registration_status:"done"}).save(function(err_save_result, save_result){
        if(err_save_result){
          res.json({message:"error", detail: err_save_result})
        } else {
          res.json(save_result)
        }
      })
    }
  })
})

//USER LOGIN

router.post('/users/login', function(req,res,next){
  Users.findOne({username:req.body.username, password: req.body.password}, function(err,result){
    if(result == null){
      res.json({message: "wrong credential"})
    } else {
      res.json(result)
    }
  })
})

//POSTING TIMELINE

router.post('/users/timeline', function(req,res,next){
  Users.update({$or:[{username: req.body.username}, {partner_username: req.body.username}]}, {$push:{list_of_timeline:{content: req.body.content, like:"no", createdAt: new Date()}}},{multi:true}, function(err, result){
    if(err){
      res.json({message: "error", detail: err})
    } else {
      res.json(result)
    }
  })
})

//GET USERS DATA

router.get('/users/information', function(req,res,next){
  Users.findOne({username: req.body.username}, function(err,result){
    res.json(result)
  })
})

module.exports = router

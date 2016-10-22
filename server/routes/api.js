let express = require('express')
let router = express.Router()
let Users = require('../models/users.js')
let Newsfeeds = require('../models/newsfeeds.js')
let Mentors = require('../models/mentors.js')

//GET_ALL_USERS
router.get('/users', function(req,res,next){
  Users.find({}, function(err,result){
    res.json(result)
  })
})

//REGISTER_A_NEW_USER - INPUT: username, password, partner_username
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

//USER_LOGIN - INPUT: username, password
router.post('/users/login', function(req,res,next){
  Users.findOne({username:req.body.username, password: req.body.password}, function(err,result){
    if(result == null){
      res.json({message: "wrong credential"})
    } else {
      res.json(result)
    }
  })
})

//POSTING A NEW TIMELINE - INPUT: username,content
router.post('/users/timeline', function(req,res,next){
  if(req.body.content.search(".jpg")!= -1){
    Users.update({$or:[{username: req.body.username}, {partner_username: req.body.username}]}, {$push:{list_of_timeline:{content: req.body.content, type_of_content:"image", like:"no", createdAt: new Date()}}},{multi:true}, function(err, result){
      if(err){
        res.json({message: "error", detail: err})
      } else {
        res.json(result)
      }
    })
  } else if (req.body.content.search("youtube") != -1){
    Users.update({$or:[{username: req.body.username}, {partner_username: req.body.username}]}, {$push:{list_of_timeline:{content: req.body.content, type_of_content:"video", like:"no", createdAt: new Date()}}},{multi:true}, function(err, result){
      if(err){
        res.json({message: "error", detail: err})
      } else {
        res.json(result)
      }
    })
  } else {
    Users.update({$or:[{username: req.body.username}, {partner_username: req.body.username}]}, {$push:{list_of_timeline:{content: req.body.content, type_of_content:"text", like:"no", createdAt: new Date()}}},{multi:true}, function(err, result){
      if(err){
        res.json({message: "error", detail: err})
      } else {
        res.json(result)
      }
    })
  }
})

//GET A USER'S DATA - NEWSFEED and IMPORTANT MOMENT (TIMELINE IS FROM OTHER PLACE)
router.get('/users/:username', function(req,res,next){
  Users.findOne({username: req.params.username}, function(err,result){
    if(err){
      res.json({message:"error", detail: err})
    } else {
      res.json(result)
    }
  })
})

//GET A USER'S TIMELINE
router.get('/timeline/:username', function(req,res,next){
  Users.findOne({username: req.params.username}, function(err,result){
    if(err){
      res.json({message:"error", detail: err})
    } else {
      let sortedList = result.list_of_timeline.sort(function(a,b){
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      res.json(sortedList)
    }
  })
})

//GET ALL NEWSFEED - ALREADY SORTED
router.get('/newsfeeds', function(req,res,next){
  Newsfeeds.find({}).sort({"createdAt": -1}).exec( function(err,result){
    if(err){
      res.json({message:"error", detail: err})
    } else {
      res.json(result)
    }
  })
})

//POST A NEW NEWSFEED - INPUT: title, content
router.post('/newsfeeds', function(req,res,next){
  let newNewsfeed = new Newsfeeds({title: req.body.title, content: req.body.content, createdAt: new Date()}).save(function(err,result){
    if(err){
      res.json({message:"error", detail: err})
    } else {
      res.json(result)
    }
  })
})

//POST A NEW IMPORTANT MOMENT - INPUT: username, moment_title, moment_date, moment_description
router.post('/users/important_moment', function(req,res,next){
  Users.update({$or:[{username: req.body.username}, {partner_username: req.body.username}]}, {$push:{list_of_important_moment:{moment_title: req.body.moment_title, moment_date:req.body.moment_date, moment_description: req.body.moment_description}}},{multi:true}, function(err, result){
    if(err){
      res.json({message: "error", detail: err})
    } else {
      res.json(result)
    }
  })
})

//ADD A NEW MENTOR FOR THE USER - username, mentor_name
router.post('/users/mentor_name', function(req,res,next){
  Users.update({username: req.body.username, mentor_name: req.body.mentor_name}, function(err,result){
    if(err){
      res.json({message: "error", detail: result})
    } else {
      res.json(result)
    }
  })
})

//ADD A NEW MENTOR IN DATABASE - mentor_name
router.post('/mentors/add_user', function(req,res,next){
  let newmentor = new Mentors({mentor_name: req.body.mentor_name}).save(function(err,result){
    if(err){
      res.json({message: "error", detail: err})
    } else {
      res.json(result)
    }
  })
})

//ADD CONTENT TO THE MENTOR - mentor_name, title, content
router.post('/mentors/add_content', function(req,res,next){
  Mentors.update({mentor_name: req.body.mentor_name}, {$push:{list_of_content:{title: req.body.title, content: req.body.content}}},function(err, result){
    if(err){
      res.json({message: "error", detail: err})
    } else {
      res.json(result)
    }
  })
})

//GET ALL MENTORS DATA
router.get('/mentors', function(req,res,next){
  Mentors.find({}, function(err,result){
    if(err){
      res.json({message: "error", detail: err})
    } else {
      res.json(result)
    }
  })
})

//GET DATA BY MENTOR'S NAME
router.get('/mentors/:mentor_name', function(req,res,next){
  Mentors.find({mentor_name: req.params.mentor_name}, function(err,result){
    if(err){
      res.json({message: "error", detail: err})
    } else {
      res.json(result)
    }
  })
})

module.exports = router

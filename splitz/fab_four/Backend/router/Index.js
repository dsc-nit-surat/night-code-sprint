var express = require("express");
var router  = express.Router();
var User = require("./../Mongoose-model/User");

//root route
router.get("/", function(req, res){
    res.render("home");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    // res.send("register")
    var email = req.body.email
    var first_name = req.body.fname
    var last_name = req.body.lname
    var password = req.body.password
    var newUser = new User({
        name : first_name + " " + last_name,
        email : email,
        password : password
    })
    console.log(newUser);
    User.findOne({email : email}, (err , user) => {
        if (err){
            console.log(err);
        } else {
            if (user){
                res.render("register")
            } else {
                newUser.save()
                res.render("index")
            }
        }
    })
});

// show register form
router.get("/login", function(req, res){
    res.render("login"); 
 });
 
 
// show notifications
router.get("/notification", function(req, res){
    res.render("notifications",{}); 
 });
 

 //handle sign up logic
 router.post("/login", function(req, res){
        var email = req.body.email;
        var password = req.body.password
        var newUser = new User(email);
     User.findOne({email : email}, function(err, user){
        if (err){
            console.log(err);
        } else {
            if (user){
                if (user.password === password){
                    res.render("index")
                }
                res.send("login")
            } else {
                res.send("login")
            }
        }
     });
 });
 

module.exports = router;

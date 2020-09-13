var express = require("express");
var router  = express.Router();
var User = require("../Mongoose_model/User");

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
    var email = ({email: req.body.email});
    var newUser = new User(email);
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            
            return res.render("register");
        }
        else{ if(User) {
        	res.render("login");
        }};


    });
});


module.exports = router;

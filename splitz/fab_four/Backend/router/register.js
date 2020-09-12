const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
require("../config/user-passport")(passport);

// Load input validation
const validateRegisterInput = require("./../validation/register")

// Load User Model
const User = require("./../Mongoose-models/User")

// @url     POST /api/users/register
// @desc    Create or update user
// @access  Public
router.post("/register",(req,res) => {
    // Input validation
    const {errors,isValid} = validateRegisterInput(req.body);
    
    if (!isValid){
        return res.status(400).json(errors)
    }

    User.findOne({email : req.body.email})
        .then(user => {
            if (user) {
                errors.email = 'Email already exist';
                return res.status(400).json(errors)
            } else {
                const newUser = new User({
                    name : req.body.name,
                    email : req.body.email,
                    password : req.body.password
                })

                bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password,salt, (err,hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                }))
            }
        })
})

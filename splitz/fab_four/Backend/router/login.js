const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
require("../config/user-passport")(passport);

// Load input validation
const validateRegisterInput = require("./../validation/register")
const validateLoginInput = require("./../validation/login");

// Load User Model
const User = require("./../Mongoose-models/User")

// @route   POST api/users/login
// @desc    Login User / returning token
// @access  Public
router.post("/login",(req,res) => {
    // Input validation
    const {errors,isValid} = validateLoginInput(req.body);

    if (!isValid){
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({email})
        .then(user => {
            if (!user){
                errors.email = 'User not Found';
                return res.status(404).json(errors)
            } else {
                // Check Password
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            // User Match

                            const payload = {id : user.id,name:user.name,email : user.email,userImage : user.userImage}

                            // Sign Token
                            jwt.sign(payload,
                                keys.secretOrKey,
                                {expiresIn : 10000},
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        token: 'Bearer ' + token
                                    })
                            })
                        } else {
                            errors.password = "Password incorrect";
                            return res.status(400).json(errors);
                        }
                    })
            }
        })
})


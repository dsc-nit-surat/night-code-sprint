const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/key");
const upload_single = require("./../imageUpload/multer_single");
const passport = require("passport");
require("../config/user-passport")(passport)
const isEmpty = require("./../validation/is_empty");

// Load input validation
const validateRegisterInput = require("./../validation/register")
const validateLoginInput = require("./../validation/login");

// Load User Model
const User = require("./../Mongoose-models/User")

// Load Product Model
const Product = require("./../Mongoose-models/Product");

// Admin passport
const admin_passport = require("passport");
require("./../config/admin-passport")(admin_passport);

// @url     Get /api/users/all
// @desc    Gives details of all the user
// @access  Private / Admin access only
router.get("/all",admin_passport.authenticate('admin-jwt',{session:false}),(req,res) => {
    const errors = {}
    User.find({},(err,users) => {
        if (users) {
            res.send(users)
        } else {
            console.log(users);
            
            errors.nouser = "There is no user registered yet."
            res.status(404).json(errors)
        }
    })
})

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

// @route   GET api/users/current
// @desc    Return Current User
// @access  Private
router.get("/current",passport.authenticate('user-jwt',{session:false}),(req,res) => {
    res.json({
        id : req.user.id,
        name : req.user.name,
        email : req.user.email
    })
})

// @route   POST api/users/userimage
// @desc    Return Current User
// @access  Private
router.post("/userimage",passport.authenticate('user-jwt',{session:false}),upload_single,(req,res) => {
    let errors = {}
    let userID = req.user.id;
    if (!req.file){
        errors.userImage = "Please select an user Image";
        res.status(400).json(errors);
    } else {
    User.findOne({_id :{$in : [userID]}},(err, user) => {
        if (!user) {
            errors.nouser = "No User Found";
            res.status(404).json(errors);
        } else {
            user.olduserimages.unshift(user.userImage)
            user.userImage = req.file;
            User.findOneAndUpdate({_id :{$in : [userID]}},user,{new:true})
                .then(user => {
                    const payload = {id : user.id,name:user.name,email : user.email,userImage : user.userImage}
                    res.json(payload)
                })
                .catch(err => res.json(err))
        }
    })}
})

// @route   POST api/users/cart/edit
// @desc    Update the cart of the user to the database
// @access  Private
router.post("/cart/edit", passport.authenticate("user-jwt",{session : false}),(req,res) => {
    const userID = req.user.id;
    const errors = {};
    User.find({_id :{$in : [userID]}},(err,user) => {
        if (user){
            const update = user[0];
            update.cart = req.body;
            User.findOneAndUpdate({_id :{$in : [userID]}},update, {new : true})
                .then(user => {
                    res.json(user.cart)})
                .catch(err => res.status(400).json(err))
        }
        else {
            errors.nouser = "No user Found";
            res.status(404).json(errors);
        }
    })
})

// @route   GET api/users/cart/edit
// @desc    Get the cart to the frontend
// @access  Private
router.get("/cart", passport.authenticate("user-jwt",{session : false}),(req,res) => {
    var userID = req.user.id;
    User.findOne({_id :{$in : [userID]}},(err,user) => {
        if (isEmpty(user.cart)){
            res.json({cart : {
                products : []
            }})
        } else {
            res.json({cart : user.cart});
        }
    })
})

// @url     GET /api/product/cart
// @desc    get cart desc for productIDs
// @access  Public
router.post("/cart/productdetails",(req,res) => {
    const cart = req.body;
        Product.find({_id : {$in : cart.products}} , (err , product) => {

            for (var i = 0; i < product.length ; i++){
                const details = {}
                details.id = product[i]._id
                details.title = product[i].title
                details.subtitle = product[i].subtitle
                details.price = product[i].price
                details.image = product[i].images[0]
                product[i] = details
            }
            res.json(product)
        })
})
module.exports = router;
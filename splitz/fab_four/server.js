// const mongoose = require("mongoose");
// const express = require("express");
// const bodyParser = require("body-parser");

// // Connecting mongoose
// mongoose.connect("mongodb+srv://admin:fab_four@cluster0.rhxth.gcp.mongodb.net/fab_four",{ useNewUrlParser: true,useUnifiedTopology: true },() => console.log("MongoDB connected"))
// mongoose.set('useFindAndModify', false);

// // Router files
// const dashboard = require("./Backend/router/dashboard");
// const register = require("./Backend/router/register");
// const login = require("./Backend/router/login");

// // import User model
// const User = require("./Backend/Mongoose-model/User")

// // Initialising app
// const app = express();

// app.set('view engine', 'ejs');

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));


// // Parsing JSON
// app.use(express.json());

// // Initialising router
// app.use("/api/dashboard/",dashboard);
// app.use("/api/register/",register)
// app.use("/api/login/",login)

// app.get("/",(req,res) => {
//     User.find({} , (err, users) => {
//         if (err){console.log(err)}
//     else{
//         if (users.length == 0){
//           Item.insertMany(defaultItems,function(err){
//           if (err) {
//             console.log(err);
//           } else {
//             console.log("Successfully added default items ...");
//           }
//         });
//         res.redirect("/");
//       }
//         else {
//         res.render("list", {listTitle: "Today", newListItems: foundItems});
//         }
//       }
//     })
//     console.log()
//     res.send("hello")
// });

// // Initialisin port
// port = process.env.PORT || 5000;

// app.listen(port, (req,res) => {
//     console.log("Server is running on port " + port);
// });

var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  User = require("./Backend/Mongoose-model/User");

// Connecting mongoose
mongoose.connect("mongodb+srv://admin:fab_four@cluster0.rhxth.gcp.mongodb.net/fab_four",{ useNewUrlParser: true,useUnifiedTopology: true },() => console.log("MongoDB connected"))


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));        

const root = require("./Backend/router/Index");

app.get("/" ,(req,res) => {
    res.send("Home");
})

app.use("/", root);
// app.use("/register", register);
// app.use("/dashboard", dashboard);
// app.use("/notification", notification);
port = process.env.PORT || 5000;
app.listen(port, (req,res) => {
        console.log("Server is running on port " + port);
    });
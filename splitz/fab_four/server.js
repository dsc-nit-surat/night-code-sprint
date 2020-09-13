// const mongoose = require("mongoose");
// const express = require("express");
// const bodyParser = require("body-parser");

<<<<<<< HEAD
// // Connecting mongoose
// mongoose.connect("mongodb+srv://admin:fab_four@cluster0.rhxth.gcp.mongodb.net/fab_four",{ useNewUrlParser: true,useUnifiedTopology: true },() => console.log("MongoDB connected"))
=======


// // Connecting mongoose
// mongoose.connect("mongodb+srv://admin:fab_four@cluster0.rhxth.gcp.mongodb.net/fab_four" + database,{ useNewUrlParser: true,useUnifiedTopology: true },() => console.log("MongoDB connected"))
>>>>>>> f10bde3804d1f7cb707f1da48015f57890deb5ec
// mongoose.set('useFindAndModify', false);

// // Router files
// const dashboard = require("./Backend/router/dashboard");
// const register = require("./Backend/router/register");
// const login = require("./Backend/router/login");

<<<<<<< HEAD
// // import User model
// const User = require("./Backend/Mongoose-model/User")

// // Initialising app
// const app = express();

// app.set('view engine', 'ejs');

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));

=======
// // Initialising app
// const app = express();

// // Setting bodyParser
// app.use(bodyParser.urlencoded({extended : true}))
>>>>>>> f10bde3804d1f7cb707f1da48015f57890deb5ec

// // Parsing JSON
// app.use(express.json());

// // Initialising router
// app.use("/api/dashboard/",dashboard);
// app.use("/api/register/",register)
// app.use("/api/login/",login)

// app.get("/",(req,res) => {
<<<<<<< HEAD
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
=======
>>>>>>> f10bde3804d1f7cb707f1da48015f57890deb5ec
//     res.send("hello")
// });

// // Initialisin port
// port = process.env.PORT || 5000;

// app.listen(port, (req,res) => {
//     console.log("Server is running on port " + port);
// });
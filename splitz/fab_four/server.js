const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");



// Connecting mongoose
mongoose.connect("mongodb+srv://admin:fab_four@cluster0.rhxth.gcp.mongodb.net/fab_four" + database,{ useNewUrlParser: true,useUnifiedTopology: true },() => console.log("MongoDB connected"))
mongoose.set('useFindAndModify', false);

// Router files
const dashboard = require("./router/dashboard");
const register = require("./router/register");
const login = require("./router/login");
// Initialising app
const app = express();

// Setting bodyParser
app.use(bodyParser.urlencoded({extended : true}))

// Parsing JSON
app.use(express.json());

// Initialising router
app.use("/api/dashboard/",dashboard);
// app.use("/api/cart/",cart);
app.use("/api/register/",register)
app.use("/api/login/",login)

app.get("/",(req,res) => {
    res.send("hello")
});

// Initialisin port
port = process.env.PORT || 5000;

app.listen(port, (req,res) => {
    console.log("Server is running on port " + port);
});
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var StudentSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    year: String,
    clubs: { type: Array },
    phone: String
});

StudentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Student", StudentSchema);
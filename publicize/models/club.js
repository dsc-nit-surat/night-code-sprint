var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var ClubSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    description: String,
    phone: String
});

ClubSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Club", ClubSchema);
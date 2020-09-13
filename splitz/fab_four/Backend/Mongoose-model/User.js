const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    name : {
        type: String,
    },
    email : {
        type: String,
    },
    password : {
        type: String,
    },
    date : {
        type : String,
        default : Date.now
    },
    friends : [{
        user_id : {
            type : String,
        },
        date : {
            type : Date,
            default : Date.now
        }
    }],
    transactions : [{
        user_id : {type : String},
        amount : {type : Number},
        type : {type : Number},
        date : {type : Date,default : Date.now}
    }],
    notification : [{
        type : {type : Number},
        content : {type : String},
        date : {type : Date,default : Date.now}
    }]
});

module.exports = User = mongoose.model("User",UserSchema);
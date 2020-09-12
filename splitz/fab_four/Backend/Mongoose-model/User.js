const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  friends: [{
    user_id = {
      type : String
    }
  }],
  transaction: [{
    user_id : {
      type : String,
      required : true
    },
    amount : {
      type : Number,
      required : true
    },
    Date : {
      type : Date,
      default : Date.now
    }
  }]
});

module.exports = User = mongoose.model('user', UserSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone:{
    type:String,
    required:true
  },
  gender:{
    type:String,
    required:true,
  },
  location:{
    type:String,
    required:true
  },
  profile_photo: {
    type: String,
    required:false
  },
  password: {
    type: String,
    required: true
  },
  emailVerificationToken: {
    type: String
  },
  emailVerificationTokenExpiry: {
    type: Date
  }
});

const User = mongoose.model('User', userSchema);

module.exports = {User};
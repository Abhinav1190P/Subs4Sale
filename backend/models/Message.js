const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender:{
    type:String,
    required:true,
  },
  message:{
    type:String
  },
  file:{
    type:String,
    required:false
  },
  roomcode:{
    type:String,
    required:true
  },
  reciever:{
    type:String,
    required:true
  }
},{timestamps:true});

const Message = mongoose.model('Message', messageSchema);

module.exports = {Message};
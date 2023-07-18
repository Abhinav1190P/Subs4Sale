const mongoose = require('mongoose');

const chatRelSchema = new mongoose.Schema({
  user1:{
    type:String,
    required:true
  },
  roomcode:{
    type:String,
    required:true
  },
  user2:{
    type:String,
    required:true
  }

},{timestamps:true});

const ChatRelation = mongoose.model('ChatRelation', chatRelSchema);

module.exports = {ChatRelation};
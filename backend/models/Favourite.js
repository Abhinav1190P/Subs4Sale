const mongoose = require('mongoose');

const favSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  price:{
    type:String,
    required:true,
  },
  user_id:{
    type:String
  },
  ad_id:{
    type:String,
    required:true
  },
  ad_provider:{
    type:String,
    required:true
  }
});

const Favourite = mongoose.model('Favourite', favSchema);

module.exports = {Favourite};
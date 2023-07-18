const mongoose = require('mongoose');

const adsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    maincategory:{
        type:String,
        required:true
    },
    subcategory:{
        type: String,
        required:true
    },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    price_range: {
        type: String,
        required: true
    },
    tags:{
        type:Array,
        required:true
    },
    original_price: {
        type: String,
        required: true
    },
    pictures:{
        type:Array,
        default:[]
    }
},{timestamps:true});
adsSchema.index({ title: 'text', description: 'text', maincategory:'text', subcategory:'text' });

const Ads = mongoose.model('Ads', adsSchema);

module.exports = { Ads };
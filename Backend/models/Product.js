const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    desc:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    img:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model('Product', ProductSchema)
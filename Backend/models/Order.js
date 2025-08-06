const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
   products:[
    {
        _id: {type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true},
        title:{type:String,required:true},
        quantity:{type:Number,required:true},
    }
   ],
   totalPrice:{type:Number,required:true},
   user:{type:mongoose.Schema.Types.ObjectId, ref:'User',required:true},
   createdBy:{type:Date,default:Date.now},

});

module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose');
const product = require('./Product')

const dealSchema = new mongoose.Schema({
    product : {type:mongoose.Schema.Types.ObjectId, ref:'Product'},
    discountPercentage: Number,
    startDate: Date,
    endDate : Date,
});

module.exports = mongoose.model('Deal', dealSchema);


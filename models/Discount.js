const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
    service: { type: String, required: true },
    plan: { type: String, required: true },
    discountPercentage: { type: Number, required: true }
});

module.exports = mongoose.model('Discount', DiscountSchema);

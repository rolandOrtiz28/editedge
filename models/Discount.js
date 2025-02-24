const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
    service: { type: String, required: true },
    plan: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    description: { type: String, default: "" }, // Optional description
    status: { type: String, enum: ['pending', 'active', 'expired'], default: 'pending' }
});

module.exports = mongoose.model('Discount', DiscountSchema);

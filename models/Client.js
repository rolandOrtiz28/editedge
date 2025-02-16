const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    company: { type: String },
    status: { 
        type: String, 
        enum: ['Interested', 'Onboarding', 'Active', 'Closed'], 
        default: 'Interested' 
    },
    projectDetails: [{
        serviceCategory: String, // e.g., Video Production, Web Development
        service: [String], // Specific services selected
        plan: String, // Chosen plan (e.g., Basic, Standard, Monthly Subscription)
        bundle: Boolean, // If the client availed a bundled service
        fileFormat: String, // Required file format (e.g., MP4, PNG, PSD)
        deadline: Date, // Project deadline
        brandGuidelines: {
            brandColors: String,
            typography: String,
            moodboard: String,
            logo: String, // Path to uploaded logo file
            designStyle: String
        },
        revisionsAllowed: Number, // Number of revisions allowed
        reviewDate: String // Date of review (specific date or recurring day)
    }],
    billing: {
        paymentPlan: { type: String, enum: ['Monthly', 'Bi-weekly'], required: true },
        paymentMethod: { type: String, enum: ['Wise', 'PayPal'], required: true },
    },
    contractAttachment: { type: String }, // File path for contract
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);

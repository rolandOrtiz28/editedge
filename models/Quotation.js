const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuotationSchema = new Schema({
    fullName: { type: String, required: true },
    companyName: { type: String },
    emailAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    serviceType: [{ type: String }],
    projectDescription: { type: String, required: true },
    specificRequirements: { type: String },
    estimatedDurationFrom: { type: Date },
    estimatedDurationTo: { type: Date },
    currency: { type: String },
    budget: { type: Number },
    deliverables: [{ type: String }],
    formatSpecifications: { type: String },
    preferredCommunicationMethod: { type: String },
    submissionDate: { type: Date },
    attachmentUrl: { type: String },
    targetArea: { type: String },
    businessTimeLine: { type: Date },
});

module.exports = mongoose.model('Quotation', QuotationSchema);

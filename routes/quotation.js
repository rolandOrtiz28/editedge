const express = require('express');
const router = express.Router();
const { storage } = require('../cloudinary'); // Import Cloudinary storage configuration
const multer = require('multer'); // Import Multer
const Quotation = require('../models/Quotation'); // Import the Quotation model

const upload = multer({ storage }); // Initialize Multer with Cloudinary storage

// Render the quotation form
router.get('/quotation', (req, res) => {
    res.render('quotation/form');
});

// Handle form submission
router.post('/quotation/submit', upload.single('attachment'), async (req, res) => {
    try {
        const {
            fullName,
            companyName,
            emailAddress,
            phoneNumber,
            serviceType,
            projectDescription,
            specificRequirements,
            estimatedDurationFrom,
            estimatedDurationTo,
            currency,
            budget,
            deliverables,
            formatSpecifications,
            preferredCommunicationMethod,
            submissionDate,
        } = req.body;

        // Create a new quotation document
        const newQuotation = new Quotation({
            fullName,
            companyName,
            emailAddress,
            phoneNumber,
            serviceType: Array.isArray(serviceType) ? serviceType : [serviceType],
            projectDescription,
            specificRequirements,
            estimatedDurationFrom,
            estimatedDurationTo,
            currency,
            budget,
            deliverables: Array.isArray(deliverables) ? deliverables : [deliverables],
            formatSpecifications,
            preferredCommunicationMethod,
            submissionDate,
            attachmentUrl: req.file ? req.file.path : null, // Store the Cloudinary URL
        });

        // Save the quotation to the database
        await newQuotation.save();

        req.flash('success', 'Thank you for your request! We’ll get back to you soon.');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/quotation');
    }
});

// Display all quotation requests
router.get('/quotation/requests', async (req, res) => {
    try {
        const quotations = await Quotation.find({});
        res.render('quotation/requests', { quotations });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to fetch quotation requests.');
        res.redirect('/');
    }
});

// Display a specific quotation request by ID
router.get('/quotation/requests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const quotation = await Quotation.findById(id);

        if (!quotation) {
            req.flash('error', 'Quotation not found.');
            return res.redirect('/quotation/requests');
        }

        res.render('quotation/request', { quotation });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to fetch the quotation.');
        res.redirect('/quotation/requests');
    }
});

module.exports = router;

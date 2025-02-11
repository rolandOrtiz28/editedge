const express = require('express');
const router = express.Router();
const { storage } = require('../cloudinary'); // Import Cloudinary storage configuration
const multer = require('multer'); // Import Multer
const Quotation = require('../models/Quotation'); // Import the Quotation model
require('dotenv').config();
const catchAsync = require('../utils/CatchAsync')
const nodemailer = require('nodemailer');


const upload = multer({ storage }); // Initialize Multer with Cloudinary storage

// Render the quotation form
router.get('/quotation', (req, res) => {
    res.render('quotation/form', { currentRoute: '/quotation' });
});

router.post('/quotation/submit', catchAsync(async (req, res) => {
    try {
        const { fullName, companyName, phoneNumber, emailAddress, serviceType, country, projectDescription } = req.body;

        const newQuotation = new Quotation({
            fullName,
            companyName,
            emailAddress,
            serviceType: Array.isArray(serviceType) ? serviceType : [serviceType],
            country,
            phoneNumber,
            projectDescription
        });

        await newQuotation.save();

        // Send email notification
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `${emailAddress}`,
            to: process.env.GMAIL_EMAIL,
            subject: `New Quotation Request from ${fullName}`,
            html: `
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Company Name:</strong> ${companyName || 'N/A'}</p>
                <p><strong>Email:</strong> ${emailAddress}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber || 'N/A'}</p>
                <p><strong>Country:</strong> ${country}</p>
                <p><strong>Service Type:</strong> ${Array.isArray(serviceType) ? serviceType.join(', ') : serviceType}</p>
                <p><strong>Project Description:</strong></p>
                <p>${projectDescription}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        req.flash('success', 'Thank you for your request! We’ll get back to you soon.');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/quotation');
    }
}));






router.get('/pricing-form', (req, res) => {
    const { service, plan, special } = req.query;
    res.render('Pricing/pricingForm', { 
        currentRoute: '/pricing-form',
        selectedService: service || '',
        selectedPlan: plan || '',
        isSpecialOffer: special === "true" // Convert string to boolean
    });
});


// Handle form submission (modify as needed)
// router.post('/pricing-form/submit', async (req, res) => {
//     try {
//         const { fullName, emailAddress, serviceType, selectedPlan, phoneNumber, country,projectDescription } = req.body;

//         console.log(`User selected: ${selectedPlan} for ${serviceType}`);

//         req.flash('success', 'Your package selection has been submitted successfully!');
//         res.redirect('/');
//     } catch (error) {
//         console.error(error);
//         req.flash('error', 'Something went wrong. Please try again.');
//         res.redirect('/pricing-form');
//     }
// });

router.post('/pricing-form/submit', async (req, res) => {
    try {
        const { fullName, emailAddress, serviceType, selectedPlan, phoneNumber, country, projectDescription, isSpecialOffer } = req.body;

        // Send email notification
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `${emailAddress}`,
            to: process.env.GMAIL_EMAIL,
            subject: `New Package Selection from ${fullName}`,
            html: `
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${emailAddress}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber || 'N/A'}</p>
                <p><strong>Country:</strong> ${country}</p>
                <p><strong>Selected Service:</strong> ${serviceType}</p>
                <p><strong>Selected Plan:</strong> ${selectedPlan}</p>
                <p><strong>Project Description:</strong></p>
                <p>${projectDescription || 'N/A'}</p>
                ${isSpecialOffer ? "<p><strong>Special Offer Applied!</strong></p>" : ""}
            `
        };

        await transporter.sendMail(mailOptions);

        req.flash('success', 'Your package selection has been submitted successfully!');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/pricing-form');
    }
});

module.exports = router;

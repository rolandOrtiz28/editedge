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

router.post('/quotation/web-development', catchAsync(async (req, res) => {
    try {
        const { fullName, emailAddress, phoneNumber, projectDescription, captchaAnswer, captchaCorrectAnswer } = req.body;
        const serviceType = "Web Development";  // Automatically set service type

        // CAPTCHA Validation
        if (parseInt(captchaAnswer) !== parseInt(captchaCorrectAnswer)) {
            req.flash('error', 'Incorrect CAPTCHA answer. Please try again.');
            return res.redirect('/web-development');
        }

        const newQuotation = new Quotation({
            fullName,
            emailAddress,
            phoneNumber,
            serviceType,
            projectDescription
        });

        await newQuotation.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        // Send email notification
        const mailOptions = {
            from: `${emailAddress}`,
            to: process.env.GMAIL_EMAIL,
            subject: `Web Development Quote Request from ${fullName}`,
            html: `
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${emailAddress}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                <p><strong>Service Type:</strong> ${serviceType}</p>
                <p><strong>Project Description:</strong></p>
                <p>${projectDescription}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        req.flash('success', 'Thank you for your request! We’ll get back to you soon.');
        res.redirect('/web-development');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/web-development');
    }
}));

router.post('/quotation/video-editing', catchAsync(async (req, res) => {
    try {
        const { fullName, emailAddress, phoneNumber, projectDescription, captchaAnswer, captchaCorrectAnswer } = req.body;
        const serviceType = "Video Editing";  // Automatically set service type

        // CAPTCHA Validation
        if (parseInt(captchaAnswer) !== parseInt(captchaCorrectAnswer)) {
            req.flash('error', 'Incorrect CAPTCHA answer. Please try again.');
            return res.redirect('/Video-Editing');
        }

        const newQuotation = new Quotation({
            fullName,
            emailAddress,
            phoneNumber,
            serviceType,
            projectDescription
        });

        await newQuotation.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        // Send email notification
        const mailOptions = {
            from: `${emailAddress}`,
            to: process.env.GMAIL_EMAIL,
            subject: `Web Development Quote Request from ${fullName}`,
            html: `
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${emailAddress}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                <p><strong>Service Type:</strong> ${serviceType}</p>
                <p><strong>Project Description:</strong></p>
                <p>${projectDescription}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        req.flash('success', 'Thank you for your request! We’ll get back to you soon.');
        res.redirect('/Video-Editing');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/Video-Editing');
    }
}));


router.post('/quotation/graphic-design', catchAsync(async (req, res) => {
    try {
        const { fullName, emailAddress, phoneNumber, projectDescription, captchaAnswer, captchaCorrectAnswer } = req.body;
        const serviceType = "Graphic Design";  // Automatically set service type

        // CAPTCHA Validation
        if (parseInt(captchaAnswer) !== parseInt(captchaCorrectAnswer)) {
            req.flash('error', 'Incorrect CAPTCHA answer. Please try again.');
            return res.redirect('/Graphic-Design');
        }

        const newQuotation = new Quotation({
            fullName,
            emailAddress,
            phoneNumber,
            serviceType,
            projectDescription
        });

        await newQuotation.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        // Send email notification
        const mailOptions = {
            from: `${emailAddress}`,
            to: process.env.GMAIL_EMAIL,
            subject: `Graphic Design Quote Request from ${fullName}`,
            html: `
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${emailAddress}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                <p><strong>Service Type:</strong> ${serviceType}</p>
                <p><strong>Project Description:</strong></p>
                <p>${projectDescription}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        req.flash('success', 'Thank you for your request! We’ll get back to you soon.');
        res.redirect('/Graphic-Design');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/Graphic-Design');
    }
}));


router.post('/quotation/degital-marketing', catchAsync(async (req, res) => {
    try {
        const { fullName, emailAddress, phoneNumber, projectDescription, captchaAnswer, captchaCorrectAnswer } = req.body;
        const serviceType = "Degital Marketing";  // Automatically set service type

        // CAPTCHA Validation
        if (parseInt(captchaAnswer) !== parseInt(captchaCorrectAnswer)) {
            req.flash('error', 'Incorrect CAPTCHA answer. Please try again.');
            return res.redirect('/Digital-Marketing');
        }

        const newQuotation = new Quotation({
            fullName,
            emailAddress,
            phoneNumber,
            serviceType,
            projectDescription
        });

        await newQuotation.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        // Send email notification
        const mailOptions = {
            from: `${emailAddress}`,
            to: process.env.GMAIL_EMAIL,
            subject: `Degital Marketing Quote Request from ${fullName}`,
            html: `
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${emailAddress}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                <p><strong>Service Type:</strong> ${serviceType}</p>
                <p><strong>Project Description:</strong></p>
                <p>${projectDescription}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        req.flash('success', 'Thank you for your request! We’ll get back to you soon.');
        res.redirect('/Digital-Marketing');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/Digital-Marketing');
    }
}));


router.post('/quotation/3d-art', catchAsync(async (req, res) => {
    try {
        const { fullName, emailAddress, phoneNumber, projectDescription, captchaAnswer, captchaCorrectAnswer } = req.body;
        const serviceType = "3D Art";  // Automatically set service type

        // CAPTCHA Validation
        if (parseInt(captchaAnswer) !== parseInt(captchaCorrectAnswer)) {
            req.flash('error', 'Incorrect CAPTCHA answer. Please try again.');
            return res.redirect('/3dart');
        }

        const newQuotation = new Quotation({
            fullName,
            emailAddress,
            phoneNumber,
            serviceType,
            projectDescription
        });

        await newQuotation.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        // Send email notification
        const mailOptions = {
            from: `${emailAddress}`,
            to: process.env.GMAIL_EMAIL,
            subject: `3D Art Quote Request from ${fullName}`,
            html: `
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${emailAddress}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                <p><strong>Service Type:</strong> ${serviceType}</p>
                <p><strong>Project Description:</strong></p>
                <p>${projectDescription}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        req.flash('success', 'Thank you for your request! We’ll get back to you soon.');
        res.redirect('/3dart');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/3dart');
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

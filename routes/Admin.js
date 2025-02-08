const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog'); // Ensure the correct path to your Blog model
const catchAsync = require('../utils/CatchAsync'); // Ensure you have this utility
const Discount = require('../models/Discount');


// Routes
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard', { currentRoute: '/dashboard' });
});

router.get('/cms', catchAsync(async (req, res) => {
    const blogs = await Blog.find({}, 'title slug status views'); // Fetch only necessary fields
    const publishedCount = await Blog.countDocuments({ status: 'published' });
    const draftCount = await Blog.countDocuments({ status: 'draft' });

    res.render('admin/cms', {
        blogs,
        publishedCount,
        draftCount,
        currentRoute: 'cms'
    });
}));



router.get('/crm', (req, res) => {
    res.render('admin/crm', { currentRoute: '/crm' }); // Create a crm.ejs template
});


// GET Discounts Management Page
router.get('/discounts', catchAsync(async (req, res) => {
    const discounts = await Discount.find({}); // Fetch all discounts

    console.log("📌 Discounts Retrieved:", discounts); // Debugging output

    res.render('admin/discounts', { discounts, currentRoute: '/discounts' });
}));

// POST Add Discount
router.post('/add-discount', catchAsync(async (req, res) => {
    const { service, plan, discountPercentage } = req.body;

    let discount = await Discount.findOne({ service, plan });

    if (discount) {
        discount.discountPercentage = discountPercentage;
        discount.status = "pending"; // Set status when updating
        await discount.save();
    } else {
        discount = new Discount({ service, plan, discountPercentage, status: "pending" }); // New discount starts as "pending"
        await discount.save();
    }

    res.redirect('/admin/discounts');
}));


// DELETE Discount
router.post('/delete-discount', catchAsync(async (req, res) => {
    const { id } = req.body;
    await Discount.findByIdAndDelete(id);
    res.redirect('/admin/discounts');
}));


router.get('/get-plans', catchAsync(async (req, res) => {
    const { service } = req.query;
    let plans = [];

    console.log("📌 Received request for plans. Service:", service);

    if (!service) {
        return res.status(400).json({ error: "Service parameter is required" });
    }

    const availablePlans = {
        "video-editing": [
            'Basic Package', 'Standard Package', 'Premium Package',
            'Short-form Monthly Subscription', 'Long-form Monthly Subscription', 'Ultimate Video Editing Subscription'
        ],
        "web-dev": ['Starter Plan', 'Growth Plan', 'Pro Plan'],
        "graphic-design": ['Basic Plan', 'Standard Plan', 'Premium Plan', 'Monthly Subscription', 'Elite Branding Subscription'],
        "3d-art": ['Simple Package', 'Detailed Package', 'High-End Package', '3D Monthly Subscription', 'Advanced 3D Monthly Subscription'],
        "digital-marketing": ['Starter Marketing Plan', 'Growth Marketing Plan', 'Enterprise Marketing Plan']
    };

    plans = availablePlans[service];

    if (!plans) {
        console.log("❌ No plans found for service:", service);
        return res.status(404).json({ error: "No plans available for this service." });
    }

    console.log("✅ Returning plans:", plans);
    res.json(plans);
}));

module.exports = router;
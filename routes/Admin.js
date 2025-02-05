const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog'); // Ensure the correct path to your Blog model
const catchAsync = require('../utils/CatchAsync'); // Ensure you have this utility

// Routes
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard', { currentRoute: '/dashboard' });
});

router.get('/cms', catchAsync(async (req, res) => {
    const blogs = await Blog.find({});
    const publishedCount = await Blog.countDocuments({ status: 'published' });
    const draftCount = await Blog.countDocuments({ status: 'draft' });

    const topBlogs = await Blog.find({ status: 'published' }).sort({ views: -1 }).limit(5);

    res.render('admin/cms', {
        blogs,
        publishedCount,
        draftCount,
        topBlogs: JSON.stringify(topBlogs),
        currentRoute: 'cms'
    });
}));



router.get('/crm', (req, res) => {
    res.render('admin/crm', { currentRoute: '/crm' }); // Create a crm.ejs template
});



module.exports = router;
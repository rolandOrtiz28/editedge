const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog'); 
const catchAsync = require('../utils/CatchAsync');
const Discount = require('../models/Discount');

// ✅ Middleware to Protect Admin Routes
function requireSecurityCode(req, res, next) {
    if (req.session.isAdminAuthenticated) {
        return next(); // ✅ Allow access if authenticated
    } else {
        return res.redirect('/admin/login'); // 🔒 Redirect if not authenticated
    }
}

// ✅ Admin Login Route (Public)
router.get('/login', (req, res) => {
    res.render('admin/login', { error: null,currentRoute: '/login'  });
});

// ✅ Process Login
router.post('/login', (req, res) => {
    const { securityCode } = req.body;
    const ADMIN_SECURITY_CODE = process.env.passkey; 

    if (securityCode === ADMIN_SECURITY_CODE) {
        req.session.isAdminAuthenticated = true; // ✅ Grant Access
        return res.redirect('/admin/dashboard');
    } else {
        return res.render('admin/login', { error: "Invalid security code. Please try again."});
    }
});

// ✅ Apply Middleware to Protect These Routes
router.get('/dashboard', requireSecurityCode, (req, res) => {
    res.render('admin/dashboard', { currentRoute: '/dashboard' });
});

router.get('/cms', requireSecurityCode, catchAsync(async (req, res) => {
    const blogs = await Blog.find({}, 'title slug status views'); 
    const publishedCount = await Blog.countDocuments({ status: 'published' });
    const draftCount = await Blog.countDocuments({ status: 'draft' });

    res.render('admin/cms', {
        blogs,
        publishedCount,
        draftCount,
        currentRoute: 'cms'
    });
}));

router.get('/crm', requireSecurityCode, (req, res) => {
    res.render('admin/crm', { currentRoute: '/crm' }); 
});

// ✅ Protect Discounts Page
router.get('/discounts', requireSecurityCode, catchAsync(async (req, res) => {
    const discounts = await Discount.find({});
    res.render('admin/discounts', { discounts, currentRoute: '/discounts' });
}));

// ✅ Protect Discounts Management
router.post('/add-discount', requireSecurityCode, catchAsync(async (req, res) => {
    const { service, plan, discountPercentage } = req.body;
    let discount = await Discount.findOne({ service, plan });

    if (discount) {
        discount.discountPercentage = discountPercentage;
        discount.status = "pending";
        await discount.save();
    } else {
        discount = new Discount({ service, plan, discountPercentage, status: "pending" });
        await discount.save();
    }
    res.redirect('/admin/discounts');
}));

// ✅ Protect Deleting Discounts
router.post('/delete-discount', requireSecurityCode, catchAsync(async (req, res) => {
    const { id } = req.body;
    await Discount.findByIdAndDelete(id);
    res.redirect('/admin/discounts');
}));

// ✅ Admin Logout
router.get('/logout', (req, res) => {
    req.session.destroy(); // Destroy session
    res.redirect('/admin/login');
});

module.exports = router;

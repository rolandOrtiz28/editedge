const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog'); 
const catchAsync = require('../utils/CatchAsync');
const Discount = require('../models/Discount');
const Subscriber = require('../models/Subscriber');
const Quotation = require('../models/Quotation');
const User = require('../models/user');
const passport = require('passport')
const Client = require('../models/Client');
const uploadContract = require('../cloudinary/contractStorage');
const { isLoggedIn } = require('../middleware')


router.get('/dashboard',  isLoggedIn,(req, res) => {
    res.render('admin/dashboard', { currentRoute: '/dashboard' });
});


router.get('/cms',  isLoggedIn,catchAsync(async (req, res) => {
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

router.get('/subscribers', catchAsync(async (req, res) => {
    const subscribers = await Subscriber.find({});
    res.render('admin/subscriber', { subscribers, currentRoute: '/subscribers' });
}));

// Display all quotation requests
router.get('/quotation/requests', async (req, res) => {
    try {
        const quotations = await Quotation.find({});
        res.render('quotation/requests', { quotations, currentRoute: '/quotation/requests' });
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

        res.render('quotation/request', { quotation, currentRoute: '/quotation/requests' });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to fetch the quotation.');
        res.redirect('/quotation/requests');
    }
});


router.get('/crm',  isLoggedIn,(req, res) => {
    res.render('admin/crm', { currentRoute: '/crm' }); 
});

// ✅ Protect Discounts Page
router.get('/discounts',  isLoggedIn,catchAsync(async (req, res) => {
    const discounts = await Discount.find({});
    res.render('admin/discounts', { discounts, currentRoute: '/discounts' });
}));

// ✅ Protect Discounts Management
router.post('/add-discount',  catchAsync(async (req, res) => {
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
router.post('/delete-discount',  catchAsync(async (req, res) => {
    const { id } = req.body;
    await Discount.findByIdAndDelete(id);
    res.redirect('/admin/discounts');
}));


router.delete('/delete-subscriber', catchAsync(async (req, res) => {
    const { id } = req.body;
    await Subscriber.findByIdAndDelete(id);
    res.redirect('/admin/subscribers');
}));

router.delete('/delete-request', catchAsync(async (req, res) => {
    const { id } = req.body;
    await Quotation.findByIdAndDelete(id);
    res.redirect('/admin/quotation/requests');
}));


// AUTHENTICATION
router.get('/register', (req, res) => {
    res.render('admin/register',{ currentRoute: '/register' })
})



router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            req.flash('error', 'Password must contain at least one uppercase letter, one digit, and be at least 8 characters long');
            res.redirect('/admin/register');
            return;
        }

        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', `Welcome ${username}`)
        res.redirect('/admin/dashboard');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/admin/register');
    }
}));


router.get('/login', (req, res) => {
    res.render('admin/login',{ currentRoute: '/login' })
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/admin/login', keepSessionInfo: true }), (req, res) => {
    req.flash('success', "logged in")
    res.redirect('/admin/dashboard')
})

// forget password
router.get('/forgot-password', (req, res) => {
    res.render('admin/forgot-password');
});

router.post('/forgot-password', catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const registeredUser = await User.findOne({ email });
    if (!registeredUser) {
        req.flash('error', 'User not registered');
        res.redirect('/admin/forgot-password');
        return;
    }

    const secret = process.env.JWT_PASS + registeredUser.password;
    const payload = {
        email: registeredUser.email,
        id: registeredUser._id.toString(),
    };
    const token = jwt.sign(payload, secret, { expiresIn: '15m' });
    const resetPasswordLink = `http://${req.headers.host}/reset-password/${registeredUser._id}/${token}`;

    const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: registeredUser.email,
        subject: 'Password Reset',
        text: `You are receiving this email because you (or someone else) have requested a password reset for your account.
  Please click on the following link, or paste this into your browser to complete the process:
  ${resetPasswordLink}
  If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    console.log('Sending email to: ', registeredUser.email);

    smtpTransport.sendMail(mailOptions, (err, info) => {
        if (err) {
            req.flash('error', `An error occurred while sending the password reset email: ${err.message}`);
            console.error('Error sending email: ', err);
            return next(err);
        }
    });

    req.flash('success', 'An email has been sent to your registered email address with instructions on how to reset your password.');
    res.redirect('/admin/forgot-password');
}));

// reset password
router.get('/reset-password/:id/:token', catchAsync(async (req, res) => {
    const { id, token } = req.params;

    const user = await User.findById(id);
    if (!user) {
        req.flash('error', 'Invalid ID');
        res.redirect('/admin/forgot-password');
        return;
    }

    const secret = process.env.JWT_PASS + user.password;
    try {
        const payload = await jwt.verify(token, secret);
        res.render('admin/reset-password', { email: user.email, id, token });
    } catch (error) {
        console.log(error.message);
        req.flash('error', 'Something went wrong');
        res.redirect('/admin/forgot-password');
    }
}));

router.post('/reset-password/:id/:token', catchAsync(async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const user = await User.findById(id);
    if (!user) {
        req.flash('error', 'Invalid ID');
        res.redirect('/admin/forgot-password');
        return;
    }

    const secret = process.env.JWT_PASS + user.password;
    try {
        const payload = await jwt.verify(token, secret);
        await user.setPassword(password);
        await user.save();
        req.flash('success', 'Your password has been successfully reset.');
        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
        req.flash('error', 'Something went wrong');
        res.redirect('/admin/forgot-password');
    }
}));

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/admin/login');
    });
})

// ✅ Define the plans object inside Admin.js (Backend)
const plans = {
    "Video Production": ["Basic Package", "Standard Package", "Premium Package", "Short-form Monthly Subscription", "Long-form Monthly Subscription", "Ultimate Video Editing Subscription"],
    "Graphic Design": ["Basic Plan", "Standard Plan", "Premium Plan", "Monthly Subscription", "Elite Branding Subscription"],
    "3D Visualization": ["Simple Package", "Detailed Package", "High-End Package", "3D Monthly Subscription", "Advanced 3D Monthly Subscription"],
    "Web Development": ["Starter Plan", "Growth Plan", "Pro Plan"],
    "Digital Marketing": ["SEO Optimization", "Social Media Marketing", "Email Marketing", "Market Research", "Branding"]
};



// Clients
router.post('/clients/new', isLoggedIn, uploadContract.single('contractAttachment'), catchAsync(async (req, res) => {
    const { name, email, phone, company, status, deadline, fileFormat, brandColors, typography, moodboard, designStyle, revisionsAllowed, reviewDate, paymentPlan, paymentMethod } = req.body;

    const projectDetails = [];
    for (const category of Object.keys(plans)) {
        if (req.body[`plan-${category}`]) {
            projectDetails.push({
                serviceCategory: category,
                plan: req.body[`plan-${category}`],
                bundle: req.body[`bundle-${category}`] === "on",
                fileFormat,
                deadline,
                brandGuidelines: { brandColors, typography, moodboard, designStyle },
                revisionsAllowed,
                reviewDate
            });
        }
    }

    const client = new Client({
        name, email, phone, company, status,
        projectDetails,
        billing: { paymentPlan, paymentMethod },
        contractAttachment: req.file ? req.file.path : null // ✅ Store Cloudinary URL
    });

    await client.save();
    req.flash('success', 'Client added successfully!');
    res.redirect(`/admin/client/${client._id}`);

}));

router.get('/clients-form', isLoggedIn, catchAsync(async (req, res) => {
    
    res.render('admin/clientnew', { currentRoute: '/clients' });
}));

router.get('/clients', isLoggedIn, catchAsync(async (req, res) => {
    const clients = await Client.find({});
    res.render('admin/clients', { clients, currentRoute: '/clients' });
}));

// 🟢 3. View Client Profile
router.get('/clients/:id', isLoggedIn, catchAsync(async (req, res) => {
    const client = await Client.findById(req.params.id);
    if (!client) {
        req.flash('error', 'Client not found.');
        return res.redirect('/admin/clients');
    }
    res.render('admin/clientshow', { client, currentRoute: '/clients' });
}));


// 🟢 4. Update Client
// router.put('/clients/:id', isLoggedIn, upload.single('contractAttachment'), catchAsync(async (req, res) => {
//     const { name, email, phone, company, status, projectDetails, paymentPlan, paymentMethod } = req.body;
//     const updatedClient = await Client.findByIdAndUpdate(req.params.id, {
//         name, email, phone, company, status,
//         projectDetails: JSON.parse(projectDetails),
//         billing: { paymentPlan, paymentMethod },
//         contractAttachment: req.file ? req.file.path : req.body.existingContract // Keep old file if no new one is uploaded
//     }, { new: true });

//     req.flash('success', 'Client updated successfully!');
//     res.redirect(`/admin/clients/${updatedClient._id}`);
// }));

// 🟢 5. Delete Client
router.delete('/delete/clients/:id', isLoggedIn, catchAsync(async (req, res) => {
    await Client.findByIdAndDelete(req.params.id);
    req.flash('success', 'Client deleted successfully!');
    res.redirect('/admin/clients');
}));

module.exports = router;

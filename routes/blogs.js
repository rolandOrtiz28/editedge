const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage, cloudinary } = require('../cloudinary');
const upload = multer({ storage });
const Blog = require('../models/Blog');
const catchAsync = require('../utils/CatchAsync');

// Show all blogs
// router.get('/blogs', catchAsync(async (req, res) => {
//     const blogs = await Blog.find({});
//     res.render('blogs/index', { blogs });
// }));
router.get('/blogs', (req, res) => {
    res.render('blogs/index', { currentRoute: '/blogs' });
});


router.get('/blogs/blog1', (req, res) => {
    res.render('blogs/blog/blog1', { currentRoute: '/blogs/blog1' });
});

router.get('/blogs/blog2', (req, res) => {
    res.render('blogs/blog/blog2',{ currentRoute: '/blogs/blog2' });
});

router.get('/blogs/blog3', (req, res) => {
    res.render('blogs/blog/blog3',{ currentRoute: '/blogs/blog3' });
});


// Show the new blog editor
router.get('/blogs/new', (req, res) => {
    res.render('blogs/new', { currentRoute: '/blogs/new' });
});

// Handle blog creation
router.post('/blogs', upload.single('image'), catchAsync(async (req, res) => {
    const { title, content, template, headerType } = req.body;
    const image = req.file ? { url: req.file.path, filename: req.file.filename } : null;

    const blog = new Blog({
        title,
        content,
        template,
        headerType,
        image: image ? image.url : null,
    });
    await blog.save();

    req.flash('success', 'Blog created successfully!');
    res.redirect(`/blogs/${blog._id}`);
}));

// Show a specific blog
// router.get('/blogs/:id', catchAsync(async (req, res) => {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) {
//         req.flash('error', 'Blog not found!');
//         return res.redirect('/blogs');
//     }
//     res.render('blogs/show', { blog });
// }));

// Form for editing a blog
router.get('/blogs/:id/edit', catchAsync(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        req.flash('error', 'Blog not found!');
        return res.redirect('/blogs');
    }
    res.render('blogs/edit', { blog });
}));

// Update a blog
router.put('/blogs/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, content, image } = req.body;
    await Blog.findByIdAndUpdate(id, { title, content, image });
    req.flash('success', 'Blog updated successfully!');
    res.redirect(`/blogs/${id}`);
}));

// Delete a blog
router.delete('/blogs/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    req.flash('success', 'Blog deleted successfully!');
    res.redirect('/blogs');
}));

module.exports = router;

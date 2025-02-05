const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const Blog = require('../models/Blog');
const catchAsync = require('../utils/CatchAsync');
const slugify = require('slugify');

// Get all blogs
router.get('/blogs', catchAsync(async (req, res) => {
    const blogs = await Blog.find({});
    res.render('blogs/index', { blogs, currentRoute: '/blogs' });
}));

// Create a new blog (GET Form)
router.get('/blogs/new', (req, res) => {
    res.render('blogs/new', { currentRoute: '/blogs/new' });
});

// ✅ Create a New Blog (Now Supports Image Upload)
router.post(
    "/blogs",
    upload.single("image"), 
    express.json(),
    catchAsync(async (req, res) => {
      const { title, content, metaDescription, headerType, tags, status } = req.body;
      const slug = slugify(title, { lower: true });
  
  
      let imageUrl = req.file ? req.file.path : null;
  
      const blog = new Blog({
        title,
        slug,
        content,
        metaDescription,
        headerType,
        image: imageUrl,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        status,
      });
  
      await blog.save();
  
      res.json({
        success: true,
        message: `Blog ${status === "draft" ? "saved as draft" : "published"} successfully!`,
        slug: blog.slug,
        image: imageUrl, 
      });
    })
  );

router.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ url: req.file.path }); 
});

// autosave
router.post('/blogs/autosave', catchAsync(async (req, res) => {
    const { title, content, metaDescription, tags, status } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and content required" });

    let blog = await Blog.findOne({ title });

    if (blog) {
        blog.content = content;
        blog.metaDescription = metaDescription;
        blog.tags = tags ? tags.split(',').map(tag => tag.trim()) : [];
        blog.status = "draft";
        await blog.save();
    } else {
        blog = new Blog({
            title,
            slug: slugify(title, { lower: true }),
            content,
            metaDescription,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            status: "draft"
        });
        await blog.save();
    }

    res.json({ message: "Draft saved", blogId: blog._id });
}));

router.get('/blogposts', catchAsync(async (req, res) => {
    const blogs = await Blog.find({});
    res.render('blogs/index', { blogs, currentRoute: '/blogposts' });
}));


// Show a specific blog post and increment view count
router.get('/blogs/:slug', catchAsync(async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
        req.flash('error', 'Blog not found');
        return res.redirect('/blogs');
    }

   
    blog.views += 1;
    await blog.save();  

    res.render('blogs/show', { blog, currentRoute: `/blogs/${blog.slug}` });
}));

// Edit Blog (GET Form)
router.get('/blogs/:slug/edit', catchAsync(async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
        req.flash('error', 'Blog not found');
        return res.redirect('/blogs');
    }

    res.render('blogs/edit', { blog, currentRoute: `/blogs/${blog.slug}/edit` });
}));

// Update Blog (PUT)
router.put('/blogs/:slug', upload.single('image'), catchAsync(async (req, res) => {
    const { title, content, metaDescription, headerType, tags, status } = req.body;
    const slug = slugify(title, { lower: true });
    
    // ✅ Find the existing blog
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
        req.flash('error', 'Blog not found');
        return res.redirect('/blogs');
    }

    // ✅ Update blog details
    blog.title = title;
    blog.slug = slug;
    blog.content = content;
    blog.metaDescription = metaDescription;
    blog.headerType = headerType;
    blog.tags = tags.split(',').map(tag => tag.trim());
    blog.status = status;

    // ✅ Handle new image upload (if a new one is provided)
    if (req.file) {
        blog.image = req.file.path; // Store new image in database
    }

    await blog.save();

    req.flash('success', 'Blog updated successfully!');
    res.json({ success: true, slug: blog.slug }); // ✅ Redirect to updated blog
}));


// Delete Blog
router.delete('/blogs/:slug', catchAsync(async (req, res) => {
    await Blog.findOneAndDelete({ slug: req.params.slug });
    
    // Check if it's from CMS
    if (req.headers.referer && req.headers.referer.includes('/cms')) {
        return res.redirect('/cms'); // Redirect back to CMS
    }

    res.redirect('/blogs'); // Default redirect to blogs list
}));

module.exports = router;

const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    titleTag: { type: String, required: true }, // ✅ NEW: Title tag for SEO
    slug: { type: String, unique: true, required: true }, // ✅ Ensure slug is always required
    content: { type: String, required: true },
    metaDescription: { type: String },
    tags: [String],
    image: { type: String }, // ✅ Cover image URL
    imageLink: { type: String, default: "" }, // ✅ NEW: Clickable cover image link
    headerType: { type: String, enum: ["image", "video"], default: "image" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 }
});

module.exports = mongoose.model("Blog", blogSchema);

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    template: {
        type: String,
        enum: ['Default', 'Minimalist', 'Modern'], // Add more templates as needed
        default: 'Default',
    },
    headerType: {
        type: String,
        enum: ['H1', 'H2', 'H3'],
        default: 'H1',
    },
    image: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Blog', blogSchema);

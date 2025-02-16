const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// ✅ Cloudinary Storage for Contracts (PDFs, DOCX, etc.)
const contractStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'EditEdgeContracts', // Folder for contract files
        allowed_formats: ['pdf', 'docx', 'doc'], // Allow document formats
        public_id: (req, file) => `contract-${Date.now()}` // Unique naming
    }
});

// ✅ Multer Middleware for Contract Uploads
const uploadContract = multer({ storage: contractStorage });

module.exports = uploadContract;

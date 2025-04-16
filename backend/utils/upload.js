const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ErrorHandler = require('./ErrorHandler');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
console.log(`uploadDir: ${uploadDir}`);
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// File filter to only accept specific image types


// Limiting the file size (max 5MB)
const limits = {
    fileSize: 5 * 1024 * 1024 // 5MB max size
};

// Create and export the multer upload middleware
const upload = multer({
    storage,
    limits, // Apply the file size limit
});

module.exports = upload;

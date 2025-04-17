const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ErrorHandler = require('./ErrorHandler');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set the destination to the uploads folder

    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// Limiting the file size (max 5MB)
const limits = {
    fileSize: 5 * 1024 * 1024 // 5MB max size
};

// Create and export the multer upload middleware
const upload = multer({
    storage,
    limits,
});

module.exports = upload;

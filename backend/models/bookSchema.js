const mongoose = require('mongoose');

// Book Schema
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number']
    },
    releaseDate: {
        type: Date,
        required: [true, 'Release date is required'],
        validate: {
            validator: function (v) {
                return v <= Date.now(); // Check if the release date is not in the future
            },
            message: 'Release date cannot be in the future'
        }
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: null
    },
    imageFileId: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);

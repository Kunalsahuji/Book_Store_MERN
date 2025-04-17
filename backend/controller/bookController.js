const Book = require('../models/bookSchema');
const ErrorHandler = require('../utils/ErrorHandler');
const { catchAsyncErrors } = require('../middleware/catchAsyncErrors');
const fs = require('fs');
const path = require('path');
// Create a new book
exports.createBook = catchAsyncErrors(async (req, res, next) => {
    const { title, author, price, releaseDate, description } = req.body;
    const image = req.file ? req.file.path : null;
    // Manual Validation
    if (!title || !author || !price || !releaseDate || !description) {
        return next(new ErrorHandler('All fields are required', 400));
    }

    // Ensure price is a valid number
    if (isNaN(price) || price <= 0) {
        return next(new ErrorHandler('Price should be a positive number', 400));
    }

    // Ensure releaseDate is a valid date
    const validDate = Date.parse(releaseDate);
    if (isNaN(validDate)) {
        return next(new ErrorHandler('Invalid release date', 400));
    }

    const book = new Book({
        title,
        author,
        price,
        releaseDate,
        description,
        image
    });

    await book.save();

    res.status(201).json({
        message: 'Book created successfully',
        book
    });
});

// Get all books with optional search
exports.getBook = catchAsyncErrors(async (req, res, next) => {
    const { search } = req.query;
    let query = {};

    if (search) {
        query = {
            $or: [
                { title: new RegExp(search, 'i') },
                { author: new RegExp(search, 'i') }
            ]
        };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    res.status(200).json({
        total: books.length,
        books
    });
});

// Get a single book by ID
exports.getBookById = catchAsyncErrors(async (req, res, next) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        return next(new ErrorHandler('Book not found', 404));
    }

    res.status(200).json(book);
});

// Update a book
exports.updateBook = catchAsyncErrors(async (req, res, next) => {
    const { title, author, price, releaseDate, description } = req.body;
    const image = req.file ? req.file.path : null;

    // Manual Validation
    if (!title || !author || !price || !releaseDate || !description) {
        return next(new ErrorHandler('All fields are required', 400));
    }

    if (isNaN(price) || price <= 0) {
        return next(new ErrorHandler('Price should be a positive number', 400));
    }

    const validDate = Date.parse(releaseDate);
    if (isNaN(validDate)) {
        return next(new ErrorHandler('Invalid release date', 400));
    }
    // Find existing book
    const book = await Book.findById(req.params.id);
    if (!book) {
        return next(new ErrorHandler('Book not found', 404));
    }
    // Delete old image if a new one is uploaded
    if (image && book.image) {
        const oldImagePath = path.join(__dirname, "..", book.image);
        fs.unlink(oldImagePath, (err) => {
            if (err) {
                console.error("Failed to delete old image:", err);
            } else {
                console.log("Old image deleted:", oldImagePath);
            }
        })
    }
    // Update book details
    book.title = title;
    book.author = author;
    book.price = price;
    book.releaseDate = releaseDate;
    book.description = description;
    if (image) {
        book.image = image;
    }
    await book.save();

    res.status(200).json({
        message: 'Book updated successfully',
        book
    });
});

// Delete a book
exports.deleteBook = catchAsyncErrors(async (req, res, next) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        return next(new ErrorHandler('Book not found', 404));
    }
    if (book.image) {
        const imagePath = path.join(__dirname, "..", book.image);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Failed to delete image:", err);
            } else {
                console.log("Image deleted:", imagePath);
            }
        });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({
        message: 'Book deleted successfully'
    });
});

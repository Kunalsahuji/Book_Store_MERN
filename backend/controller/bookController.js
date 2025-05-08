const Book = require('../models/bookSchema');
const ErrorHandler = require('../utils/ErrorHandler');
const { catchAsyncErrors } = require('../middleware/catchAsyncErrors');
const fs = require('fs');
const path = require('path');
const imagekitInstance = require('../config/imagekit');
// Create a new book
exports.createBook = catchAsyncErrors(async (req, res, next) => {
    const { title, author, price, releaseDate, description } = req.body;
    // Manual Validation
    if (!title || !author || !price || !releaseDate || !description || !req.file) {
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
    // Upload image to ImageKit
    const fileBuffer = req.file.buffer;
    const uploadRespnse = await imagekitInstance.upload({
        file: fileBuffer,

        fileName: `${Date.now()}_${req.file.originalname}`,
        folder: 'books',
    })

    const book = new Book({
        title,
        author,
        price,
        releaseDate,
        description,
        image: uploadRespnse.url,
        imageFileId: uploadRespnse.fileId // ✅ Store fileId

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
    try {
        const { title, author, price, releaseDate, description } = req.body;
        // const image = req.file ? req.file.path : null;

        // Manual Validation
        if (!title || !author || !price || !releaseDate || !description, !req.file) {
            return next(new ErrorHandler('All fields are required', 400));
        }

        if (isNaN(price) || price <= 0) {
            return next(new ErrorHandler('Price should be a positive number', 400));
        }

        const validDate = Date.parse(releaseDate);
        if (isNaN(validDate)) {
            return next(new ErrorHandler('Invalid release date', 400));
        }

        const book = await Book.findById(req.params.id);
        if (!book) {
            return next(new ErrorHandler('Book not found', 404));
        }

        // Upload new image to ImageKit if provided
        if (req.file) {
            // Delete old image from ImageKit
            if (book.imageFileId) {
                await imagekitInstance.deleteFile(book.imageFileId);
            }

            // Upload new image to ImageKit
            const uploadResponse = await imagekitInstance.upload({
                file: req.file.buffer,
                fileName: `${Date.now()}_${req.file.originalname}`,
                folder: 'books',
            });

            book.image = uploadResponse.url; // Update image URL
            book.imageFileId = uploadResponse.fileId; // Store new fileId
        }
        // Update book details
        book.title = title;
        book.author = author;
        book.price = price;
        book.releaseDate = releaseDate;
        book.description = description;
        // Save the updated book
        const updatedBook = await book.save();
        if (!updatedBook) {
            return next(new ErrorHandler('Failed to update book', 500));
        }
        res.status(200).json({
            message: 'Book updated successfully',
            book: updatedBook
        }); 
    } catch (error) {
        // console.log(error.message);
        return next(new ErrorHandler('Failed to update book', 500));
    }
});

// Delete a book
exports.deleteBook = catchAsyncErrors(async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return next(new ErrorHandler('Book not found', 404));
        }
        // Delete image from ImageKit
        if (book.imageFileId) {
            await imagekitInstance.deleteFile(book.imageFileId);
        }
        await book.deleteOne();
        res.status(200).json({
            message: 'Book deleted successfully',
        });
    } catch (error) {
        // console.log(error.message);
        return next(new ErrorHandler('Failed to delete book', 500));
    }
});


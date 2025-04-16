const express = require('express');
const router = express.Router()
const Book = require('../models/bookSchema')
const { createBook, getBook, getBookById, updateBook, deleteBook } = require('../controller/bookController')
const multer = require('multer')
const upload = require('../utils/upload')

// Create a new book
router.post('/', upload.single('image'), createBook)

// Get all books with optional search query
router.get('/', getBook)

// Get a book by ID
router.get('/:id', getBookById)

// Update a book by ID
router.put('/:id', upload.single('image'), updateBook)

// Delete a book by ID
router.delete('/:id', deleteBook)

module.exports = router
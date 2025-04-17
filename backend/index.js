const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/connect');
const bookRouter = require('./routes/bookRouter');
const ErrorHandler = require('./utils/ErrorHandler');
const ErrorMiddleware = require('./middleware/ErrorMiddleware');

const app = express();

// Connect to MongoDB
connectDB();

// Logger
app.use(logger('tiny'));

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use("/uploads", express.static("uploads"));

// Routes
app.use('/api/books', bookRouter);

// 404 Route - Not Found
app.use((req, res, next) => {
    next(new ErrorHandler(`Not Found - ${req.originalUrl}`, 404));
});

// Global Error Handler Middleware
app.use(ErrorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

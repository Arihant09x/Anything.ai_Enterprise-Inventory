// MUST BE FIRST
// require('newrelic');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const { connectDB } = require('./config/db');
const logger = require('./utils/logger');

// We will create these in Phase 3, but importing them now to avoid errors later
// (Comment them out if you try to run before Phase 3)
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();

// --- SECURITY MIDDLEWARE ---
app.use(helmet()); // Secure Headers
app.use(cors());   // Allow Frontend access
app.use(express.json({ limit: '10kb' })); // Body parser limited to 10kb
app.use(hpp());    // Prevent parameter pollution

// Rate Limiting: 100 requests per 15 mins
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.'
});
app.use('/api', limiter);

// --- ROUTES (Placeholder for now) ---
app.get('/', (req, res) => {
    res.send('Welcome to the Anything.ai API!');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// --- ERROR HANDLER ---
app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
});
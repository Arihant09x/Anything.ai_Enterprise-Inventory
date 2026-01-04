const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Helper to generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token lasts 1 day
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, adminSecret } = req.body;

        // --- SECURITY: Role Assignment Logic ---
        let role = 'user'; // Default is always user

        // Check if user is trying to be admin
        if (adminSecret) {
            if (adminSecret === process.env.ADMIN_SECRET_KEY) {
                role = 'admin'; // Grant admin only if keys match exactly
                logger.warn(`ADMIN REGISTERED: New Admin created with email: ${email}`);
            } else {
                logger.warn(`FAILED ADMIN ATTEMPT: Email ${email} tried wrong secret key.`);
                // We do NOT return an error, we just register them as a normal user.
                // This prevents hackers from knowing if the key was close or not.
            }
        }

        // Create User
        const user = await User.create({ name, email, password, role });

        // Send Token
        // Send Token
        const token = generateToken(user.id, user.role);
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        // Check for duplicate email error
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide email and password' });
        }

        // Check for user
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = generateToken(user.id, user.role);
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};
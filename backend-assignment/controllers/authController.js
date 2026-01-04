const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, adminSecret } = req.body;

        let role = 'user';

        if (adminSecret) {
            if (adminSecret === process.env.ADMIN_SECRET_KEY) {
                role = 'admin';
                logger.warn(`ADMIN REGISTERED: New Admin created with email: ${email}`);
            } else {
                logger.warn(`FAILED ADMIN ATTEMPT: Email ${email} tried wrong secret key.`);
            }
        }

        const user = await User.create({ name, email, password, role });
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
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide email and password' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

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
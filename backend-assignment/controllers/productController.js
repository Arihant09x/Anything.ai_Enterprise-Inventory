const Product = require('../models/Product');
const logger = require('../utils/logger');

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        next(error);
    }
};

const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        logger.info(`Product Created: ${product.name} by Admin ${req.user.email}`);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id || id === 'undefined') {
            return res.status(400).json({ success: false, error: 'Invalid ID' });
        }

        let product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        product = await product.update(req.body);
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        await product.destroy();
        logger.info(`Product Deleted: ${req.params.id} by Admin ${req.user.email}`);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

const checkoutProduct = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const qty = quantity || 1;

        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        if (product.stock < qty) {
            return res.status(400).json({
                success: false,
                error: `Not enough stock. Only ${product.stock} left.`
            });
        }

        product.stock = product.stock - qty;
        await product.save();

        logger.info(`User ${req.user.email} bought ${qty} of ${product.name}`);

        res.status(200).json({
            success: true,
            message: 'Purchase successful',
            newStock: product.stock
        });

    } catch (error) {
        next(error);
    }
};

// EXPORT ALL FUNCTIONS AT ONCE
module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    checkoutProduct
};
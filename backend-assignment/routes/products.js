const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { getProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const cache = require('../middleware/cache');

router.get('/', cache(60), productController.getProducts);
router.get('/:id', protect, productController.getProduct);

router.post('/', protect, authorize('admin'), productController.createProduct);
router.put('/:id', protect, authorize('admin'), productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);
router.post('/:id/checkout', protect, productController.checkoutProduct);

module.exports = router;
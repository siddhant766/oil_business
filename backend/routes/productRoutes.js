const express = require('express');
const { getProducts, getProduct, updateVariantPrice, createProduct, updateProduct, deleteProduct, getAllProductsAdmin } = require('../controllers/productController');
const { adminProtect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(adminProtect, createProduct);

// Admin route to get ALL products (Draft, Published, Hidden) — must be before /:id
router.route('/admin/all').get(adminProtect, getAllProductsAdmin);

router.route('/:id')
    .get(getProduct)
    .put(adminProtect, updateProduct)
    .delete(adminProtect, deleteProduct);

router.route('/:id/variants/:variantId/price').put(adminProtect, updateVariantPrice);

module.exports = router;

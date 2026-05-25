const Product = require('../models/Product');

// @desc    Get all products for admin (all statuses)
// @route   GET /api/v1/products/admin/all
// @access  Private (Admin)
exports.getAllProductsAdmin = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false }).populate('category', 'name').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    };
};

// @desc    Get all products (public)
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        // Simple search by name if provided
        let query;
        if (req.query.search) {
            query = Product.find({
                name: { $regex: req.query.search, $options: 'i' },
                status: 'Published',
                isDeleted: false
            });
        } else {
            query = Product.find({ status: 'Published', isDeleted: false });
        }

        // Populate category
        query = query.populate('category', 'name');

        const products = await query;
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, status: 'Published', isDeleted: false }).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private (Admin)
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete product (Soft Delete)
// @route   DELETE /api/v1/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update product variant price
// @route   PUT /api/v1/products/:id/variants/:variantId/price
// @access  Private (Admin)
exports.updateVariantPrice = async (req, res) => {
    try {
        const { id, variantId } = req.params;
        const { price } = req.body;

        if (!price) {
            return res.status(400).json({ success: false, message: 'Please provide a new price' });
        }

        const product = await Product.findOneAndUpdate(
            { _id: id, 'variants._id': variantId },
            { $set: { 'variants.$.price': price } },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product or variant not found' });
        }

        // Emit socket event for live price update
        const io = req.app.get('io');
        if (io) {
            io.emit('priceUpdate', {
                productId: id,
                variantId: variantId,
                newPrice: price
            });
        }
        
        const AuditLog = require('../models/AuditLog');
        if (req.admin) {
            await AuditLog.create({
                adminId: req.admin._id,
                action: 'UPDATE_PRICE',
                details: `Updated price of variant ${variantId} to ${price}`,
                targetId: product._id
            });
        }

        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

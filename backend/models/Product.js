const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
        index: true
    },
    slug: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand']
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true,
        index: true
    },
    gstPercentage: {
        type: Number,
        default: 5
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Hidden'],
        default: 'Draft'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    trending: {
        type: Boolean,
        default: false
    },
    exportReady: {
        type: Boolean,
        default: false
    },
    moq: {
        type: Number,
        default: 1
    },
    tags: [{
        type: String
    }],
    certifications: [{
        type: String
    }],
    nutritionalInfo: {
        type: String,
        default: ''
    },
    warehouseLocation: {
        type: String,
        default: 'Delhi NCR'
    },
    variants: [{
        size: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        wholesalePrice: {
            type: Number,
            required: true
        },
        sku: {
            type: String,
            required: true,
            unique: true,
            sparse: true
        },
        stockStatus: {
            type: String,
            enum: ['In Stock', 'Low Stock', 'Out of Stock'],
            default: 'In Stock'
        },
        stockQuantity: {
            type: Number,
            default: 0
        },
        dispatchTime: {
            type: String,
            default: '24-48 hrs'
        }
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Auto-generate slug from name if not provided
// Note: Mongoose 9.x does not use next() callbacks in hooks
ProductSchema.pre('save', function() {
    if (!this.slug && this.name) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
});

module.exports = mongoose.model('Product', ProductSchema);

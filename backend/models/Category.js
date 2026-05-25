const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        default: ''
    },
    description: {
        type: String
    },
    icon: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

CategorySchema.pre('save', function() {
    if (!this.slug && this.name) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
});

module.exports = mongoose.model('Category', CategorySchema);

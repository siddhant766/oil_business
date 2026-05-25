const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: [true, 'Please add a phone number'],
        unique: true,
        index: true
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    addresses: [{
        type: {
            type: String,
            enum: ['Shop', 'Warehouse', 'Home'],
            default: 'Home'
        },
        addressLine1: String,
        city: String,
        state: String,
        pincode: String,
        isDefault: {
            type: Boolean,
            default: false
        }
    }],
    gstNumber: {
        type: String,
    },
    businessName: {
        type: String,
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Encrypt password using bcrypt
UserSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id, role: 'Customer' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

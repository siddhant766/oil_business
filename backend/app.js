const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const path = require('path');

// Mount routers
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/inquiries', inquiryRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/users', userRoutes);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Oil Business API is running...');
});

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Error handling middleware should be last
app.use(errorHandler);

module.exports = app;

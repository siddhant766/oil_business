import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slices/cartSlice';
import api from '../services/api';

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'Home',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in via JWT
    const token = localStorage.getItem('token');
    if (!token) {
      // Not logged in -> redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cartItems,
        totalAmount,
        shippingAddress: {
          addressLine1: formData.addressLine1,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          addressType: formData.addressType
        },
        paymentMethod: 'COD',
        customerNotes: formData.notes
      };

      const response = await api.post('/orders', orderData);
      
      if (response.data.success) {
        alert('Order Placed Successfully via COD!');
        dispatch(clearCart());
        navigate('/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-[var(--color-background)] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-8 text-center">Checkout</h2>
        
        <div className="glass-card p-8">
          {error && (
            <div className="mb-4 bg-red-50 p-3 rounded-md border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2 mb-4">Delivery Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input required type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="input-field block w-full" placeholder="Street Address, Area" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input required type="text" name="city" value={formData.city} onChange={handleChange} className="input-field block w-full" placeholder="City" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input required type="text" name="state" value={formData.state} onChange={handleChange} className="input-field block w-full" placeholder="State" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="input-field block w-full" placeholder="110020" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                <select name="addressType" value={formData.addressType} onChange={handleChange} className="input-field block w-full">
                  <option value="Home">Home</option>
                  <option value="Shop">Shop</option>
                  <option value="Warehouse">Warehouse</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Notes (Optional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className="input-field block w-full" placeholder="Any specific instructions for delivery" rows="2"></textarea>
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-700">Total Amount (COD)</span>
                <span className="text-2xl font-bold text-[var(--color-primary)]">₹{totalAmount}</span>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order (COD)'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

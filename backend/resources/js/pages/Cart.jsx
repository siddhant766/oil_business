import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../redux/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (product, variantId) => {
    dispatch(removeFromCart({ product, variantId }));
  };

  return (
    <div className="bg-[var(--color-background)] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-8">Your Cart</h2>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16 glass-card">
            <h3 className="text-xl text-gray-600 mb-4">Your cart is empty</h3>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.product}-${item.variantId}`} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center text-xs text-gray-500">
                      <img 
                        src={item.image?.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${item.image}` : (item.image || 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&q=80&w=400')} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                      <p className="text-sm font-semibold text-[var(--color-primary)]">₹{item.price} x {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-lg">₹{item.totalPrice}</span>
                    <button 
                      onClick={() => handleRemove(item.product, item.variantId)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4 border-b pb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-500 font-semibold">Free</span>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-4 mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-[var(--color-primary)]">₹{totalAmount}</span>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full btn-accent py-3 text-lg"
                >
                  Proceed to Checkout
                </button>
                <p className="text-xs text-center text-gray-500 mt-4">
                  Cash on Delivery available.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

import React, { useState, useEffect } from 'react';
import { Package, Download, RotateCcw } from 'lucide-react';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Package className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">Looks like you haven't placed an order yet.</p>
          <a href="/products" className="btn-primary inline-flex">Start Shopping</a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-900 font-medium">{order._id}</span></p>
                  <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold
                    ${order.status === 'Placed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Approved' ? 'bg-indigo-100 text-indigo-800' :
                      order.status === 'Packed' ? 'bg-orange-100 text-orange-800' :
                      order.status === 'Out For Delivery' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-xl font-bold text-[var(--color-primary)]">₹{order.totalAmount}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {order.items.map(item => (
                  <div key={item._id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <img 
                        src={item.product?.image?.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${item.product.image}` : (item.product?.image || 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&q=80&w=400')} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.size} x {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 border-t pt-4">
                <button className="flex items-center text-gray-600 hover:text-[var(--color-primary)] font-medium text-sm transition-colors">
                  <Download size={16} className="mr-2" /> Invoice
                </button>
                <button className="flex items-center text-[var(--color-accent)] hover:text-orange-600 font-bold text-sm transition-colors">
                  <RotateCcw size={16} className="mr-2" /> Buy Again
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;

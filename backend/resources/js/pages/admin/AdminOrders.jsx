import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, Truck, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        fetchOrders(); // Refresh table
      }
    } catch (err) {
      console.error(err);
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/invoices/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to generate invoice');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><Clock size={12} className="mr-1"/> Placed</span>;
      case 'Approved': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><CheckCircle size={12} className="mr-1"/> Approved</span>;
      case 'Packed': return <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><FileText size={12} className="mr-1"/> Packed</span>;
      case 'Out for Delivery': return <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><Truck size={12} className="mr-1"/> Out for Delivery</span>;
      case 'Delivered': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><CheckCircle size={12} className="mr-1"/> Delivered</span>;
      case 'Cancelled': return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><XCircle size={12} className="mr-1"/> Cancelled</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(order => 
    order._id.includes(searchTerm) || 
    (order.user?.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Track, update, and manage invoices for all bulk and retail orders.</p>
        </div>
        
        <div className="mt-4 md:mt-0 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Order ID or Name..."
            className="pl-10 input-field w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID / Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Info</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Items / Total</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status & Action</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-bold text-[var(--color-primary)]">#{order._id.slice(-6).toUpperCase()}</div>
                      <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{order.user ? order.user.name : 'Guest'}</div>
                      <div className="text-xs text-gray-500">{order.user?.phoneNumber || 'N/A'}</div>
                      <div className="text-xs text-gray-400 max-w-[200px] truncate">{order.shippingAddress?.city}, {order.shippingAddress?.state}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.items.length} items</div>
                      <div className="text-sm font-extrabold text-[var(--color-accent)]">₹{order.totalAmount}</div>
                      <div className="text-xs text-gray-500 font-medium border border-gray-200 rounded px-1 mt-1 inline-block bg-gray-50">{order.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        {getStatusBadge(order.status)}
                        <select 
                          className="text-xs border border-gray-300 rounded p-1 bg-white focus:ring-[var(--color-primary)] outline-none"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="Placed">Placed</option>
                          <option value="Approved">Approved (Deducts Stock)</option>
                          <option value="Packed">Packed</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled (Restores Stock)</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => downloadInvoice(order._id)} className="text-gray-600 hover:text-[var(--color-primary)] bg-gray-100 p-2 rounded-lg transition-colors" title="Download PDF Invoice">
                        <Download size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

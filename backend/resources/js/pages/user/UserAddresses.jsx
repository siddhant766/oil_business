import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';

const UserAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/customer/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(data.data.addresses || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this address?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(data.data);
      }
    } catch (err) {
      alert('Failed to delete address');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Saved Addresses</h1>
        <button className="btn-primary flex items-center text-sm py-2 px-4">
          <Plus size={16} className="mr-2" /> Add New
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map(addr => (
          <div key={addr._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative">
            {addr.isDefault && (
              <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Default</span>
            )}
            <div className="flex items-center space-x-2 text-[var(--color-primary)] font-bold mb-3">
              <MapPin size={20} />
              <span>{addr.type || 'Address'}</span>
            </div>
            <p className="text-gray-600 mb-1">{addr.addressLine1}</p>
            <p className="text-gray-600 mb-1">{addr.city}, {addr.state} {addr.pincode}</p>
            
            <div className="mt-6 flex space-x-4 border-t pt-4">
              <button className="text-sm font-medium text-[var(--color-primary)] hover:text-green-600">Edit</button>
              <button onClick={() => handleDelete(addr._id)} className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center">
                <Trash2 size={14} className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No saved addresses found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAddresses;

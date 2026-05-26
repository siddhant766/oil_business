import React, { useState, useEffect } from 'react';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    gstNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/customer/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setFormData({
            name: data.data.name || '',
            email: data.data.email || '',
            businessName: data.data.businessName || '',
            gstNumber: data.data.gstNumber || '',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        alert('Profile updated successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>My Profile</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <hr className="my-6" />
          
          <h3 className="font-bold text-gray-900 mb-4">Business Information (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="input-field" placeholder="e.g. Sharma Traders" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
              <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="input-field" placeholder="22AAAAA0000A1Z5" />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={saving} className="btn-primary w-full md:w-auto px-8">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;

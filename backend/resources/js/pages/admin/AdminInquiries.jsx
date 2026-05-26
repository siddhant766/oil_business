import React, { useState, useEffect } from 'react';
import { Search, Briefcase, Mail, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/inquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/inquiries/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchInquiries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wholesale & Dealer Requests</h1>
          <p className="text-gray-600 mt-1">Review bulk order inquiries and distributor applications.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inquiries.map((inq) => (
            <div key={inq._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 flex items-center"><Briefcase size={18} className="mr-2 text-[var(--color-accent)]" /> {inq.businessName}</h3>
                  <p className="text-sm text-gray-500 mt-1">{inq.contactPerson}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold border ${
                  inq.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  inq.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                  inq.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {inq.status}
                </span>
              </div>
              
              <div className="p-5 space-y-3">
                <div className="flex items-center text-sm text-gray-700"><Phone size={16} className="mr-3 text-gray-400" /> {inq.phone}</div>
                <div className="flex items-center text-sm text-gray-700"><Mail size={16} className="mr-3 text-gray-400" /> {inq.email}</div>
                <div className="flex items-start text-sm text-gray-700"><MapPin size={16} className="mr-3 text-gray-400 mt-1 flex-shrink-0" /> <span className="line-clamp-2">{inq.address}</span></div>
                
                {inq.gstNumber && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">GST Number</p>
                        <p className="text-sm font-mono font-bold text-gray-800">{inq.gstNumber}</p>
                    </div>
                )}
                
                <div className="mt-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-500 font-bold uppercase mb-1">Est. Volume</p>
                    <p className="text-sm text-blue-900 font-bold">{inq.estimatedOrderQuantity}</p>
                </div>

                {inq.message && (
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded italic border-l-4 border-gray-300">
                        "{inq.message}"
                    </div>
                )}
              </div>

              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                <button onClick={() => handleStatusChange(inq._id, 'Rejected')} className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center transition-colors"><XCircle size={16} className="mr-1"/> Reject</button>
                <div className="space-x-3">
                  <button onClick={() => handleStatusChange(inq._id, 'Reviewed')} className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors">Mark Reviewed</button>
                  <button onClick={() => handleStatusChange(inq._id, 'Approved')} className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center transition-colors"><CheckCircle size={16} className="mr-1"/> Approve</button>
                </div>
              </div>
            </div>
          ))}
          {inquiries.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
               No wholesale inquiries found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;

import React, { useEffect, useState } from 'react';
import { Package, MapPin, Heart, Clock } from 'lucide-react';

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    savedAddresses: 0,
    wishlistItems: 0
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch user data
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/customer/me`, { headers });
        const userData = await userRes.json();
        if (userData.success) {
          setUser(userData.data);
          
          // Get stats
          setStats({
            totalOrders: 0, // We will fetch this next
            savedAddresses: userData.data.addresses?.length || 0,
            wishlistItems: userData.data.wishlist?.length || 0
          });
        }

        // Fetch orders
        const ordersRes = await fetch(`${import.meta.env.VITE_API_URL}/orders/myorders`, { headers });
        const ordersData = await ordersRes.json();
        if (ordersData.success) {
          setStats(prev => ({ ...prev, totalOrders: ordersData.count }));
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Welcome back, {user?.name?.split(' ')[0] || 'Customer'}!
        </h1>
        <p className="text-gray-500 mt-2">Here's what's happening with your account today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'text-blue-500', bg: 'bg-blue-100' },
          { title: 'Saved Addresses', value: stats.savedAddresses, icon: MapPin, color: 'text-green-500', bg: 'bg-green-100' },
          { title: 'Wishlist Items', value: stats.wishlistItems, icon: Heart, color: 'text-red-500', bg: 'bg-red-100' },
          { title: 'Pending Orders', value: '0', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-100' } // Placeholder logic
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className={`w-14 h-14 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mr-4`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Activity placeholder */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="text-gray-500 py-8 text-center">
          No recent activity to show.
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Bell } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/', { replace: true });
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Package },
    { name: 'Live Prices', path: '/admin/live-prices', icon: Bell },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Wholesale Requests', path: '/admin/wholesale', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--color-primary)] text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          <span className="text-xl font-bold text-[var(--color-accent)]">Admin Portal</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/10 border-l-4 border-[var(--color-accent)]' : 'hover:bg-white/5 border-l-4 border-transparent'
                }`}
              >
                <Icon size={20} className="mr-3 text-gray-300" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center text-sm font-medium text-gray-300 hover:text-white w-full">
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {navItems.find(item => location.pathname.startsWith(item.path))?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-[var(--color-primary)] relative">
              <Bell size={24} />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-sm font-medium text-gray-700">Super Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  MapPin, 
  Package, 
  Heart, 
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';

const UserLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(clearCart()); // Optional: clear cart on logout
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/profile/dashboard' },
    { name: 'My Profile', icon: User, path: '/profile/settings' },
    { name: 'Addresses', icon: MapPin, path: '/profile/addresses' },
    { name: 'My Orders', icon: Package, path: '/profile/orders' },
    { name: 'Wishlist', icon: Heart, path: '/profile/wishlist' },
    { name: 'Saved Cart', icon: ShoppingCart, path: '/cart' }, // Redirects to standard cart
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-accent)] transition-colors duration-200 shadow-md" title="Go to Home Page">
              <Home size={20} className="text-white" />
            </Link>
            <span className="text-xl font-extrabold text-[var(--color-primary)]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              My <span className="text-[var(--color-accent)]">Account</span>
            </span>
          </div>
          <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-[var(--color-primary)] text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors duration-200 font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-bold text-[var(--color-primary)]">My Account</span>
          <div className="w-6"></div> {/* Spacer for centering */}
        </header>

        {/* Dashboard Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default UserLayout;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingCart, Menu, X, Search, User, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'shadow-lg' 
        : 'shadow-sm'
    }`}
    style={{
      background: isScrolled 
        ? 'rgba(255,255,255,0.92)' 
        : 'rgba(255,255,255,1)',
      backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(0,0,0,0.04)',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[70px] items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center group">
            <span className="text-xl md:text-2xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              <span className="text-[var(--color-primary)] group-hover:text-[var(--color-primary-mid)] transition-colors">Premium</span>
              <span className="text-[var(--color-accent)]">Oils</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Products' },
            ].map((link) => (
              <Link key={link.to} to={link.to}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-gray-50">
                {link.label}
              </Link>
            ))}
            <Link to="/categories" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-gray-50">
              Categories
            </Link>
            <a href="/#contact" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-gray-50">
              Contact
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden sm:flex items-center">
              {showSearch && (
                <form onSubmit={handleSearchSubmit} className="absolute right-10 z-50">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-52 px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] shadow-lg bg-white"
                  />
                </form>
              )}
              <button onClick={() => setShowSearch(!showSearch)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-100 transition-all">
                <Search size={18} />
              </button>
            </div>

            {/* User */}
            <Link to="/profile"
              className="w-9 h-9 rounded-xl items-center justify-center text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-100 transition-all hidden sm:flex">
              <User size={18} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-100 transition-all relative">
              <ShoppingCart size={18} />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full text-white shadow-md"
                  style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))' }}>
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* Get Quote button */}
            <Link to="/products" className="hidden lg:flex btn-accent text-xs py-2 px-4 ml-2">
              Get Quote
            </Link>

            {/* Admin link */}
            <Link to="/admin/login" className="hidden xl:block text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest ml-3 transition-colors">
              Admin
            </Link>

            {/* Mobile menu toggle */}
            <button onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all ml-1">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 shadow-xl"
          style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)' }}>
          <div className="px-4 py-4 space-y-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Products' },
              { to: '/profile', label: 'My Account' },
              { to: '/cart', label: 'Cart' },
            ].map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] hover:bg-gray-50 rounded-xl transition-all">
                {link.label}
              </Link>
            ))}
            <a href="/#contact" onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] hover:bg-gray-50 rounded-xl">
              Contact
            </a>
            <div className="pt-2 border-t border-gray-100">
              <Link to="/admin/login" onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wider">
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
    {!isHome && <div className="h-[70px] w-full flex-shrink-0" />}
    </>
  );
};

export default Navbar;

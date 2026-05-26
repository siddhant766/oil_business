import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Categories from './pages/Categories';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminLivePrices from './pages/admin/AdminLivePrices';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

import UserProtectedRoute from './components/user/UserProtectedRoute';
import UserLayout from './layouts/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import UserAddresses from './pages/user/UserAddresses';
import UserOrders from './pages/user/UserOrders';
import UserWishlist from './pages/user/UserWishlist';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="live-prices" element={<AdminLivePrices />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="wholesale" element={<AdminInquiries />} />
              <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
            </Route>
          </Route>

          {/* Protected User Routes */}
          <Route path="/profile" element={<UserProtectedRoute />}>
            <Route element={<UserLayout />}>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="settings" element={<UserProfile />} />
              <Route path="addresses" element={<UserAddresses />} />
              <Route path="orders" element={<UserOrders />} />
              <Route path="wishlist" element={<UserWishlist />} />
              {/* Default redirect if they hit /profile exactly */}
              <Route index element={<UserDashboard />} />
            </Route>
          </Route>

          {/* Public Routes with Navbar/Footer */}
          <Route path="*" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

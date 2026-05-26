import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const UserWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setWishlist(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Heart className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Save products you love here to buy them later.</p>
          <a href="/products" className="btn-primary inline-flex">Browse Products</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wishlist.map(product => (
            <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img 
                  src={product.image?.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${product.image}` : (product.image || 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&q=80&w=400')} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{product.name}</h4>
              <button className="w-full py-2 border border-[var(--color-accent)] text-[var(--color-accent)] rounded-lg font-bold hover:bg-[var(--color-accent)] hover:text-white transition-colors">
                View Product
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserWishlist;

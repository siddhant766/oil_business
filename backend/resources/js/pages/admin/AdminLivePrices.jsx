import React, { useState, useEffect } from 'react';
import { Activity, Zap, RefreshCw, Info } from 'lucide-react';

const AdminLivePrices = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingVariantId, setUpdatingVariantId] = useState(null);
  const fallbackImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' font-size='10' fill='%236b7280' text-anchor='middle' dominant-baseline='middle'>No%20Image</text></svg>";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceUpdate = async (productId, variantId, newPrice) => {
    if (!newPrice || isNaN(newPrice)) return;
    setUpdatingVariantId(variantId);
    
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}/variants/${variantId}/price`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ price: Number(newPrice) })
      });
      
      if (res.ok) {
        // Optimistically update UI
        const updatedProducts = products.map(p => {
            if(p._id === productId) {
                return {
                    ...p,
                    variants: p.variants.map(v => v._id === variantId ? { ...v, price: Number(newPrice) } : v)
                };
            }
            return p;
        });
        setProducts(updatedProducts);
      } else {
        alert('Failed to update price');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingVariantId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="mr-2 text-red-500" size={28} /> Live Market Pricing
          </h1>
          <p className="text-gray-600 mt-1">Instantly push live price changes to the frontend using Socket.io.</p>
        </div>
        <button onClick={fetchProducts} className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <RefreshCw size={16} className="mr-2" /> Refresh Board
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start">
          <Info size={20} className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
              <strong>Socket.io Real-Time Synchronization Active:</strong> Any price changes made here will be instantly broadcasted to all active retail customers currently browsing the website without requiring them to refresh their page.
          </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
                <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex items-center">
                        <div className="h-10 w-10 bg-white border border-gray-200 rounded p-1 mr-3">
                             <img 
                               src={product.image && product.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${product.image}` : (product.image && product.image !== 'no-photo.jpg' ? product.image : fallbackImage)} 
                               className="w-full h-full object-cover" 
                               alt="" 
                             />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{product.name}</h3>
                            <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                    </div>
                    
                    <div className="p-0">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="px-5 py-2 text-left font-medium">Variant</th>
                                    <th className="px-5 py-2 text-right font-medium">Live Retail Price (₹)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {product.variants.map(variant => (
                                    <tr key={variant._id} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 font-medium text-gray-900">
                                            {variant.size}
                                            <div className="text-xs text-gray-400 font-normal">Stock: {variant.stockQuantity}</div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex justify-end items-center relative">
                                                <div className="relative w-28">
                                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none font-bold">₹</span>
                                                    <input 
                                                        type="number"
                                                        defaultValue={variant.price}
                                                        onBlur={(e) => {
                                                            if (e.target.value != variant.price) {
                                                                handlePriceUpdate(product._id, variant._id, e.target.value);
                                                            }
                                                        }}
                                                        className={`w-full pl-7 pr-3 py-1.5 border rounded-lg text-right font-bold text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${updatingVariantId === variant._id ? 'bg-yellow-50 border-yellow-300' : 'border-gray-300'}`}
                                                    />
                                                </div>
                                                {updatingVariantId === variant._id && (
                                                    <Zap size={14} className="text-yellow-500 absolute -right-5 animate-pulse" />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AdminLivePrices;

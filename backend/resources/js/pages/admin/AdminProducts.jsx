import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, PackageOpen, Layers } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Advanced ERP Product State
  const initialProductState = {
    name: '', brand: '', category: '', description: '', image: '', gstPercentage: 5, status: 'Draft',
    variants: []
  };
  const [currentProduct, setCurrentProduct] = useState(initialProductState);
  const [imagePreview, setImagePreview] = useState(null);

  const parseJsonSafe = async (res) => {
    const text = await res.text();
    try {
      return { data: JSON.parse(text), isJson: true, raw: text };
    } catch (err) {
      return { data: null, isJson: false, raw: text };
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { data, isJson, raw } = await parseJsonSafe(res);
      if (!res.ok) {
        const message = isJson ? (data?.message || data?.error || res.statusText) : `Request failed (${res.status})`;
        console.error('Fetch products failed:', message, raw);
        return;
      }
      if (data?.success) setProducts(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
      const { data, isJson, raw } = await parseJsonSafe(res);
      if (!res.ok) {
        const message = isJson ? (data?.message || data?.error || res.statusText) : `Request failed (${res.status})`;
        console.error('Fetch categories failed:', message, raw);
        return;
      }
      if (data?.success) setCategories(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentProduct.image || currentProduct.image === 'no-photo.jpg') {
      alert('Please upload a product image.');
      return;
    }
    if (currentProduct.variants.length === 0) {
        alert("Please add at least one variant (e.g. 1L, 5L) to this product!");
        return;
    }

    const token = localStorage.getItem('adminToken');
    const url = isEditing 
      ? `${import.meta.env.VITE_API_URL}/products/${currentProduct._id}`
      : `${import.meta.env.VITE_API_URL}/products`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(currentProduct)
      });
      const { data, isJson, raw } = await parseJsonSafe(res);
      if (!res.ok) {
        const message = isJson ? (data?.message || data?.error || res.statusText) : `Request failed (${res.status})`;
        console.error('Save product failed:', message, raw);
        alert(message);
        return;
      }
      if (data?.success) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert(data?.message || 'Failed to save product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      // Setup edit state
      setCurrentProduct({
          ...product,
          category: product.category._id || product.category // handle populated category
      });
      setIsEditing(true);
      setImagePreview(product.image && product.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${product.image}` : product.image);
    } else {
      setCurrentProduct(initialProductState);
      setIsEditing(false);
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  // Variant Management
  const addVariant = () => {
      setCurrentProduct({
          ...currentProduct,
          variants: [...currentProduct.variants, { size: '', price: 0, wholesalePrice: 0, sku: `SKU-${Date.now()}`, stockQuantity: 0, stockStatus: 'In Stock' }]
      });
  };

  const updateVariant = (index, field, value) => {
      const newVariants = [...currentProduct.variants];
      newVariants[index][field] = value;
      setCurrentProduct({ ...currentProduct, variants: newVariants });
  };

  const removeVariant = (index) => {
      const newVariants = [...currentProduct.variants];
      newVariants.splice(index, 1);
      setCurrentProduct({ ...currentProduct, variants: newVariants });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">ERP Control Center for inventory, pricing, and variants.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center shadow-lg">
          <Plus size={20} className="mr-2" /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product Info</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Variants / Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            {!product.image || product.image === 'no-photo.jpg' ? (
                                <PackageOpen className="w-full h-full p-2 text-gray-400" />
                            ) : (
                                <img 
                                    src={product.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${product.image}` : product.image} 
                                    className="w-full h-full object-cover" 
                                    alt="" 
                                />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">Brand: {product.brand} | GST: {product.gstPercentage}%</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-xs border border-blue-200">
                           {product.category?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                           {product.variants.map((v, i) => (
                               <div key={i} className="text-xs text-gray-700 flex justify-between w-48 border-b border-gray-100 pb-1">
                                   <span className="font-bold">{v.size}</span>
                                   <span>₹{v.price} / ₹{v.wholesalePrice} (Wholesale)</span>
                                   <span className={`px-2 rounded font-bold ${v.stockQuantity > 10 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                       {v.stockQuantity} qty
                                   </span>
                               </div>
                           ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${product.status === 'Published' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-yellow-50 text-yellow-800 border-yellow-200'}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => openModal(product)} className="text-blue-600 hover:text-blue-900 mr-4 bg-blue-50 p-2 rounded-lg">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No products found.</td></tr>
                  )}
                </tbody>
              </table>
          </div>
        </div>
      )}

      {/* Massive CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-8 relative my-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)] border-b pb-4">
              {isEditing ? 'Edit Product ERP Data' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                      <h3 className="font-bold text-gray-700 bg-gray-50 p-2 rounded border-l-4 border-[var(--color-accent)]">Basic Information</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                        <input type="text" required className="input-field" value={currentProduct.name} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                            <input type="text" required className="input-field" value={currentProduct.brand} onChange={(e) => setCurrentProduct({...currentProduct, brand: e.target.value})} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            {categories.length === 0 ? (
                                <div className="p-3 border border-orange-200 bg-orange-50 rounded-lg text-sm">
                                    <p className="text-orange-700 font-medium">No categories available</p>
                                    <p className="text-orange-600 text-xs mt-1">Go to <a href="/admin/categories" className="underline font-bold">Category Management</a> to create categories first.</p>
                                </div>
                            ) : (
                                <select required className="input-field" value={currentProduct.category || ''} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}>
                                    <option value="">-- Select Category --</option>
                                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            )}
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select className="input-field" value={currentProduct.status} onChange={(e) => setCurrentProduct({...currentProduct, status: e.target.value})}>
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                                <option value="Hidden">Hidden</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GST % *</label>
                            <input type="number" required className="input-field" value={currentProduct.gstPercentage} onChange={(e) => setCurrentProduct({...currentProduct, gstPercentage: e.target.value})} />
                          </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea className="input-field" rows="3" value={currentProduct.description} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image (File or Camera)</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                capture="environment"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)] file:text-white hover:file:bg-green-800 border border-gray-300 rounded-lg"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if(!file) return;
                                    
                                    setImagePreview(URL.createObjectURL(file));

                                    const formData = new FormData();
                                    formData.append('image', file);
                                    
                                    try {
                                        const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
                                            method: 'POST',
                                            body: formData
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                            setCurrentProduct({...currentProduct, image: data.data});
                                        } else {
                                            alert('Upload failed: ' + data.message);
                                        }
                                    } catch(err) {
                                        console.error(err);
                                        alert('Upload error');
                                    }
                                }} 
                            />
                          </div>
                          <div className="col-span-2 md:col-span-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50 overflow-hidden relative group">
                                {imagePreview || currentProduct.image ? (
                                  <>
                                    <img 
                                    src={imagePreview || (currentProduct.image && currentProduct.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${currentProduct.image}` : currentProduct.image)} 
                                        alt="Preview" 
                                        className="h-24 w-full object-contain rounded transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                                        <span className="text-white text-xs font-bold">Image Selected</span>
                                    </div>
                                  </>
                              ) : (
                                  <div className="text-center">
                                    <PackageOpen size={32} className="mx-auto text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-400 block">No Image Uploaded</span>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>

                  {/* Variants Management */}
                  <div className="space-y-4">
                      <div className="flex justify-between items-center bg-gray-50 p-2 rounded border-l-4 border-blue-500">
                          <h3 className="font-bold text-gray-700">Packaging & Variants</h3>
                          <button type="button" onClick={addVariant} className="text-xs bg-blue-600 text-white px-2 py-1 rounded flex items-center font-bold">
                              <Plus size={14} className="mr-1"/> Add Size
                          </button>
                      </div>

                      <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
                          {currentProduct.variants.map((variant, index) => (
                              <div key={index} className="p-4 border border-blue-100 bg-blue-50/30 rounded-lg relative">
                                  <button type="button" onClick={() => removeVariant(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm">
                                      <Trash2 size={16} />
                                  </button>
                                  <div className="grid grid-cols-2 gap-3 mb-3">
                                      <div>
                                          <label className="block text-xs font-bold text-gray-700">Size (e.g. 500ml, 15L Tin)</label>
                                          <input type="text" required className="input-field py-1 px-2 text-sm" value={variant.size} onChange={(e) => updateVariant(index, 'size', e.target.value)} />
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-gray-700">SKU</label>
                                          <input type="text" required className="input-field py-1 px-2 text-sm font-mono text-gray-500" value={variant.sku} onChange={(e) => updateVariant(index, 'sku', e.target.value)} />
                                      </div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-3 mb-3">
                                      <div>
                                          <label className="block text-xs font-bold text-gray-700">Retail Price (₹)</label>
                                          <input type="number" required className="input-field py-1 px-2 text-sm" value={variant.price} onChange={(e) => updateVariant(index, 'price', e.target.value)} />
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-gray-700">Wholesale (₹)</label>
                                          <input type="number" required className="input-field py-1 px-2 text-sm" value={variant.wholesalePrice} onChange={(e) => updateVariant(index, 'wholesalePrice', e.target.value)} />
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-gray-700">Stock Qty</label>
                                          <input type="number" required className="input-field py-1 px-2 text-sm font-bold text-[var(--color-primary)]" value={variant.stockQuantity} onChange={(e) => updateVariant(index, 'stockQuantity', e.target.value)} />
                                      </div>
                                  </div>
                              </div>
                          ))}
                          {currentProduct.variants.length === 0 && (
                              <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
                                  <Layers size={32} className="mx-auto mb-2 opacity-50" />
                                  No variants added. Please add at least one packaging size.
                              </div>
                          )}
                      </div>
                  </div>
              </div>

              <div className="pt-6 mt-6 border-t flex justify-end space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-bold">Cancel</button>
                <button type="submit" className="btn-primary text-lg px-8">{isEditing ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

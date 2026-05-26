import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { ShoppingCart, Filter, X, Search, Package, Star, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search')?.toLowerCase() || '';
  const initialCategory = searchParams.get('category') || '';

  const [products, setLocalProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [stockFilter, setStockFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const sectionRef = useRef(null);
  const fallbackImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' font-size='16' fill='%236b7280' text-anchor='middle' dominant-baseline='middle'>No%20Image</text></svg>";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        const data = await res.json();
        if (data.success) {
          setLocalProducts(data.data.filter(p => p.status === 'Published'));
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
        const data = await res.json();
        if (data.success) setCategories(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
    fetchCategories();

    // Socket.io for live pricing
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socket.on('priceUpdate', (data) => {
      setLocalProducts(prev => prev.map(p => {
        if (p._id === data.productId) {
          return { ...p, variants: p.variants.map(v => v._id === data.variantId ? { ...v, price: Number(data.newPrice) } : v) };
        }
        return p;
      }));
    });
    return () => socket.disconnect();
  }, []);

  const handleVariantChange = (productId, variantId) => {
    setSelectedVariants(prev => ({ ...prev, [productId]: variantId }));
  };

  const handleAddToCart = (product) => {
    const selectedVariantId = selectedVariants[product._id] || product.variants[0]._id;
    const variant = product.variants.find(v => v._id === selectedVariantId);
    if (variant.stockStatus === 'Out of Stock') return;
    dispatch(addToCart({
      product: product._id,
      variantId: variant._id,
      name: product.name,
      size: variant.size,
      price: variant.price,
      image: product.image
    }));
  };

  // Filtering logic
  let filtered = products.filter(p => {
    const matchSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    const categoryId = p.category?._id || p.category;
    const matchCategory = selectedCategory === '' || categoryId === selectedCategory;
    const matchStock = stockFilter === '' || (stockFilter === 'in-stock' && p.variants?.some(v => v.stockQuantity > 0));
    return matchSearch && matchCategory && matchStock;
  });

  // Sorting
  if (sortBy === 'price-low') {
    filtered = [...filtered].sort((a, b) => (a.variants?.[0]?.price || 0) - (b.variants?.[0]?.price || 0));
  } else if (sortBy === 'price-high') {
    filtered = [...filtered].sort((a, b) => (b.variants?.[0]?.price || 0) - (a.variants?.[0]?.price || 0));
  } else if (sortBy === 'name') {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  const activeFilterCount = [selectedCategory, stockFilter, searchQuery].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setStockFilter('');
    setSortBy('');
  };

  const FilterSidebar = ({ className = '' }) => (
    <div className={className}>
      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field !pl-10 text-sm"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input-field text-sm">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        {/* Stock Filter */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Availability</label>
          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="input-field text-sm">
            <option value="">All</option>
            <option value="in-stock">In Stock Only</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field text-sm">
            <option value="">Default</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="name">Name: A → Z</option>
          </select>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="w-full py-2 text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            Clear All Filters ({activeFilterCount})
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-[var(--color-background)] min-h-screen">
      <Helmet>
        <title>Products — Premium Edible Oils | Wholesale & Retail</title>
        <meta name="description" content="Browse our catalog of premium mustard oil, refined soybean oil, and sunflower oil. Live factory prices and wholesale rates." />
      </Helmet>

      {/* Page Header */}
      <div className="bg-gradient-primary py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="section-container relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Our Product Catalog
          </h1>
          <p className="text-gray-300/80 max-w-xl mx-auto">
            Premium quality edible oils with live wholesale pricing. Filter by category, packaging, and availability.
          </p>
        </div>
      </div>

      <div className="section-container py-8" ref={sectionRef}>
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4 flex items-center gap-3">
          <button onClick={() => setShowMobileFilter(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <SlidersHorizontal size={16} /> Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[var(--color-accent)] text-white text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
          <span className="text-sm text-[var(--color-text-muted)]">{filtered.length} products</span>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <FilterSidebar className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start premium-card p-5" />

          {/* Products Grid */}
          <div className="flex-1">
            <div className="hidden lg:flex items-center justify-between mb-6">
              <span className="text-sm text-[var(--color-text-muted)] font-medium">{filtered.length} products found</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="premium-card overflow-hidden">
                    <div className="skeleton h-48 rounded-none" />
                    <div className="p-5 space-y-3">
                      <div className="skeleton h-4 w-3/4" />
                      <div className="skeleton h-3 w-1/2" />
                      <div className="skeleton h-8 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Package size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-600 mb-2">No products found</h3>
                <p className="text-sm text-gray-400 mb-4">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="btn-primary text-sm">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((product) => {
                  const currentVariantId = selectedVariants[product._id] || product.variants[0]?._id;
                  const currentVariant = product.variants.find(v => v._id === currentVariantId) || product.variants[0];
                  if (!currentVariant) return null;

                  const imageUrl = product.image?.startsWith('/uploads')
                    ? `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${product.image}`
                    : (product.image && product.image !== 'no-photo.jpg' ? product.image : fallbackImage);

                  return (
                    <motion.div
                      key={product._id}
                      whileHover={{ y: -4 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="premium-card overflow-hidden group"
                    >
                      {/* Image */}
                      <div className="h-48 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        {imageUrl ? (
                          <>
                            <img 
                              src={imageUrl} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                if (e.target.nextElementSibling) {
                                  e.target.nextElementSibling.classList.remove('hidden');
                                  e.target.nextElementSibling.classList.add('flex');
                                }
                              }}
                            />
                            <div className="hidden absolute inset-0 items-center justify-center bg-gradient-to-br from-amber-50 to-green-50">
                              <Package size={40} className="text-gray-300" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-green-50">
                            <Package size={40} className="text-gray-300" />
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                          {currentVariant.stockStatus === 'Out of Stock' && (
                            <span className="badge-stock bg-red-500/90 text-white">Out of Stock</span>
                          )}
                          {currentVariant.stockStatus === 'Low Stock' && (
                            <span className="badge-stock bg-orange-500/90 text-white">Low Stock</span>
                          )}
                          {product.isFeatured && (
                            <span className="badge-stock bg-[var(--color-accent)]/90 text-white">
                              <Star size={10} className="mr-0.5" /> Featured
                            </span>
                          )}
                        </div>

                        {product.moq > 1 && (
                          <span className="absolute top-2.5 right-2.5 badge-stock bg-[var(--color-primary)]/90 text-white">
                            MOQ: {product.moq}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                          {product.brand} {product.category?.name && `• ${product.category.name}`}
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-3 leading-tight line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>
                          {product.name}
                        </h3>

                        {/* Variant select */}
                        <div className="mb-3">
                          <select
                            className="input-field text-sm py-1.5"
                            value={currentVariantId}
                            onChange={(e) => handleVariantChange(product._id, e.target.value)}
                          >
                            {product.variants.map(v => (
                              <option key={v._id} value={v._id}>{v.size} — ₹{v.price}</option>
                            ))}
                          </select>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-xl font-extrabold text-[var(--color-primary)]">₹{currentVariant.price?.toLocaleString()}</span>
                            {currentVariant.wholesalePrice && (
                              <div className="text-[10px] text-[var(--color-accent-dark)] font-semibold mt-0.5">
                                Wholesale: ₹{currentVariant.wholesalePrice?.toLocaleString()}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={currentVariant.stockStatus === 'Out of Stock'}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                              currentVariant.stockStatus === 'Out of Stock'
                                ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                                : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)] hover:shadow-lg'
                            }`}
                          >
                            <ShoppingCart size={16} /> Add
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilter && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setShowMobileFilter(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal size={18} /> Filters
                </h3>
                <button onClick={() => setShowMobileFilter(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar className="p-4" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;

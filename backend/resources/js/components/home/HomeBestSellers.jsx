import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HomeBestSellers = () => {
  const dispatch = useDispatch();
  const [bestSellers, setBestSellers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const sectionRef = useRef(null);
  const fallbackImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' font-size='16' fill='%236b7280' text-anchor='middle' dominant-baseline='middle'>No%20Image</text></svg>";

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        const data = await res.json();
        if (data.success) {
          const published = data.data.filter(p => p.status === 'Published').slice(0, 8);
          setBestSellers(published);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (bestSellers.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.product-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.6, stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [bestSellers]);

  const handleQuickAdd = (product) => {
    if (!product.variants || product.variants.length === 0) return;
    const variant = product.variants[0];
    dispatch(addToCart({
      product: product._id,
      variantId: variant._id,
      name: product.name,
      size: variant.size,
      price: variant.price,
      image: product.image,
    }));
  };

  return (
    <section ref={sectionRef} className="section-padding bg-white">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <span className="badge-emerald mb-3 inline-flex">Top Products</span>
            <h2 className="section-title text-[var(--color-primary)] mb-2">
              Best Selling Products
            </h2>
            <p className="section-subtitle">
              Top choices for homes, restaurants, and commercial kitchens.
            </p>
          </div>
          <Link to="/products" className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2 whitespace-nowrap">
            View Full Catalog <span className="text-lg">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="premium-card overflow-hidden">
                <div className="skeleton h-56 rounded-none" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-8 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => {
              const firstVariant = product.variants?.[0];
              const variantCount = product.variants?.length || 0;
              const price = firstVariant ? `₹${firstVariant.price.toLocaleString()}` : 'Price TBA';
              const wholesalePrice = firstVariant ? `₹${firstVariant.wholesalePrice?.toLocaleString()}` : '';
              const stock = firstVariant?.stockQuantity > 0;
              const imageUrl = product.image?.startsWith('/uploads') 
                ? `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${product.image}` 
                : (product.image && product.image !== 'no-photo.jpg' 
                  ? product.image 
                  : fallbackImage);

              return (
                <div key={product._id} className="product-card premium-card overflow-hidden group">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {imageUrl ? (
                      <>
                        <img 
                          src={imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
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
                          <Package size={48} className="text-gray-300" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-green-50">
                        <Package size={48} className="text-gray-300" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {stock ? (
                        <span className="badge-stock bg-green-500/90 text-white">In Stock</span>
                      ) : (
                        <span className="badge-stock bg-red-500/90 text-white">Out of Stock</span>
                      )}
                      {product.isFeatured && (
                        <span className="badge-stock bg-[var(--color-accent)]/90 text-white">
                          <Star size={10} className="mr-0.5" /> Featured
                        </span>
                      )}
                    </div>

                    {/* Quick actions overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                        <Link to="/products" className="flex-1 flex items-center justify-center gap-1 bg-white text-[var(--color-primary)] py-2 rounded-lg text-xs font-bold hover:bg-[var(--color-accent)] hover:text-white transition-colors">
                          <Eye size={14} /> Quick View
                        </Link>
                        <button className="w-9 h-9 flex items-center justify-center bg-white/90 rounded-lg text-gray-500 hover:text-red-500 transition-colors">
                          <Heart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                        {product.brand}
                      </span>
                      {product.certifications?.length > 0 && (
                        <span className="text-[10px] text-[var(--color-accent)] font-bold">• {product.certifications[0]}</span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1.5 leading-tight line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>
                      {product.name}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] mb-3">
                      {variantCount} size{variantCount !== 1 ? 's' : ''} available
                      {product.moq > 1 && <span className="ml-1">• MOQ: {product.moq}</span>}
                    </p>

                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-xl font-extrabold text-[var(--color-primary)]">{price}</span>
                        {wholesalePrice && (
                          <div className="text-[10px] text-[var(--color-accent-dark)] font-semibold mt-0.5">
                            Wholesale: {wholesalePrice}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleQuickAdd(product)}
                        disabled={!stock}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md ${
                          stock
                            ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)] hover:shadow-lg hover:scale-105'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeBestSellers;

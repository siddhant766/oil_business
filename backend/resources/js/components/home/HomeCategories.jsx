import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_CATEGORIES = [
  { _id: 'mustard', name: 'Mustard Oil', icon: '🌿', color: 'from-amber-400 to-amber-700' },
  { _id: 'sunflower', name: 'Sunflower Oil', icon: '🌻', color: 'from-yellow-300 to-orange-500' },
  { _id: 'soybean', name: 'Soybean Oil', icon: '🫘', color: 'from-orange-300 to-amber-600' },
  { _id: 'groundnut', name: 'Groundnut Oil', icon: '🥜', color: 'from-amber-500 to-orange-700' },
  { _id: 'ricebran', name: 'Rice Bran Oil', icon: '🌾', color: 'from-lime-400 to-green-600' },
  { _id: 'coconut', name: 'Coconut Oil', icon: '🥥', color: 'from-teal-300 to-teal-600' },
];

const GRADIENT_MAP = [
  'from-amber-400 to-amber-700',
  'from-yellow-300 to-orange-500',
  'from-orange-300 to-amber-600',
  'from-amber-500 to-orange-700',
  'from-lime-400 to-green-600',
  'from-teal-300 to-teal-600',
  'from-rose-400 to-red-600',
  'from-indigo-400 to-purple-600',
  'from-emerald-400 to-green-700',
  'from-cyan-400 to-blue-600',
  'from-orange-400 to-red-500',
  'from-violet-400 to-purple-700',
];

const CATEGORY_IMAGES = {
  'mustard': '/images/categories/mustard.png',
  'sunflower': '/images/categories/sunflower.png',
  'soybean': '/images/categories/soybean.png',
  'groundnut': '/images/categories/groundnut.png',
  'rice bran': '/images/categories/rice_bran.png',
  'coconut': '/images/categories/coconut.png',
  'palm': '/images/categories/palm.png',
  'blend': '/images/categories/blend.png',
  'bulk': '/images/categories/bulk.png',
  'organic': '/images/categories/organic.png',
  'cold press': '/images/categories/cold_press.png',
  'sesame': '/images/categories/cold_press.png',
  'export': '/images/categories/export.png',
  'premium': '/images/categories/export.png',
};

const getImageForCategory = (name) => {
  if (!name) return '/images/categories/blend.png';
  const n = name.toLowerCase();
  for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
    if (n.includes(key)) return url;
  }
  return '/images/categories/blend.png';
};

const HomeCategories = () => {
  const [categories, setCategories] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setCategories(data.data.slice(0, 12));
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch {
        setCategories(FALLBACK_CATEGORIES);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.cat-card',
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5, stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [categories]);

  return (
    <section ref={sectionRef} id="categories" className="section-padding bg-[var(--color-surface)]">
      <div className="section-container">
        <div className="text-center mb-12">
          <motion.span 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="badge-gold mb-4 inline-flex">
            Product Range
          </motion.span>
          <h2 className="section-title text-[var(--color-primary)] mb-4">
            Explore Our Oil Categories
          </h2>
          <p className="section-subtitle mx-auto">
            From cold-pressed artisanal oils to bulk industrial supplies — every grade of edible oil for every business need.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-5">
          {categories.map((cat, index) => (
            <Link to={`/products?category=${cat._id}`} key={cat._id} className="cat-card group block">
              <div className="premium-card p-5 flex flex-col items-center justify-center text-center h-full">
                <div className={`w-24 h-24 rounded-full mb-4 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:shadow-xl transition-all duration-300 overflow-hidden bg-gray-100 border-[3px] border-[var(--color-surface)] ring-2 ring-transparent group-hover:ring-[var(--color-primary)]`}>
                  <img 
                    src={getImageForCategory(cat.name)} 
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-sm font-bold text-gray-800 group-hover:text-[var(--color-primary)] transition-colors leading-tight mb-2">
                  {cat.name}
                </h3>
                <div className="flex items-center text-[var(--color-accent)] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  Explore <ArrowRight size={12} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCategories;

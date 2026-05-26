import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, CreditCard, Repeat, TrendingDown, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const advantages = [
  { icon: TrendingDown, title: 'Bulk Pricing', desc: 'Volume-based discounts up to 30% off MRP on all oil categories' },
  { icon: FileText, title: 'GST Invoicing', desc: 'Proper tax invoices with GSTIN for seamless business accounting' },
  { icon: CreditCard, title: 'Credit Terms', desc: 'Flexible payment options including 15-30 day credit for verified dealers' },
  { icon: Repeat, title: 'Auto Reorder', desc: 'Set up recurring orders with locked-in pricing and priority dispatch' },
  { icon: Truck, title: 'Pan-India Delivery', desc: 'Dedicated logistics to 25+ states with real-time tracking' },
  { icon: ShieldCheck, title: 'Quality Guarantee', desc: 'FSSAI, AGMARK & ISO 22000 certified products with lab reports' },
];

const HomeWholesale = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ws-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.5, stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-gradient-surface relative overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <span className="badge-gold mb-4 inline-flex">B2B Wholesale</span>
            <h2 className="section-title text-[var(--color-primary)] mb-4">
              Built for Business Buyers
            </h2>
            <p className="section-subtitle mb-8">
              Whether you're a shopkeeper, restaurant chain, or industrial processor — our wholesale platform is designed to give you unbeatable pricing, reliable supply, and complete business support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/products" className="btn-accent flex items-center justify-center gap-2 py-3">
                Request Wholesale Quote <ArrowRight size={18} />
              </Link>
              <Link to="/products" className="btn-primary flex items-center justify-center gap-2 py-3">
                Become a Distributor
              </Link>
            </div>
          </div>

          {/* Right Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {advantages.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="ws-card premium-card p-5 group">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/5 flex items-center justify-center mb-3 group-hover:bg-[var(--color-accent)]/10 transition-colors duration-300">
                    <Icon size={20} className="text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeWholesale;

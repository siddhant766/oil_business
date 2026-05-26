import React, { useEffect, useRef } from 'react';
import { UtensilsCrossed, Building2, Store, ChefHat, Factory, Plane, ShoppingBag, Truck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const solutions = [
  { icon: UtensilsCrossed, title: 'Restaurants & QSR', desc: 'Bulk supply with consistent quality for food service', color: 'from-orange-400 to-red-500' },
  { icon: Building2, title: 'Hotels & Hospitality', desc: 'Premium grade oils for 5-star kitchen operations', color: 'from-blue-400 to-indigo-600' },
  { icon: Store, title: 'Retail & Kirana Shops', desc: 'Competitive margins with doorstep delivery', color: 'from-green-400 to-emerald-600' },
  { icon: ChefHat, title: 'Caterers & Events', desc: 'Large-quantity orders with express dispatch', color: 'from-purple-400 to-violet-600' },
  { icon: Factory, title: 'Food Processing / FMCG', desc: 'Industrial-scale tanker supply for manufacturing', color: 'from-gray-500 to-gray-700' },
  { icon: Plane, title: 'Export Businesses', desc: 'International certifications & export packaging', color: 'from-cyan-400 to-blue-600' },
  { icon: ShoppingBag, title: 'D2C Brands', desc: 'White-label & private label oil solutions', color: 'from-pink-400 to-rose-600' },
  { icon: Truck, title: 'Wholesale Dealers', desc: 'Best wholesale rates with regional distribution support', color: 'from-amber-400 to-yellow-600' },
];

const HomeIndustrySolutions = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.industry-card',
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
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-white">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="badge-emerald mb-4 inline-flex">Industry Solutions</span>
          <h2 className="section-title text-[var(--color-primary)] mb-4">
            Solutions for Every Industry
          </h2>
          <p className="section-subtitle mx-auto">
            Tailored oil supply programs for diverse business verticals — from single-outlet restaurants to multi-location FMCG chains.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {solutions.map((sol, i) => {
            const Icon = sol.icon;
            return (
              <div key={i} className="industry-card premium-card p-5 md:p-6 text-center group cursor-pointer">
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${sol.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1.5 group-hover:text-[var(--color-primary)] transition-colors">{sol.title}</h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{sol.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeIndustrySolutions;

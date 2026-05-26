import React, { useEffect, useRef } from 'react';
import { Warehouse, Truck, BarChart3, Globe2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { icon: Warehouse, value: '8+', label: 'Warehouses', desc: 'Strategic locations across India', color: 'from-emerald-500 to-green-700' },
  { icon: Truck, value: '500+', label: 'Daily Dispatches', desc: 'Reliable express logistics', color: 'from-blue-500 to-indigo-700' },
  { icon: BarChart3, value: '₹50Cr+', label: 'Monthly Volume', desc: 'Trusted supply at scale', color: 'from-amber-500 to-orange-700' },
  { icon: Globe2, value: '10+', label: 'Export Markets', desc: 'International quality certifications', color: 'from-purple-500 to-violet-700' },
];

const HomeSupplyChain = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.supply-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.6, stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-gradient-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      {/* Glow orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, rgba(30,82,52,0.6) 0%, transparent 70%)' }} />

      <div className="section-container relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full mb-4 text-sm font-semibold"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--color-accent)' }}>
            Supply Chain Metrics
          </span>
          <h2 className="section-title text-white mb-4">
            Enterprise-Scale Distribution
          </h2>
          <p className="text-gray-300/80 max-w-2xl mx-auto text-lg">
            A robust supply chain backbone powering India's edible oil industry with real-time inventory and express logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div key={i} className="supply-card p-6 rounded-2xl text-center group transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                }}>
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {metric.value}
                </h3>
                <p className="text-[var(--color-accent)] font-bold text-sm mb-1">{metric.label}</p>
                <p className="text-gray-400 text-xs">{metric.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeSupplyChain;

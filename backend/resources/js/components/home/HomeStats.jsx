import React, { useEffect, useRef, useState } from 'react';
import { Warehouse, Truck, Package, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { id: 1, label: 'Active Retailers', value: 5000, suffix: '+', icon: Package, color: 'from-amber-400 to-amber-600' },
  { id: 2, label: 'States Covered', value: 25, suffix: '+', icon: MapPin, color: 'from-emerald-400 to-emerald-600' },
  { id: 3, label: 'Bulk Orders Monthly', value: 1000, suffix: '+', icon: Warehouse, color: 'from-blue-400 to-blue-600' },
  { id: 4, label: 'Express Dispatch', value: 24, suffix: 'hr', icon: Truck, color: 'from-purple-400 to-purple-600' },
];

const AnimatedCounter = ({ target, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const start = Date.now();
          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const HomeStats = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.stat-card',
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.6, stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 relative bg-white border-b border-gray-100">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="stat-card premium-card p-6 md:p-8 text-center group">
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-[var(--color-text-muted)] font-medium text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeStats;

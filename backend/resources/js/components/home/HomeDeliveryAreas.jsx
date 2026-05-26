import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const regions = [
  { name: 'North India', states: 'Delhi, UP, Haryana, Punjab, Rajasthan, MP', color: 'from-emerald-400 to-green-600' },
  { name: 'West India', states: 'Maharashtra, Gujarat, Goa, Rajasthan', color: 'from-amber-400 to-orange-600' },
  { name: 'South India', states: 'Tamil Nadu, Karnataka, Kerala, AP, Telangana', color: 'from-blue-400 to-indigo-600' },
  { name: 'East India', states: 'West Bengal, Bihar, Odisha, Jharkhand, Assam', color: 'from-purple-400 to-violet-600' },
  { name: 'Central India', states: 'Madhya Pradesh, Chhattisgarh, Uttarakhand', color: 'from-teal-400 to-cyan-600' },
  { name: 'Pan-India Tanker', states: 'Industrial tanker supply nationwide', color: 'from-red-400 to-rose-600' },
];

const HomeDeliveryAreas = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.delivery-card',
        { opacity: 0, y: 25 },
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
    <section ref={sectionRef} className="section-padding bg-[var(--color-surface)]">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="badge-gold mb-4 inline-flex">
            <MapPin size={14} className="mr-1" /> Delivery Network
          </span>
          <h2 className="section-title text-[var(--color-primary)] mb-4">
            Pan-India Distribution Coverage
          </h2>
          <p className="section-subtitle mx-auto">
            Strategic warehouse locations ensure 24-48 hour delivery to 25+ states. Industrial tanker supply available nationwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {regions.map((region, i) => (
            <div key={i} className="delivery-card premium-card p-5 group flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${region.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <MapPin size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{region.name}</h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{region.states}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeDeliveryAreas;

import React, { useEffect, useRef } from 'react';
import { Award, Leaf, FlaskConical, Headphones, ShieldCheck, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  { icon: Award, title: 'Industry Certifications', desc: 'FSSAI, AGMARK, ISO 22000 certified across all product lines' },
  { icon: Leaf, title: 'Pure & Unblended', desc: 'Lab-tested purity. No adulteration. Guaranteed quality standards' },
  { icon: FlaskConical, title: 'In-House Quality Lab', desc: 'Every batch tested for FFA, moisture, and peroxide values' },
  { icon: Zap, title: '24hr Express Dispatch', desc: 'Same-day processing with dedicated logistics fleet' },
  { icon: Headphones, title: 'Dedicated Account Manager', desc: 'Personal business support for wholesale and B2B customers' },
  { icon: ShieldCheck, title: 'Transparent Pricing', desc: 'No hidden costs. GST-inclusive pricing with volume discounts' },
];

const HomeWhyChooseUs = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.why-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.5, stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );
      gsap.fromTo('.why-image',
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1, scale: 1,
          duration: 1,
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Image */}
          <div className="why-image relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/warehouse.png"
                alt="Our modern oil processing and distribution facility"
                className="w-full h-80 lg:h-[440px] object-cover"
              />
            </div>
            {/* Floating accent badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl px-5 py-3 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-mid)] flex items-center justify-center">
                <Award size={20} className="text-[var(--color-accent)]" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">ISO 22000</div>
                <div className="text-xs text-[var(--color-text-muted)]">Certified Facility</div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <span className="badge-gold mb-4 inline-flex">Why Premium Oils</span>
            <h2 className="section-title text-[var(--color-primary)] mb-4">
              Trust Built on Quality
            </h2>
            <p className="section-subtitle mb-8">
              India's most trusted edible oil supply partner — delivering premium quality with enterprise-grade reliability.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reasons.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="why-card group flex gap-3 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-mid)] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={18} className="text-[var(--color-accent)]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm mb-0.5">{item.title}</h3>
                      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeWhyChooseUs;

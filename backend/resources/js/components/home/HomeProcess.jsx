import React, { useEffect, useRef } from 'react';
import { Search, ClipboardList, Truck, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { step: '01', icon: Search, title: 'Browse & Select', desc: 'Explore our catalog of 50+ edible oil products across 12 categories with live pricing.' },
  { step: '02', icon: ClipboardList, title: 'Request Quote', desc: 'Submit your requirements with quantity, packaging preference, and delivery location for a customized quote.' },
  { step: '03', icon: Truck, title: 'We Dispatch', desc: 'Orders are processed within 24 hours with real-time tracking from our nearest warehouse.' },
  { step: '04', icon: CheckCircle2, title: 'Delivered & Verified', desc: 'Receive your order with quality certificates, GST invoice, and damage-free delivery guarantee.' },
];

const HomeProcess = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.process-step',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.6, stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );
      gsap.fromTo('.process-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power2.inOut',
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
          <span className="badge-emerald mb-4 inline-flex">How It Works</span>
          <h2 className="section-title text-[var(--color-primary)] mb-4">
            Simple, Scalable Ordering
          </h2>
          <p className="section-subtitle mx-auto">
            From browse to delivery — our streamlined process ensures you get premium oils fast and hassle-free.
          </p>
        </div>

        <div className="relative">
          {/* Connection line (desktop) */}
          <div className="process-line hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 origin-left"
            style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-primary))' }} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="process-step text-center relative">
                  {/* Step number circle */}
                  <div className="relative w-20 h-20 mx-auto mb-5">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-mid)] flex items-center justify-center shadow-xl relative z-10">
                      <Icon size={32} className="text-[var(--color-accent)]" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-xs font-extrabold text-white shadow-md z-20">
                      {item.step}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-lg mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs mx-auto">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeProcess;

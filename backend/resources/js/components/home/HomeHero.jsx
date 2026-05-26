import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Truck } from 'lucide-react';
import gsap from 'gsap';

const HomeHero = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered text entrance
      gsap.fromTo('.hero-tag',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo('.hero-heading',
        { opacity: 0, y: 50, clipPath: 'inset(100% 0 0 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power4.out', delay: 0.4 }
      );
      gsap.fromTo('.hero-desc',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.9 }
      );
      gsap.fromTo('.hero-buttons',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1.1 }
      );
      gsap.fromTo('.hero-trust',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 1.4 }
      );

      // Image reveal
      gsap.fromTo('.hero-image-wrapper',
        { opacity: 0, scale: 1.08, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: 'power3.out', delay: 0.3 }
      );

      // Parallax on scroll
      gsap.to('.hero-image-wrapper', {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <div className="hero-image-wrapper absolute inset-0">
          <img
            ref={imageRef}
            src="/images/hero-oil.png"
            alt="Premium golden mustard oil"
            className="w-full h-full object-cover"
            style={{ objectPosition: '60% center' }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0"
            style={{
              background: 'linear-gradient(105deg, rgba(10,31,18,0.95) 0%, rgba(13,43,26,0.88) 35%, rgba(13,43,26,0.55) 65%, rgba(13,43,26,0.3) 100%)',
            }}
          />
        </div>
      </div>

      {/* Subtle animated grain overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 z-[1]" />

      {/* Top gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 z-20"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }}
      />

      {/* Content */}
      <div className="section-container relative z-10 w-full py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          {/* Tag */}
          <div className="hero-tag inline-flex items-center gap-2 py-2 px-5 rounded-full mb-8"
            style={{
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              backdropFilter: 'blur(10px)',
            }}>
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="text-[var(--color-accent)] text-sm font-semibold tracking-wide">
              India's Trusted Oil Supply Network
            </span>
          </div>

          {/* Heading */}
          <h1 className="hero-heading mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            <span className="block text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.08] tracking-tight">
              Premium Edible Oils,
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight mt-2">
              <span className="text-gradient-gold">Delivered Fresh.</span>
            </span>
          </h1>

          {/* Description */}
          <p className="hero-desc text-gray-300/90 text-base md:text-lg lg:text-xl max-w-lg leading-relaxed mb-10">
            From households to commercial kitchens — premium mustard, sunflower & soybean oils with wholesale pricing across 25+ states.
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/products"
              className="btn-accent flex items-center justify-center text-base py-3.5 px-8 gap-2 group">
              Explore Products
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/products"
              className="btn-glass flex items-center justify-center text-base py-3.5 px-8">
              Get Wholesale Quote
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="hero-trust flex flex-wrap items-center gap-6">
            {[
              { icon: Shield, text: 'FSSAI Certified' },
              { icon: Award, text: 'ISO 22000' },
              { icon: Truck, text: '24hr Dispatch' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                    }}>
                    <Icon size={14} className="text-[var(--color-accent)]" />
                  </div>
                  <span className="text-sm text-gray-400 font-medium">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-background)] to-transparent z-10" />

      {/* Floating stats pill — visible on large screens */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="hidden xl:flex absolute right-12 bottom-32 z-20 items-center gap-6 py-4 px-8 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212, 175, 55, 0.15)',
        }}
      >
        {[
          { value: '5,000+', label: 'Retailers' },
          { value: '25+', label: 'States' },
          { value: '1,000+', label: 'Monthly Orders' },
        ].map((stat, i) => (
          <div key={i} className={`text-center ${i > 0 ? 'pl-6 border-l border-white/10' : ''}`}>
            <div className="text-xl font-extrabold text-[var(--color-accent)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default HomeHero;

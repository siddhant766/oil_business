import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HomeContactCTA = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cta-content',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" id="contact">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/products-lineup.png"
          alt="Premium oil products"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(10,31,18,0.94) 0%, rgba(13,43,26,0.92) 40%, rgba(30,82,52,0.88) 100%)' }}
        />
      </div>

      {/* Glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20"
        style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.3) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 bg-grid-pattern opacity-15" />

      <div className="section-container relative z-10 py-24 md:py-32">
        <div className="cta-content max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Ready to Scale Your <span className="text-gradient-gold">Oil Supply?</span>
          </h2>
          <p className="text-gray-300/80 text-lg mb-10 max-w-xl mx-auto">
            Whether you need 10 tins or a full tanker — get customized pricing, dedicated support, and express delivery.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link to="/products" className="btn-accent flex items-center justify-center gap-2 py-3.5 px-8 text-base">
              Get Wholesale Quote <ArrowRight size={18} />
            </Link>
            <a href="tel:+919876543210" className="btn-glass flex items-center justify-center gap-2 py-3.5 px-8 text-base">
              <Phone size={18} /> Call Us Now
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-semibold text-green-400 transition-all hover:bg-green-500/10 border border-green-500/20">
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Online Support Available
            </span>
            <span>•</span>
            <span>24/7 Order Processing</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeContactCTA;

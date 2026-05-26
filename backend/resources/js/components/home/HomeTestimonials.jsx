import React, { useEffect, useRef, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Restaurant Chain Owner, Delhi',
    text: 'Premium Oils has been our sole supplier for 3 years. Consistent quality, on-time delivery, and unbeatable wholesale pricing. Their 15L tins are the gold standard.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Kirana Store Owner, Lucknow',
    text: 'Best margins in the market. Their delivery is reliable and they offer credit terms that no other distributor provides. My customers love the quality.',
    rating: 5,
  },
  {
    name: 'Amit Patel',
    role: 'Food Processing Unit, Ahmedabad',
    text: 'We order 200L drums monthly. The quality consistency batch-to-batch is remarkable. Their quality certificates and lab reports give us complete confidence.',
    rating: 5,
  },
  {
    name: 'Sunita Devi',
    role: 'Catering Business, Jaipur',
    text: 'Switched from local suppliers to Premium Oils last year. The difference in oil quality is night and day. Express dispatch means we never run out of stock.',
    rating: 4,
  },
  {
    name: 'Mohammed Farooq',
    role: 'Wholesale Distributor, Hyderabad',
    text: 'As a distributor, I need reliable supply and competitive pricing. Premium Oils delivers on both. Their account manager is always responsive.',
    rating: 5,
  },
];

const HomeTestimonials = () => {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.testimonial-container',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, []);

  const t = testimonials[activeIndex];

  return (
    <section ref={sectionRef} className="section-padding bg-gradient-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      <div className="section-container relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full mb-4 text-sm font-semibold"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--color-accent)' }}>
            Testimonials
          </span>
          <h2 className="section-title text-white mb-4">
            What Our Partners Say
          </h2>
        </div>

        <div className="testimonial-container max-w-3xl mx-auto">
          <div className="relative p-8 md:p-10 rounded-2xl" 
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
            }}>
            <Quote size={40} className="text-[var(--color-accent)]/30 absolute top-6 left-6" />
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < t.rating ? 'text-[var(--color-accent)] fill-[var(--color-accent)]' : 'text-gray-600'} />
                ))}
              </div>
              
              <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              
              <div>
                <p className="text-white font-bold text-base">{t.name}</p>
                <p className="text-gray-400 text-sm">{t.role}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button onClick={prev} className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <ChevronLeft size={20} className="text-white" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setActiveIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-[var(--color-accent)] w-6' : 'bg-white/20 hover:bg-white/40'}`} />
                ))}
              </div>
              <button onClick={next} className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <ChevronRight size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;

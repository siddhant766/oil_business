import React from 'react';

const BRANDS = [
  'Taj Hotels', 'Haldiram\'s', 'BigBasket', 'Reliance Retail', 'DMart',
  'ITC Hotels', 'Bikanervala', 'Metro Cash & Carry', 'JioMart', 'Swiggy Instamart',
  'Zomato Hyperpure', 'FMCG Partners',
];

const HomeTrustedBy = () => {
  return (
    <section className="py-12 bg-[var(--color-surface)] border-y border-gray-200/60 overflow-hidden">
      <div className="section-container mb-6">
        <p className="text-center text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">
          Trusted by leading brands & businesses across India
        </p>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--color-surface)] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--color-surface)] to-transparent z-10" />
        
        <div className="flex animate-marquee whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <div key={i} className="inline-flex items-center mx-8 md:mx-12">
              <span className="text-lg md:text-xl font-bold text-gray-400/60 hover:text-[var(--color-primary)] transition-colors duration-300 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-heading)' }}>
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTrustedBy;

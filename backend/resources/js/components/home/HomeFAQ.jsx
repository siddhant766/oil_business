import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: 'What is the minimum order quantity for wholesale buyers?',
    a: 'MOQ varies by product. For most cooking oils, the minimum wholesale order is 5-10 units (15L tins). For bulk industrial supply (200L drums / tanker), we offer customized MOQ based on your requirements.',
  },
  {
    q: 'Do you provide GST invoices and tax-compliant billing?',
    a: 'Yes, all orders come with proper GST invoices. We are a fully tax-compliant enterprise with valid GSTIN. We also support e-way bill generation for interstate shipments.',
  },
  {
    q: 'What certifications do your oils have?',
    a: 'All our products are FSSAI certified. Most of our range also carries AGMARK and ISO 22000 certifications. Organic products have USDA Organic and India Organic certifications. Lab test reports are available on request.',
  },
  {
    q: 'How fast is the delivery?',
    a: 'Standard dispatch within 24-48 hours from our nearest warehouse. We have 8+ warehouses strategically located across India. Express dispatch available for urgent orders. Tanker supply requires 5-7 days lead time.',
  },
  {
    q: 'Do you offer credit terms for regular buyers?',
    a: 'Yes, verified wholesale buyers and distributors can avail 15-30 day credit terms based on their order history and volume. A credit application can be submitted through your account manager.',
  },
  {
    q: 'Can I become a distributor for Premium Oils?',
    a: 'Absolutely! We are actively expanding our distributor network. Benefits include exclusive regional pricing, marketing support, priority stock allocation, and dedicated account management. Contact us for onboarding details.',
  },
  {
    q: 'Do you support export orders?',
    a: 'Yes, select products in our Premium Export Oils and Organic Oils categories are export-ready with international certifications. We handle export documentation, packaging compliance, and FOB/CIF pricing.',
  },
];

const FAQItem = ({ faq, index, isOpen, toggle }) => {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between py-5 px-5 text-left group hover:bg-gray-50/50 transition-colors rounded-lg"
      >
        <span className="flex items-center gap-3 pr-4">
          <span className="text-xs font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/10 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-semibold text-gray-900 text-sm md:text-base group-hover:text-[var(--color-primary)] transition-colors">
            {faq.q}
          </span>
        </span>
        <ChevronDown
          size={20}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--color-accent)]' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 pl-16 text-sm text-[var(--color-text-muted)] leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HomeFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.faq-container',
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

  return (
    <section ref={sectionRef} className="section-padding bg-white">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="badge-emerald mb-4 inline-flex">
            <HelpCircle size={14} className="mr-1" /> FAQ
          </span>
          <h2 className="section-title text-[var(--color-primary)] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="section-subtitle mx-auto">
            Everything you need to know about ordering, wholesale pricing, and distribution partnership.
          </p>
        </div>

        <div className="faq-container max-w-3xl mx-auto">
          <div className="premium-card overflow-hidden">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                toggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;

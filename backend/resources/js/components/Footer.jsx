import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Globe, MessageCircle, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #070f0b 0%, #0d1a12 50%, #0a1510 100%)' }}>
      
      {/* Top gradient line */}
      <div className="h-1" style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-primary))' }} />
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] opacity-10"
        style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.3) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          
          {/* Brand Column */}
          <div>
            <Link to="/" className="inline-block mb-5">
              <span className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                <span className="text-white">Premium</span>
                <span className="text-[var(--color-accent)]">Oils</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              India's most trusted edible oil distribution platform. Supplying premium quality oils to retailers, hotels, and businesses across 25+ states.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 transition-all hover:text-white hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Globe size={16} />
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 transition-all hover:text-green-400 hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'About Us' },
                { to: '/products', label: 'All Products' },
                { to: '/products', label: 'Wholesale Pricing' },
                { to: '/products', label: 'Bulk Orders' },
                { to: '/#contact', label: 'Contact Us' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-[var(--color-accent)] transition-colors flex items-center gap-1 group">
                    <ArrowRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">For Business</h4>
            <ul className="space-y-3">
              {[
                'Distributor Program',
                'Franchise Partnership',
                'Industrial Supply',
                'Export Enquiry',
                'Credit Application',
              ].map((label, i) => (
                <li key={i}>
                  <Link to="/products" className="text-sm text-gray-400 hover:text-[var(--color-accent)] transition-colors flex items-center gap-1 group">
                    <ArrowRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">123 Industrial Area, Phase 2, New Delhi, India 110020</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[var(--color-accent)] flex-shrink-0" />
                <span className="text-sm text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[var(--color-accent)] flex-shrink-0" />
                <span className="text-sm text-gray-400">sales@premiumoils.com</span>
              </li>
            </ul>
            
            <div className="mt-5 p-3.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">GSTIN</p>
              <p className="text-sm font-mono text-white/80">07AABCT1234F1Z5</p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-xs text-gray-500">© 2026 Premium Oils. All Rights Reserved. FSSAI Licensed.</p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Rupay-Logo.png/800px-Rupay-Logo.png" alt="RuPay" className="h-5 opacity-30 grayscale hover:grayscale-0 hover:opacity-60 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/UPI-Logo.png/1200px-UPI-Logo.png" alt="UPI" className="h-5 opacity-30 grayscale hover:grayscale-0 hover:opacity-60 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

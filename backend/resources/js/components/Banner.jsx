import React from 'react';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div className="bg-[var(--color-primary-light)] text-white border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col sm:flex-row items-center justify-center text-center text-xs sm:text-sm font-medium tracking-wide">
          <span>GST Certified Edible Oil Distributor</span>
          <span className="hidden sm:inline mx-3 opacity-50">|</span>
          <span className="hidden sm:inline">Bulk Orders Available</span>
          <span className="hidden sm:inline mx-3 opacity-50">|</span>
          <span className="text-[var(--color-accent)] sm:text-white mt-1 sm:mt-0">COD Supported</span>
        </div>
      </div>
    </div>
  );
};

export default Banner;

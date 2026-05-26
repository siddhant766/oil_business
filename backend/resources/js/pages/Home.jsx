import React from 'react';
import { Helmet } from 'react-helmet-async';
import WhatsAppButton from '../components/WhatsAppButton';

// Import Home Sections
import HomeHero from '../components/home/HomeHero';
import HomeTrustedBy from '../components/home/HomeTrustedBy';
import HomeCategories from '../components/home/HomeCategories';
import HomeBestSellers from '../components/home/HomeBestSellers';
import HomeWhyChooseUs from '../components/home/HomeWhyChooseUs';
import HomeProcess from '../components/home/HomeProcess';
import HomeTestimonials from '../components/home/HomeTestimonials';
import HomeContactCTA from '../components/home/HomeContactCTA';

const Home = () => {
  return (
    <div className="w-full relative">
      <Helmet>
        <title>Premium Oils — India's Trusted B2B Edible Oil Supply Network</title>
        <meta name="description" content="India's leading B2B & B2C edible oil distribution platform. Premium mustard oil, refined soybean oil, and bulk edible oils with wholesale pricing across 25+ states." />
        <meta name="keywords" content="edible oil wholesale, mustard oil distributor, bulk cooking oil, B2B oil supply, premium oils India, wholesale oil supplier" />
      </Helmet>
      
      <WhatsAppButton />

      {/* 1. Cinematic Full-Screen Hero */}
      <HomeHero />
      
      {/* 2. Trusted By Brands */}
      <HomeTrustedBy />
      
      {/* 3. Product Categories */}
      <HomeCategories />
      
      {/* 4. Best Selling Products */}
      <HomeBestSellers />
      
      {/* 5. Why Choose Us */}
      <HomeWhyChooseUs />
      
      {/* 6. How It Works */}
      <HomeProcess />

      {/* 7. Testimonials */}
      <HomeTestimonials />
      
      {/* 8. CTA Banner */}
      <HomeContactCTA />
    </div>
  );
};

export default Home;

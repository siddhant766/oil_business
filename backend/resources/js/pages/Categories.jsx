import React from 'react';
import { Helmet } from 'react-helmet-async';
import HomeCategories from '../components/home/HomeCategories';

const Categories = () => {
  return (
    <div className="pt-10 pb-12 bg-[var(--color-surface)] min-h-screen">
      <Helmet>
        <title>Categories — Premium Oils</title>
      </Helmet>
      <HomeCategories />
    </div>
  );
};

export default Categories;

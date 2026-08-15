import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Process from '../components/Process';
import Footer from '../components/Footer';
import Modals from '../components/Modals';
import { useStorefrontLogic } from '../hooks/useStorefrontLogic';
import '../../user.css';

export default function Storefront() {
  useStorefrontLogic();

  return (
    <>
      <Header />
      <Hero />
      <ProductGrid />
      <Process />
      <Footer />
      <Modals />
    </>
  );
}

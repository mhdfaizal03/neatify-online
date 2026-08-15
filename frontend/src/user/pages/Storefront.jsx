import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Process from '../components/Process';
import ProductGrid from '../components/ProductGrid';
import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';
import '../../user.css';

export default function Storefront() {
  return (
    <>
      <Header />
      <Hero />
      <ProductGrid />
      <Process />
      <Footer />
      <CartDrawer />
    </>
  );
}

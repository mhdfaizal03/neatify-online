import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";

export default function Header() {
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const openCart = () => {
    // We will handle drawer state locally or via Zustand, for now let's dispatch a custom event
    window.dispatchEvent(new Event("openCart"));
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/hero.png" alt="Logo" className="h-8 w-8 object-contain" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Neatify
          </h1>
        </div>
        
        <button
          onClick={openCart}
          className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white transform translate-x-1 -translate-y-1">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

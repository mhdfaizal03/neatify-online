import React, { useState, useEffect } from "react";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, updateQty, removeItem, getCartTotal } = useCartStore();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("openCart", handleOpen);
    return () => window.removeEventListener("openCart", handleOpen);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Your Cart
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-white">
                      <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                        <img src={item.image || "/assets/placeholder.png"} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-2">{item.name}</h4>
                          <div className="text-sm font-bold text-blue-600 mt-1">${item.price}</div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                            <button onClick={() => updateQty(item.id, item.qty - 1)} className="text-gray-500 hover:text-gray-900 p-1">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="text-gray-500 hover:text-gray-900 p-1">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 font-medium hover:underline">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-2xl font-extrabold text-gray-900">${getCartTotal()}</span>
                </div>
                
                <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-colors shadow-md">
                  Checkout Now <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

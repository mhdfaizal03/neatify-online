import React from "react";
import { useProducts } from "../../hooks/useProducts";
import { useCartStore } from "../../store/useCartStore";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function ProductGrid() {
  const { data: response, isLoading, isError } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100">
        Failed to load services. Please try again later.
      </div>
    );
  }

  const products = response?.data || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Our Services</h3>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No services available right now.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={product._id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                {product.badge && (
                  <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-gradient-to-r from-orange-400 to-rose-400 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {product.badge}
                  </div>
                )}
                <img
                  src={product.image || "/assets/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
                  {product.category}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                  {product.name}
                </h4>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <div className="text-xl font-extrabold text-gray-900">
                    ${product.price}
                  </div>
                  
                  <button
                    onClick={() => addItem(product)}
                    className="flex items-center justify-center bg-gray-900 hover:bg-blue-600 text-white p-2 rounded-xl transition-colors shadow-sm hover:shadow-md"
                    aria-label="Add to cart"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

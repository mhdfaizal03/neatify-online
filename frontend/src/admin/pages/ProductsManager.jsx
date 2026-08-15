import React from "react";
import { useProducts } from "../../hooks/useProducts";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function ProductsManager() {
  const { data: response, isLoading } = useProducts();
  const products = response?.data || [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Products</h2>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading products...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">Product</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Category</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Price</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                      <img src={product.image || "/assets/placeholder.png"} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </td>
                  <td className="p-4 text-gray-600">{product.category}</td>
                  <td className="p-4 font-semibold text-gray-900">${product.price}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

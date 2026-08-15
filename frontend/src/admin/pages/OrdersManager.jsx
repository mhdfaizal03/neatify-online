import React from "react";
import { Search } from "lucide-react";

export default function OrdersManager() {
  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Manage Orders</h2>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-semibold text-gray-600 text-sm">Order ID</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Customer</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Date</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Total</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td colSpan="5" className="p-8 text-center text-gray-500">
                Integration with Order API pending...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

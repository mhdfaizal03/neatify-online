import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from './Dashboard';
import ProductsManager from './ProductsManager';
import OrdersManager from './OrdersManager';

export default function Admin() {
  // In a real app, we'd check useAuthStore for admin role here
  
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductsManager />} />
          <Route path="/orders" element={<OrdersManager />} />
        </Routes>
      </div>
    </div>
  );
}

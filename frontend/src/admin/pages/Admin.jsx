import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Dashboard from './Dashboard';
import ProductsManager from './ProductsManager';
import OrdersManager from './OrdersManager';
import '../../admin.css';

export default function Admin() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductsManager />} />
            <Route path="/orders" element={<OrdersManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

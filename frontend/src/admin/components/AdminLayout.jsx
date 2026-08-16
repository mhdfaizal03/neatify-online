import React from 'react';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminMedia from './AdminMedia';
import AdminOrders from './AdminOrders';
import AdminSubscribers from './AdminSubscribers';
import AdminSettings from './AdminSettings';
import AdminCategories from './AdminCategories';
import AdminModals from './AdminModals';
import { useAdminLogic } from '../hooks/useAdminLogic';
import '../../admin.css';

export default function AdminLayout() {
  useAdminLogic();

  return (
    <>
      <div className="sidebar-overlay" id="sidebarOverlay"></div>
      <AdminLogin />
      
      <div id="mainApp" className="admin-app hidden">
        <AdminSidebar />
        
        <div className="main-wrap">
          <AdminTopbar />
          
          <main className="content">
            <AdminDashboard />
            <AdminProducts />
            <AdminCategories />
            <AdminMedia />
            <AdminOrders />
            <AdminSubscribers />
            <AdminSettings />
          </main>
        </div>
      </div>
      
      <AdminModals />
    </>
  );
}

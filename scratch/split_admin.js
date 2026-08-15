const fs = require('fs');

const html = fs.readFileSync('scratch/old_code/admin/index.html', 'utf8');

function extractBetween(str, startToken, endToken) {
  const start = str.indexOf(startToken);
  if (start === -1) return '';
  const end = str.indexOf(endToken, start);
  if (end === -1) return str.substring(start);
  return str.substring(start, end);
}

const loginHtml = extractBetween(html, '<!-- Login View -->', '<!-- Main Application View -->');
const sidebarHtml = extractBetween(html, '<!-- Sidebar Navigation -->', '<!-- Top Header Bar -->');
const topbarHtml = extractBetween(html, '<!-- Top Header Bar -->', '<!-- Main Scrollable Content -->');
const dashboardHtml = extractBetween(html, '<!-- View: Dashboard -->', '<!-- View: Products -->');
const productsHtml = extractBetween(html, '<!-- View: Products -->', '<!-- View: Media -->');
const mediaHtml = extractBetween(html, '<!-- View: Media -->', '<!-- View: Orders -->');
const ordersHtml = extractBetween(html, '<!-- View: Orders -->', '<!-- View: Subscribers -->');
const subscribersHtml = extractBetween(html, '<!-- View: Subscribers -->', '<!-- View: Settings -->');
const settingsHtml = extractBetween(html, '<!-- View: Settings -->', '</main>');
const modalsHtml = extractBetween(html, '<!-- MODAL: Add/Edit Product -->', '<!-- Global Snackbar -->') + 
                   extractBetween(html, '<!-- Global Snackbar -->', '<!-- Admin Application Scripts -->');


function toJSX(str) {
  return str
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/tabindex=/g, 'tabIndex=')
    .replace(/autocomplete=/g, 'autoComplete=')
    .replace(/aria-hidden=/g, 'aria-hidden=')
    .replace(/aria-label=/g, 'aria-label=')
    .replace(/aria-live=/g, 'aria-live=')
    .replace(/aria-atomic=/g, 'aria-atomic=')
    .replace(/aria-pressed=/g, 'aria-pressed=')
    .replace(/aria-controls=/g, 'aria-controls=')
    .replace(/aria-labelledby=/g, 'aria-labelledby=')
    .replace(/<!--[\s\S]*?-->/g, '') // remove comments
    .replace(/<(input|img|br|hr|meta|link)([^>]*?)(?<!\/)>/g, '<$1$2 />'); // self close
}

function createComponent(name, content) {
  const jsxContent = toJSX(content);
  const code = `import React from 'react';

export default function ${name}() {
  return (
    <>
      ${jsxContent.trim()}
    </>
  );
}
`;
  fs.writeFileSync(`frontend/src/admin/components/${name}.jsx`, code);
}

createComponent('AdminLogin', loginHtml);
createComponent('AdminSidebar', sidebarHtml);
createComponent('AdminTopbar', topbarHtml);
createComponent('AdminDashboard', dashboardHtml);
createComponent('AdminProducts', productsHtml);
createComponent('AdminMedia', mediaHtml);
createComponent('AdminOrders', ordersHtml);
createComponent('AdminSubscribers', subscribersHtml);
createComponent('AdminSettings', settingsHtml);
createComponent('AdminModals', modalsHtml);

const layoutCode = `import React from 'react';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminMedia from './AdminMedia';
import AdminOrders from './AdminOrders';
import AdminSubscribers from './AdminSubscribers';
import AdminSettings from './AdminSettings';
import AdminModals from './AdminModals';
import { useAdminLogic } from '../hooks/useAdminLogic';

export default function AdminLayout() {
  useAdminLogic();

  return (
    <>
      <div className="sidebar-overlay" id="sidebarOverlay"></div>
      <AdminLogin />
      
      <div id="mainApp" className="app-layout hidden">
        <AdminSidebar />
        
        <div className="main-content">
          <AdminTopbar />
          
          <main className="admin-main">
            <AdminDashboard />
            <AdminProducts />
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
`;
fs.writeFileSync('frontend/src/admin/components/AdminLayout.jsx', layoutCode);
console.log("Admin components generated!");

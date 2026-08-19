import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Storefront from './user/pages/Storefront'
import ProductDetails from './user/pages/ProductDetails'
import AdminLayout from './admin/components/AdminLayout'

// If Admin is logged in, they can't go to storefront (redirect to /admin)
function StorefrontGuard({ children }) {
  const isAdminLoggedIn = !!localStorage.getItem("neatify_token");
  if (isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

// If User/Customer is logged in, they can't go to admin (redirect to /)
function AdminGuard({ children }) {
  const isAdminLoggedIn = !!localStorage.getItem("neatify_token");
  const isUserLoggedIn = !!localStorage.getItem("neatify-token");
  
  // If they are an admin, allow them in (breaks infinite redirect loop if both tokens exist)
  if (isAdminLoggedIn) {
    return children;
  }
  
  if (isUserLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<StorefrontGuard><Storefront /></StorefrontGuard>} />
      <Route path="/product/:id" element={<StorefrontGuard><ProductDetails /></StorefrontGuard>} />
      <Route path="/admin/*" element={<AdminGuard><AdminLayout /></AdminGuard>} />
    </Routes>
  )
}

export default App

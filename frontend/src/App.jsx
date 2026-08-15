import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Storefront from './user/pages/Storefront'
import AdminLayout from './admin/components/AdminLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Storefront />} />
      <Route path="/admin/*" element={<AdminLayout />} />
    </Routes>
  )
}

export default App

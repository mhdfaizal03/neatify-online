import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Storefront from './user/pages/Storefront'
import Admin from './admin/pages/Admin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Storefront />} />
      <Route path="/admin/*" element={<Admin />} />
    </Routes>
  )
}

export default App

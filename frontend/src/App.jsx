import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Storefront from './pages/Storefront'
import Admin from './pages/Admin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Storefront />} />
      <Route path="/admin/*" element={<Admin />} />
    </Routes>
  )
}

export default App

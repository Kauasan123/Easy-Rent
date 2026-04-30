import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LadingPage from './Pages/LadingPage'
import TelaLogin from './Pages/TelaLogin'
import TelaRegistro from './Pages/TelaRegistro'
import Principal from './Pages/Principal'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LadingPage />} />
        <Route path="/login" element={<TelaLogin />} />
        <Route path="/registro" element={<TelaRegistro />} />
        <Route path="/principal" element={<Principal />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
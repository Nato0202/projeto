import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ScannerPage from './pages/ScannerPage'
import './index.css'

function App() {
  return (
    <>
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16, fontFamily: 'system-ui, Arial' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Leitor de QR Code</h1>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/">Início</Link>
          <Link to="/scanner">Scanner</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scanner" element={<ScannerPage />} />
      </Routes>
      <footer style={{ marginTop: 32, fontSize: 12, color: '#666' }}>
        Feito com React + ZXing
      </footer>
    </div>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

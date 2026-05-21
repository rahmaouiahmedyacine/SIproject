import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from './services/supabaseClient'
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mock_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSelectRole = (role) => {
    const email = role === 'buyer' ? 'buyer@tawat.com' : 'seller@tawat.com'
    const mockUser = {
      id: role === 'buyer' ? '11111111-1111-1111-1111-111111111111' : '22222222-2222-2222-2222-222222222222',
      email,
      user_metadata: { full_name: role === 'buyer' ? 'Buyer User' : 'Seller User' }
    }
    setUser(mockUser)
    localStorage.setItem('mock_user', JSON.stringify(mockUser))
  }

  // Font loading from snippet
  useEffect(() => {
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;600;700;800;900&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)
  }, [])

  if (loading) return null

  const isAdmin = user?.email === "rayahmedyacine@gmail.com"

  return (
    <div className="app-root">
      <Routes>
        <Route path="/" element={<Welcome user={user} onSelectRole={handleSelectRole} />} />
        
        {/* Buyer Routes */}
        <Route path="/home" element={<Home user={user} />} />
        
        {/* Admin/Seller Routes */}
        <Route path="/dashboard/*" element={
          user ? <Dashboard user={user} /> : <Navigate to="/" replace />
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App

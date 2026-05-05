import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from './services/supabaseClient'
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check current user on mount
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

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
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <Welcome />} />
        <Route path="/auth" element={user ? <Navigate to="/home" replace /> : <Auth />} />
        <Route path="/signup" element={<Navigate to="/auth" replace />} />
        
        {/* Buyer Routes */}
        <Route path="/home" element={
          user ? (isAdmin ? <Navigate to="/dashboard" replace /> : <Home user={user} />) : <Navigate to="/auth" replace />
        } />
        
        {/* Admin Routes */}
        <Route path="/dashboard/*" element={
          user ? (isAdmin ? <Dashboard user={user} /> : <Navigate to="/home" replace />) : <Navigate to="/auth" replace />
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App

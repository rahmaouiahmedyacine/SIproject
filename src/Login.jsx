import React, { useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState(null)
  const navigate = useNavigate()

  const submit = async (e) =>{
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({email,password})
    setLoading(false)
    if(error) setError(error.message)
    else navigate('/')
  }

  return (
    <div style={{maxWidth:420,margin:'24px auto'}}>
      <form className="form" onSubmit={submit}>
        <h3>Login</h3>
        {error && <div style={{color:'red'}}>{error}</div>}
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{marginTop:12}}>
          <button className="btn" disabled={loading}>{loading? 'Please wait...' : 'Login'}</button>
          <Link to="/signup" style={{marginLeft:12}}>Sign up</Link>
        </div>
      </form>
    </div>
  )
}

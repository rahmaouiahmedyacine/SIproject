import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useTranslation } from 'react-i18next'
import { icons, Ico } from '../components/Icons'
import Spinner from '../components/Spinner'

export default function Auth() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const setLang = (l) => i18n.changeLanguage(l)
  const [mode, setMode] = useState("login")
  const [form, setForm] = useState({ email: "", password: "", name: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/home'
  const dir = lang === "ar" ? "rtl" : "ltr"

  const handleSubmit = async () => {
    if (!form.email || !form.password) return
    setLoading(true); setError("")
    try {
      let result
      if (mode === "login") {
        result = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
      } else {
        result = await supabase.auth.signUp({ 
          email: form.email, 
          password: form.password, 
          options: { data: { full_name: form.name } } 
        })
      }
      if (result.error) {
        setError(result.error.message || "Authentication failed")
        setLoading(false)
        return
      }
      navigate(redirectPath)
    } catch (e) {
      setError("Connection error. Check your Supabase config.")
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: lang === "ar" ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 60, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50%, #6366f115, transparent 70%)" }} />
        <div style={{ position: "relative", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#0ea5e9,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 20px 40px rgba(99,102,241,0.35)" }}>
            <Ico d={icons.home} size={32} color="#fff" />
          </div>
          <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 900, marginBottom: 12 }}>{t('appName')}</h2>
          <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: 14 }}>{t('tagline')}</p>
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
            {[["Admin:", "rayahmedyacine@gmail.com"], ["User:", lang === "ar" ? "أي بريد إلكتروني" : "Any other email"]].map(([l, v]) => (
              <div key={l} style={{ background: "#ffffff0a", border: "1px solid #ffffff12", borderRadius: 12, padding: "10px 18px", textAlign: "left" }}>
                <div style={{ color: "#64748b", fontSize: 11 }}>{l}</div>
                <div style={{ color: "#e2e8f0", fontSize: 12, fontFamily: "monospace", marginTop: 3 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: "#030712", display: "flex", alignItems: "center", justifyContent: "center", padding: 60, direction: dir, position: "relative", zIndex: 10 }}>
        <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 20 }}>
          <div style={{ display: "flex", justifyContent: lang === "ar" ? "flex-end" : "flex-start", marginBottom: 24 }}>
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="btn-ghost" style={{ padding: "7px 14px", fontSize: 13 }}>
              <Ico d={icons.globe} size={14} color="#94a3b8" />{t('lang')}
            </button>
          </div>
          <div style={{ display: "flex", background: "#111827", borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {[["login", t('login')], ["signup", t('signup')]].map(([m, l]) => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", background: mode === m ? "linear-gradient(135deg,#0ea5e9,#6366f1)" : "transparent", color: mode === m ? "#fff" : "#64748b", fontFamily: "inherit", fontWeight: 700, fontSize: 14, transition: "all 0.2s" }}>{l}</button>
            ))}
          </div>
          <h3 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{mode === "login" ? t('welcome') : t('createAccount')}</h3>
          {error && <div style={{ background: "#ef444418", border: "1px solid #ef444444", borderRadius: 10, padding: "10px 14px", color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{error}</div>}
          {mode === "signup" && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 6 }}>{t('fullName')}</label>
              <input className="input-field" placeholder={t('fullName')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ fontFamily: "inherit", direction: dir }} />
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 6 }}>{t('email')}</label>
            <input className="input-field" type="email" placeholder="example@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ fontFamily: "inherit", direction: "ltr" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 6 }}>{t('password')}</label>
            <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ fontFamily: "inherit", direction: "ltr" }} />
          </div>
          <button onClick={handleSubmit} className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 15, padding: "14px" }} disabled={loading}>
            {loading ? <Spinner /> : mode === "login" ? t('login') : t('signup')}
          </button>
        </div>
      </div>
    </div>
  )
}

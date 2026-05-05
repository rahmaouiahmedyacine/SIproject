import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { icons, Ico } from '../components/Icons'

export default function Welcome() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language
  const setLang = (l) => i18n.changeLanguage(l)

  return (
    <div style={{ minHeight: "100vh", background: "#030712", fontFamily: lang === "ar" ? "'Cairo', sans-serif" : "'Inter', sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 20% 50%, #0ea5e918 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #6366f118 0%, transparent 50%)" }} />
      <nav style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #0ea5e9, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ico d={icons.home} size={20} color="#fff" />
          </div>
          <span style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>{t('appName')}</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="btn-ghost" style={{ padding: "8px 14px" }}>
            <Ico d={icons.globe} size={14} color="#94a3b8" />{t('lang')}
          </button>
          <button onClick={() => navigate('/auth')} className="btn-primary">{t('login')}</button>
        </div>
      </nav>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", padding: "100px 20px 60px", position: "relative", zIndex: 5 }}>
        <div className="fade-in" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0ea5e912", border: "1px solid #0ea5e930", borderRadius: 999, padding: "8px 20px", marginBottom: 32, color: "#38bdf8", fontSize: 14 }}>
          <Ico d={icons.shield} size={14} color="#38bdf8" />{t('tagline')}
        </div>
        <h1 className="slide-up" style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", fontWeight: 900, color: "#fff", marginBottom: 24, lineHeight: 1.1 }}>
          {lang === "ar" ? <>ابحث عن منزل<br /><span style={{ background: "linear-gradient(90deg, #0ea5e9, #6366f1)", WebkitBackgroundClip: "text", WebkitFillColor: "transparent" }}>أحلامك في الجزائر</span></> : <>Find Your Dream<br /><span style={{ background: "linear-gradient(90deg, #0ea5e9, #6366f1)", WebkitBackgroundClip: "text", WebkitFillColor: "transparent" }}>Home in Algeria</span></>}
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 18, margin: "0 auto 48px", lineHeight: 1.8, maxWidth: 500 }}>
          {lang === "ar" ? "آلاف العقارات في كل ولايات الجزائر. ابحث، تصفّح، وتواصل مع الملاك بكل أمان." : "Thousands of properties across Algeria's wilayas. Search, browse, and connect with owners safely."}
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate('/auth')} className="btn-primary" style={{ fontSize: 16, padding: "15px 36px" }}>{t('start')} <Ico d={icons.arrowRight} size={18} color="#fff" /></button>
          <button className="btn-ghost" style={{ fontSize: 16, padding: "15px 36px" }}>{t('learnMore')}</button>
        </div>
        <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 80, flexWrap: "wrap" }}>
          {[["48+", lang === "ar" ? "ولاية" : "Wilayas"], ["1000+", lang === "ar" ? "عقار" : "Properties"], ["100%", lang === "ar" ? "آمن" : "Secure"]].map(([n, l]) => (
            <div key={n} style={{ textAlign: "center" }}>
              <div style={{ color: "#38bdf8", fontSize: 34, fontWeight: 900 }}>{n}</div>
              <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

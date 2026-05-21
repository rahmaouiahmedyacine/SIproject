import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { icons, Ico } from '../components/Icons'
import { supabase } from '../services/supabaseClient'
import Spinner from '../components/Spinner'

export default function Welcome({ user, onSelectRole }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language
  const setLang = (l) => i18n.changeLanguage(l)
  const [loading, setLoading] = useState(false)

  const handleSelectRole = (role) => {
    onSelectRole(role)
    if (role === 'buyer') {
      navigate('/home')
    } else {
      navigate('/dashboard')
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#030712", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: lang === "ar" ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}>
        <Spinner />
        <p style={{ color: "#94a3b8", marginTop: 20, fontSize: 16 }}>
          {lang === "ar" ? "جاري تحضير حسابك..." : "Preparing your account..."}
        </p>
      </div>
    )
  }

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
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>{t('hi')}, {user.email?.split('@')[0]}</span>
              <button onClick={() => { localStorage.removeItem('mock_user'); window.location.reload(); }} className="btn-ghost" style={{ padding: "8px 14px" }}>
                <Ico d={icons.logout} size={14} color="#94a3b8" />{t('logout')}
              </button>
            </div>
          )}
        </div>
      </nav>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", padding: "80px 20px 60px", position: "relative", zIndex: 5 }}>
        <div className="fade-in" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0ea5e912", border: "1px solid #0ea5e930", borderRadius: 999, padding: "8px 20px", marginBottom: 32, color: "#38bdf8", fontSize: 14 }}>
          <Ico d={icons.shield} size={14} color="#38bdf8" />{t('tagline')}
        </div>
        <h1 className="slide-up" style={{ fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)", fontWeight: 900, color: "#fff", marginBottom: 20, lineHeight: 1.15 }}>
          {lang === "ar" ? <>ابحث عن منزل<br /><span style={{ background: "linear-gradient(90deg, #0ea5e9, #6366f1)", WebkitBackgroundClip: "text", WebkitFillColor: "transparent" }}>أحلامك في الجزائر</span></> : <>Find Your Dream<br /><span style={{ background: "linear-gradient(90deg, #0ea5e9, #6366f1)", WebkitBackgroundClip: "text", WebkitFillColor: "transparent" }}>Home in Algeria</span></>}
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 17, margin: "0 auto 40px", lineHeight: 1.8, maxWidth: 550 }}>
          {lang === "ar" ? "تصفح آلاف العقارات بدون تسجيل دخول، أو اعرض عقارك للبيع والكراء بسهولة." : "Browse thousands of properties without logging in, or easily list your properties for sale and rent."}
        </p>
        
        {/* Selector Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 720, margin: "0 auto", padding: "0 10px" }}>
          {/* Buyer Selector Card */}
          <div 
            onClick={() => handleSelectRole('buyer')}
            style={{ 
              background: "#0f172aa0", 
              border: "1px solid #0ea5e930", 
              borderRadius: 24, 
              padding: "32px 24px", 
              textAlign: "center", 
              cursor: "pointer", 
              transition: "transform 0.3s, border-color 0.3s, box-shadow 0.3s",
              boxShadow: "0 15px 35px rgba(0,0,0,0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.borderColor = "#0ea5e980";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(14,165,233,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#0ea5e930";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.3)";
            }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#0ea5e915", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: "1px solid #0ea5e930" }}>
              <Ico d={icons.search} size={24} color="#0ea5e9" />
            </div>
            <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
              {lang === "ar" ? "تصفح كـ مشتري" : "I am a Buyer"}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, marginBottom: 24, minHeight: 68 }}>
              {lang === "ar" ? "تصفح العقارات المتاحة للبيع أو الكراء، وابحث في كافة الولايات بكل سهولة وبدون حساب." : "Browse available properties for sale or rent across all wilayas easily without an account."}
            </p>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#38bdf8", fontWeight: 700, fontSize: 14 }}>
              {lang === "ar" ? "تصفح العقارات كزائر" : "Browse Properties"} <Ico d={icons.arrowRight} size={15} color="#38bdf8" />
            </span>
          </div>

          {/* Seller Selector Card */}
          <div 
            onClick={() => handleSelectRole('seller')}
            style={{ 
              background: "#0f172aa0", 
              border: "1px solid #6366f130", 
              borderRadius: 24, 
              padding: "32px 24px", 
              textAlign: "center", 
              cursor: "pointer", 
              transition: "transform 0.3s, border-color 0.3s, box-shadow 0.3s",
              boxShadow: "0 15px 35px rgba(0,0,0,0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.borderColor = "#6366f180";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(99,102,241,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#6366f130";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.3)";
            }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#6366f115", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: "1px solid #6366f130" }}>
              <Ico d={icons.home} size={24} color="#6366f1" />
            </div>
            <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
              {lang === "ar" ? "دخول كـ بائع" : "I am a Seller"}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, marginBottom: 24, minHeight: 68 }}>
              {lang === "ar" ? "أعلن عن عقارك للبيع أو الكراء، وتواصل مع المشترين، وقم بإدارة طلبات الزيارة الخاصة بك." : "List your property for sale or rent, connect with buyers, and manage your visit requests."}
            </p>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#818cf8", fontWeight: 700, fontSize: 14 }}>
              {lang === "ar" ? "إعلان عقار جديد" : "List a Property"} <Ico d={icons.arrowRight} size={15} color="#818cf8" />
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
          {[["48+", lang === "ar" ? "ولاية" : "Wilayas"], ["1000+", lang === "ar" ? "عقار" : "Properties"], ["100%", lang === "ar" ? "آمن" : "Secure"]].map(([n, l]) => (
            <div key={n} style={{ textAlign: "center" }}>
              <div style={{ color: "#38bdf8", fontSize: 30, fontWeight: 900 }}>{n}</div>
              <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

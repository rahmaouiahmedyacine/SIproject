import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useTranslation } from 'react-i18next'
import { icons, Ico } from '../components/Icons'
import Spinner from '../components/Spinner'
import PropertyCard from '../components/property/PropertyCard'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'

const WILAYAS = Array.from({ length: 48 }, (_, i) => (i + 1).toString())

export default function Home({ user }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language
  const setLang = (l) => i18n.changeLanguage(l)
  const [tab, setTab] = useState("properties")
  const [properties, setProperties] = useState([])
  const [visits, setVisits] = useState([])
  const [filters, setFilters] = useState({ type: "all", wilaya: "all", search: "", status: "all" })
  const [loading, setLoading] = useState(true)
  const dir = lang === "ar" ? "rtl" : "ltr"

  useEffect(() => {
    loadData()
  }, [user, tab])

  const loadData = async () => {
    setLoading(true)
    let allProps = []
    let myVis = []
    try {
      const { data: props } = await supabase.from("properties").select("*")
      if (props) allProps = props
      if (user) {
        const { data: vis } = await supabase.from("visits").select("*").eq('buyer_id', user.id)
        if (vis) myVis = vis
      }
    } catch (e) {
      console.warn("Supabase fetch failed in Home, using local fallbacks:", e)
    }
    const localProps = JSON.parse(localStorage.getItem('local_properties') || '[]')
    const localVis = user ? JSON.parse(localStorage.getItem('local_visits') || '[]').filter(v => v.buyer_id === user.id) : []
    setProperties([...localProps, ...allProps])
    setVisits([...localVis, ...myVis])
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('mock_user')
    window.location.href = '/'
  }

  const normalizeType = (t) => {
    if (!t) return ""
    return t.toLowerCase().replace(/_/g, "").replace(/\s+/g, "")
  }

  const normalizeStatus = (s) => {
    if (!s) return ""
    const norm = s.toLowerCase().replace(/[^a-z]/g, "")
    if (norm === "sale") return "forsale"
    if (norm === "rent") return "forrent"
    return norm
  }

  const filtered = useMemo(() => properties.filter(p => {
    if (filters.type !== "all" && normalizeType(p.type) !== normalizeType(filters.type)) return false
    if (filters.status !== "all" && normalizeStatus(p.status) !== normalizeStatus(filters.status)) return false
    if (filters.wilaya !== "all" && p.location !== filters.wilaya) return false
    if (filters.search) {
      const s = filters.search.toLowerCase()
      const titleMatch = p.title?.toLowerCase().includes(s)
      const wilayaMatch = t(`wilayas.${p.location}`)?.toLowerCase().includes(s)
      if (!titleMatch && !wilayaMatch) return false
    }
    return true
  }), [properties, filters, t])

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "#e2e8f0", fontFamily: lang === "ar" ? "'Cairo', sans-serif" : "'Inter', sans-serif", direction: dir }}>
      {/* Nav */}
      <nav style={{ background: "#0f172a", borderBottom: "1px solid #1f2937", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#0ea5e9,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => navigate('/')}>
            <Ico d={icons.home} size={17} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, cursor: "pointer" }} onClick={() => navigate('/')}>{t('appName')}</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[["properties", icons.home, t('properties')], ["myvisits", icons.calendar, t('myVisits')]].map(([tb, ic, lb]) => (
            <button key={tb} onClick={() => setTab(tb)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13, background: tab === tb ? "#1e293b" : "transparent", color: tab === tb ? "#38bdf8" : "#64748b", transition: "all 0.2s" }}>
              <Ico d={ic} size={15} color={tab === tb ? "#38bdf8" : "#64748b"} />{lb}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="btn-ghost" style={{ padding: "7px 12px", fontSize: 12 }}>
            <Ico d={icons.globe} size={13} color="#94a3b8" />{t('lang')}
          </button>
          
          {user ? (
            <>
              <button onClick={() => navigate('/dashboard')} className="btn-ghost" style={{ padding: "7px 12px", fontSize: 12, color: "#38bdf8", fontWeight: 600 }}>
                <Ico d={icons.plus} size={13} color="#38bdf8" /> {lang === "ar" ? "لوحة البائع" : "Seller Panel"}
              </button>
              <span style={{ color: "#64748b", fontSize: 13 }}>{t('hi')}, {user?.email?.split('@')[0]}</span>
              <button onClick={handleLogout} className="btn-ghost" style={{ padding: "7px 14px", fontSize: 12 }}>
                <Ico d={icons.logout} size={13} color="#94a3b8" />{t('logout')}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: "7px 16px", fontSize: 12 }}>
                {lang === "ar" ? "اختيار دور (بائع/مشتري)" : "Select Role (Buyer/Seller)"}
              </button>
            </>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 20px" }}>
        {tab === "myvisits" && (
          <div className="fade-in">
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>{t('myVisits')}</h2>
            {!user ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#0f172a", border: "1px solid #1f2937", borderRadius: 20, maxWidth: 500, margin: "40px auto 0" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#6366f115", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: "1px solid #6366f130" }}>
                  <Ico d={icons.calendar} size={24} color="#6366f1" />
                </div>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
                  {lang === "ar" ? "سجل دخول لمشاهدة زياراتك" : "Login to view your visits"}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                  {lang === "ar" ? "يتعين عليك تسجيل الدخول لعرض قائمة المواعيد وطلبات الزيارة التي قمت بتقديمها." : "You must log in to view your scheduled appointments and visit requests."}
                </p>
                <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: "10px 24px" }}>
                  {lang === "ar" ? "تسجيل الدخول / اختيار دور" : "Login / Choose Role"}
                </button>
              </div>
            ) : visits.length === 0 ? (
              <div style={{ textAlign: "center", color: "#64748b", padding: 80 }}>{t('noVisits')}</div>
            ) : (
              <div style={{ display: "grid", gap: 14 }}>
                {visits.map(v => (
                  <div key={v.id} style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 14, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{properties.find(p => p.id === v.property_id)?.title || "Property"}</div>
                      <div style={{ color: "#64748b", fontSize: 13, display: "flex", gap: 14 }}>
                        <span>📅 {v.visit_date}</span><span>🕐 {v.visit_time}</span>
                      </div>
                    </div>
                    <StatusBadge status={v.status} t={t} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "properties" && (
          <div className="fade-in">
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{t('properties')}</h2>
              <p style={{ color: "#64748b", fontSize: 14 }}>{filtered.length} {lang === "ar" ? "عقار متاح" : "properties"}</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
              <input className="input-field" style={{ maxWidth: 260, fontFamily: "inherit", direction: dir }} placeholder={t('searchPlaceholder')} value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
              <select className="input-field" style={{ width: "auto", fontFamily: "inherit" }} value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
                <option value="all">{t('allStatus')}</option>
                <option value="for_sale">{t('forSale')}</option>
                <option value="for_rent">{t('forRent')}</option>
              </select>
              <select className="input-field" style={{ width: "auto", fontFamily: "inherit" }} value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
                <option value="all">{t('allTypes')}</option>
                <option value="apartment">{t('apartment')}</option>
                <option value="villa">{t('villa')}</option>
                <option value="studio">{t('studio')}</option>
              </select>
              <select className="input-field" style={{ width: "auto", fontFamily: "inherit" }} value={filters.wilaya} onChange={e => setFilters({ ...filters, wilaya: e.target.value })}>
                <option value="all">{t('allWilayas')}</option>
                {WILAYAS.map(w => <option key={w} value={w}>{t(`wilayas.${w}`)}</option>)}
              </select>
            </div>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner /></div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: 22 }}>
                {filtered.map(p => (
                  <PropertyCard key={p.id} property={p} user={user} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

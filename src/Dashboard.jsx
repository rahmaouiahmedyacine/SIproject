import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useTranslation } from 'react-i18next'
import { icons, Ico } from '../components/Icons'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import AddPropertyForm from './AddPropertyForm'

export default function Dashboard({ user }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language
  const setLang = (l) => i18n.changeLanguage(l)
  const [tab, setTab] = useState("overview")
  const [properties, setProperties] = useState([])
  const [visits, setVisits] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)
  const dir = lang === "ar" ? "rtl" : "ltr"

  useEffect(() => {
    if (user) loadData()
  }, [user])

  const loadData = async () => {
    setLoading(true)
    const { data: props } = await supabase.from("properties").select("*").eq('owner_id', user.id)
    const { data: vis } = await supabase.from("visits").select("*").eq('owner_id', user.id)
    if (props) setProperties(props)
    if (vis) setVisits(vis)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const deleteProperty = async (id) => {
    if (!window.confirm(t('deleteConfirm'))) return
    await supabase.from("properties").delete().eq('id', id)
    setProperties(p => p.filter(x => x.id !== id))
  }

  const updateVisit = async (id, status) => {
    await supabase.from("visits").update({ status }).eq('id', id)
    setVisits(v => v.map(x => x.id === id ? { ...x, status } : x))
  }

  const fmt = (n) => new Intl.NumberFormat(lang === "ar" ? "fr-DZ" : "en-US").format(n) + " DA"

  const stats = [
    { label: t('totalProperties'), value: properties.length, color: "#0ea5e9" },
    { label: t('visitRequests'), value: visits.length, color: "#6366f1" },
    { label: t('pendingReq'), value: visits.filter(v => v.status === "pending").length, color: "#f59e0b" },
    { label: t('acceptedReq'), value: visits.filter(v => v.status === "accepted").length, color: "#10b981" },
  ]

  const tabs = [["overview", icons.star, t('overview')], ["properties", icons.home, t('properties')], ["visits", icons.calendar, t('visitRequests')]]

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "#e2e8f0", fontFamily: lang === "ar" ? "'Cairo', sans-serif" : "'Inter', sans-serif", direction: dir, display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: 230, background: "#0f172a", borderLeft: dir === "rtl" ? "none" : "1px solid #1f2937", borderRight: dir === "rtl" ? "1px solid #1f2937" : "none", display: "flex", flexDirection: "column", padding: "18px 0", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "0 18px 20px", borderBottom: "1px solid #1f2937", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#0ea5e9,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico d={icons.shield} size={17} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{t('adminPanel')}</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>{user?.email?.split('@')[0]}</div>
            </div>
          </div>
        </div>
        {tabs.map(([tb, ic, lb]) => (
          <button key={tb} onClick={() => setTab(tb)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", border: "none", background: tab === tb ? "#1e293b" : "transparent", color: tab === tb ? "#38bdf8" : "#64748b", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13, borderRight: dir === "rtl" && tab === tb ? "3px solid #0ea5e9" : dir === "rtl" ? "3px solid transparent" : "none", borderLeft: dir === "ltr" && tab === tb ? "3px solid #0ea5e9" : dir === "ltr" ? "3px solid transparent" : "none", transition: "all 0.2s", width: "100%", textAlign: dir === "rtl" ? "right" : "left" }}>
            <Ico d={ic} size={16} color={tab === tb ? "#38bdf8" : "#64748b"} />{lb}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: "0 10px", display: "flex", flexDirection: "column", gap: 6 }}>
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", border: "none", background: "transparent", color: "#64748b", cursor: "pointer", fontFamily: "inherit", fontSize: 13, width: "100%" }}>
            <Ico d={icons.globe} size={16} color="#64748b" />{t('lang')}
          </button>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", border: "none", background: "transparent", color: "#64748b", cursor: "pointer", fontFamily: "inherit", fontSize: 13, width: "100%" }}>
            <Ico d={icons.logout} size={16} color="#64748b" />{t('logout')}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: 28, overflowY: "auto", minHeight: "100vh" }}>
        {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spinner /></div> : (
          <>
            {tab === "overview" && (
              <div className="fade-in">
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 22 }}>{t('overview')}</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 28 }}>
                  {stats.map(s => (
                    <div key={s.label} style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 16, padding: 20 }}>
                      <div style={{ color: "#64748b", fontSize: 12, marginBottom: 8 }}>{s.label}</div>
                      <div style={{ color: s.color, fontSize: 34, fontWeight: 900 }}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>{t('latVisits')}</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {visits.slice(0, 4).map(v => (
                    <div key={v.id} style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{properties.find(p => p.id === v.property_id)?.title || "Property"}</div>
                        <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{v.visit_date} — {v.visit_time}</div>
                      </div>
                      <StatusBadge status={v.status} t={t} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "properties" && (
              <div className="fade-in">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800 }}>{t('properties')}</h2>
                    <p style={{ color: "#64748b", fontSize: 13, marginTop: 3 }}>{properties.length} total</p>
                  </div>
                  <button onClick={() => setShowAdd(true)} className="btn-primary">
                    <Ico d={icons.plus} size={16} color="#fff" />{t('addProperty')}
                  </button>
                </div>
                <div style={{ display: "grid", gap: 14 }}>
                  {properties.map(p => (
                    <div key={p.id} style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 16, padding: "14px 18px", display: "flex", gap: 14, alignItems: "center" }}>
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.title} style={{ width: 76, height: 56, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 76, height: 56, background: "#1e293b", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Ico d={icons.image} size={22} color="#334155" />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{p.title}</div>
                        <div style={{ color: "#64748b", fontSize: 12 }}>{t(`wilayas.${p.location}`)}</div>
                        <div style={{ color: "#38bdf8", fontWeight: 700, fontSize: 14, marginTop: 4 }}>{fmt(p.price)}</div>
                      </div>
                      <button onClick={() => deleteProperty(p.id)} style={{ background: "#ef444418", border: "1px solid #ef444440", borderRadius: 10, padding: "8px 11px", color: "#ef4444", cursor: "pointer" }}>
                        <Ico d={icons.trash} size={15} color="#ef4444" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "visits" && (
              <div className="fade-in">
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 22 }}>{t('visitRequests')}</h2>
                <div style={{ display: "grid", gap: 14 }}>
                  {visits.map(v => (
                    <div key={v.id} style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 16, padding: "18px 22px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: v.status === "pending" ? 12 : 0 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{properties.find(p => p.id === v.property_id)?.title || "Property"}</div>
                          <div style={{ color: "#94a3b8", fontSize: 12 }}>📅 {v.visit_date} — 🕐 {v.visit_time}</div>
                        </div>
                        <StatusBadge status={v.status} t={t} />
                      </div>
                      {v.status === "pending" && (
                        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                          <button onClick={() => updateVisit(v.id, "accepted")} style={{ background: "#10b98118", border: "1px solid #10b98140", borderRadius: 10, padding: "7px 18px", color: "#10b981", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                            <Ico d={icons.check} size={14} color="#10b981" />{t('accept')}
                          </button>
                          <button onClick={() => updateVisit(v.id, "rejected")} style={{ background: "#ef444418", border: "1px solid #ef444440", borderRadius: 10, padding: "7px 18px", color: "#ef4444", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                            <Ico d={icons.x} size={14} color="#ef4444" />{t('reject')}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showAdd && (
        <Modal onClose={() => setShowAdd(false)}>
           <AddPropertyForm onClose={() => { setShowAdd(false); loadData(); }} user={user} />
        </Modal>
      )}
    </div>
  )
}

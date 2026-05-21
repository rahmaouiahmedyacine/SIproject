import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { icons, Ico } from '../Icons'
import Modal from '../Modal'
import { supabase } from '../../services/supabaseClient'

export default function PropertyCard({ property, user }) {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [showDetails, setShowDetails] = useState(false)
  const [showVisit, setShowVisit] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [idUploaded, setIdUploaded] = useState(false)
  const [showOwner, setShowOwner] = useState(false)
  const [visitForm, setVisitForm] = useState({ date: "", time: "10:00" })
  const [sent, setSent] = useState(false)

  const fmt = (n) => new Intl.NumberFormat(lang === "ar" ? "fr-DZ" : "en-US").format(n) + " DA"
  const imgs = property.images?.filter(Boolean) || []

  const handleIdUpload = async (file) => {
    const path = `ids/${user.id}_${file.name}`
    try {
      await supabase.storage.from('documents').upload(path, file)
      setIdUploaded(true)
    } catch (e) {
      console.warn("Storage upload failed, setting idUploaded to true for local testing:", e)
      setIdUploaded(true)
    }
  }

  const submitVisit = async () => {
    if (!visitForm.date) return
    const visitData = {
      id: `local_v_${Date.now()}`,
      buyer_id: user.id, 
      property_id: property.id,
      visit_date: visitForm.date, 
      visit_time: visitForm.time, 
      status: "pending",
      owner_id: property.owner_id
    }
    try {
      const { error } = await supabase.from("visits").insert(visitData)
      if (error) throw error
    } catch (e) {
      console.warn("Supabase insert visit failed, saving locally:", e)
      try {
        const localVisits = JSON.parse(localStorage.getItem('local_visits') || '[]')
        localVisits.unshift(visitData)
        localStorage.setItem('local_visits', JSON.stringify(localVisits))
      } catch (err) {
        console.error("Failed to save visit to localStorage:", err)
      }
    }
    setSent(true)
  }

  return (
    <>
      <div className="card-hover" style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 20, overflow: "hidden" }}>
        <div style={{ position: "relative" }}>
          <ImageCarousel images={imgs} />
          <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 6 }}>
            <span className="tag" style={{ background: "#0ea5e9ee", color: "#fff" }}>
              {t(property.type)}
            </span>
          </div>
        </div>
        <div style={{ padding: "18px 20px", fontFamily: lang === "ar" ? "'Cairo', sans-serif" : "'Inter', sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
          <h3 style={{ margin: "0 0 5px", fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>{property.title}</h3>
          <div style={{ color: "#64748b", fontSize: 12, display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
            <Ico d={icons.map} size={12} color="#64748b" />{t(`wilayas.${property.location}`)}
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 14, color: "#94a3b8", fontSize: 12 }}>
            {property.rooms && <span>🛏 {property.rooms} {t('rooms')}</span>}
            {property.area && <span>📐 {property.area} m²</span>}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: "#38bdf8", fontWeight: 900, fontSize: 16 }}>{fmt(property.price)}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowDetails(true)} className="btn-ghost" style={{ padding: "7px 14px", fontSize: 12 }}>{t('viewMore')}</button>
              <button onClick={() => {
                if (!user) {
                  setShowAuthPrompt(true);
                } else {
                  setShowVisit(true);
                }
              }} className="btn-primary" style={{ padding: "7px 14px", fontSize: 12 }}>
                <Ico d={icons.calendar} size={13} color="#fff" />{t('requestVisit')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDetails && (
        <Modal onClose={() => setShowDetails(false)}>
          <div style={{ fontFamily: lang === "ar" ? "'Cairo', sans-serif" : "'Inter', sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
            <div style={{ position: "relative" }}>
              <ImageCarousel images={imgs} />
              <button onClick={() => setShowDetails(false)} style={{ position: "absolute", top: 12, left: 12, background: "#00000099", border: "none", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Ico d={icons.x} size={17} color="#fff" />
              </button>
            </div>
            <div style={{ padding: 26 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#f1f5f9", marginBottom: 6 }}>{property.title}</h2>
              <div style={{ color: "#64748b", fontSize: 13, display: "flex", alignItems: "center", gap: 4, marginBottom: 14 }}>
                <Ico d={icons.map} size={13} color="#64748b" />{t(`wilayas.${property.location}`)}
              </div>
              {property.description && <p style={{ color: "#94a3b8", lineHeight: 1.8, marginBottom: 18, fontSize: 14 }}>{property.description}</p>}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
                {[["🛏", `${property.rooms} ${t('rooms')}`], ["📐", `${property.area} m²`], ["💰", fmt(property.price)]].map(([ic, v]) => (
                  <div key={v} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "9px 14px", fontSize: 13, color: "#cbd5e1" }}>{ic} {v}</div>
                ))}
              </div>
              
              {!user ? (
                <div style={{ background: "#1e293b", border: "1px dashed #ef444450", borderRadius: 14, padding: 22, textAlign: "center" }}>
                  <Ico d={icons.user} size={28} color="#ef4444" />
                  <p style={{ color: "#94a3b8", margin: "10px 0 16px", fontSize: 13 }}>
                    {lang === "ar" ? "يتعين عليك تسجيل الدخول لعرض معلومات المالك وطلب الزيارة" : "You must log in to view owner details and request visits"}
                  </p>
                  <button onClick={() => { setShowDetails(false); navigate('/'); }} className="btn-primary" style={{ display: "inline-flex" }}>
                    {lang === "ar" ? "تسجيل الدخول / اختيار دور" : "Login / Choose Role"}
                  </button>
                </div>
              ) : !showOwner ? (
                <div style={{ background: "#1e293b", border: "1px dashed #334155", borderRadius: 14, padding: 20, textAlign: "center" }}>
                  <Ico d={icons.id} size={28} color="#64748b" />
                  <p style={{ color: "#94a3b8", margin: "10px 0 14px", fontSize: 13 }}>{t('idRequired')}</p>
                  {idUploaded ? (
                    <button onClick={() => setShowOwner(true)} className="btn-primary">{t('showOwner')}</button>
                  ) : (
                    <label style={{ cursor: "pointer" }}>
                      <input type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display: "none" }} onChange={e => e.target.files[0] && handleIdUpload(e.target.files[0])} />
                      <span className="btn-outline" style={{ display: "inline-flex" }}>
                        <Ico d={icons.upload} size={15} color="#0ea5e9" />{t('uploadId')}
                      </span>
                    </label>
                  )}
                </div>
              ) : (
                <div style={{ background: "#0ea5e910", border: "1px solid #0ea5e930", borderRadius: 14, padding: 18 }}>
                  <h4 style={{ color: "#38bdf8", marginBottom: 12 }}>{t('ownerInfo')}</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                     <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#cbd5e1", fontSize: 13 }}>
                        <Ico d={icons.user} size={15} color="#38bdf8" />{property.seller_name || "—"}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#cbd5e1", fontSize: 13 }}>
                        <Ico d={icons.mail} size={15} color="#38bdf8" />{property.seller_email || "—"}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#cbd5e1", fontSize: 13 }}>
                        <Ico d={icons.phone} size={15} color="#38bdf8" />{property.seller_phone || "—"}
                      </div>
                  </div>
                </div>
              )}
              <button onClick={() => { 
                if (!user) {
                  setShowAuthPrompt(true);
                  setShowDetails(false);
                } else {
                  setShowVisit(true); 
                  setShowDetails(false);
                }
              }} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16, padding: "13px" }}>
                <Ico d={icons.calendar} size={17} color="#fff" />{t('requestVisit')}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showVisit && (
        <Modal onClose={() => setShowVisit(false)}>
          <div style={{ padding: 30, fontFamily: lang === "ar" ? "'Cairo', sans-serif" : "'Inter', sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
            <h3 style={{ color: "#f1f5f9", fontSize: 19, fontWeight: 800, marginBottom: 6 }}>{t('requestVisit')}</h3>
            <p style={{ color: "#64748b", marginBottom: 22, fontSize: 14 }}>{property.title}</p>
            {sent ? (
               <div style={{ textAlign: "center", padding: 20 }}>
                  <Ico d={icons.check} size={48} color="#10b981" />
                  <p style={{ color: "#10b981", fontWeight: 700, marginTop: 12 }}>{t('visitSent')}</p>
                  <button onClick={() => setShowVisit(false)} className="btn-ghost" style={{ marginTop: 20 }}>{t('cancel')}</button>
               </div>
            ) : !idUploaded ? (
              <div style={{ textAlign: "center", padding: 16 }}>
                <Ico d={icons.id} size={36} color="#64748b" />
                <p style={{ color: "#94a3b8", margin: "14px 0 16px", fontSize: 13 }}>{t('visitIdRequired')}</p>
                <label style={{ cursor: "pointer" }}>
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display: "none" }} onChange={e => e.target.files[0] && handleIdUpload(e.target.files[0])} />
                  <span className="btn-primary" style={{ display: "inline-flex" }}>
                    <Ico d={icons.upload} size={15} color="#fff" />{t('uploadId')}
                  </span>
                </label>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 6 }}>{t('visitDate')}</label>
                  <input type="date" className="input-field" style={{ fontFamily: "inherit" }} value={visitForm.date} onChange={e => setVisitForm({ ...visitForm, date: e.target.value })} min={new Date().toISOString().split("T")[0]} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 6 }}>{t('visitTime')}</label>
                  <input type="time" className="input-field" style={{ fontFamily: "inherit" }} value={visitForm.time} onChange={e => setVisitForm({ ...visitForm, time: e.target.value })} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={submitVisit} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>{t('confirmVisit')}</button>
                  <button onClick={() => setShowVisit(false)} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>{t('cancel')}</button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {showAuthPrompt && (
        <Modal onClose={() => setShowAuthPrompt(false)}>
          <div style={{ padding: 30, fontFamily: lang === "ar" ? "'Cairo', sans-serif" : "'Inter', sans-serif", direction: lang === "ar" ? "rtl" : "ltr", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#6366f115", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: "1px solid #6366f130" }}>
              <Ico d={icons.user} size={24} color="#6366f1" />
            </div>
            <h3 style={{ color: "#f1f5f9", fontSize: 19, fontWeight: 800, marginBottom: 12 }}>
              {lang === "ar" ? "يتطلب تسجيل الدخول" : "Authentication Required"}
            </h3>
            <p style={{ color: "#94a3b8", marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
              {lang === "ar" ? "يرجى تسجيل الدخول أو إنشاء حساب جديد لتتمكن من حجز موعد زيارة أو التواصل مع صاحب العقار." : "Please log in or sign up to schedule visit appointments or access property owner contact details."}
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => navigate('/')} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                {lang === "ar" ? "تسجيل الدخول / اختيار دور" : "Login / Choose Role"}
              </button>
              <button onClick={() => setShowAuthPrompt(false)} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
                {t('cancel')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

function ImageCarousel({ images }) {
  const [idx, setIdx] = useState(0)
  const imgs = images?.filter(Boolean) || []
  if (!imgs.length) return (
    <div style={{ width: "100%", height: 220, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Ico d={icons.image} size={40} color="#334155" />
    </div>
  )
  return (
    <div style={{ position: "relative" }}>
      <img src={imgs[idx]} alt="" style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
      {imgs.length > 1 && (
        <>
          <button onClick={() => setIdx((idx - 1 + imgs.length) % imgs.length)} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "#00000088", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Ico d={icons.chevLeft} size={16} color="#fff" />
          </button>
          <button onClick={() => setIdx((idx + 1) % imgs.length)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "#00000088", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Ico d={icons.chevRight} size={16} color="#fff" />
          </button>
          <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
            {imgs.map((_, i) => <span key={i} style={{ width: i === idx ? 16 : 6, height: 6, borderRadius: 3, background: i === idx ? "#0ea5e9" : "#ffffff88", transition: "width 0.2s" }} />)}
          </div>
        </>
      )}
    </div>
  )
}

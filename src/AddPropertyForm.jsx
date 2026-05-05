import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../services/supabaseClient'
import { icons, Ico } from '../components/Icons'
import Spinner from '../components/Spinner'

const WILAYAS = Array.from({ length: 48 }, (_, i) => (i + 1).toString())

export default function AddPropertyForm({ onClose, user }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [saving, setSaving] = useState(false)
  const [newProp, setNewProp] = useState({
    title: "", type: "apartment", status: "for_sale", location: "16", price: "", rooms: "", area: "", description: "", images: [],
    seller_name: "", seller_phone: "", seller_email: "", document_url: ""
  })
  const [savingDoc, setSavingDoc] = useState(false)
  const dir = lang === "ar" ? "rtl" : "ltr"

  const handleDocUpload = async (file) => {
    setSavingDoc(true)
    const path = `docs/${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage.from('documents').upload(path, file)
    if (error) {
      console.error("Doc upload error:", error)
      alert("Error uploading document: " + error.message)
    } else {
      const url = supabase.storage.from('documents').getPublicUrl(path).data.publicUrl
      setNewProp({ ...newProp, document_url: url })
    }
    setSavingDoc(false)
  }

  const addProperty = async () => {
    if (!newProp.title || !newProp.price) return
    setSaving(true)
    const { error } = await supabase.from("properties").insert({
      owner_id: user.id,
      title: newProp.title,
      location: newProp.location,
      price: Number(newProp.price),
      rooms: Number(newProp.rooms) || null,
      area: Number(newProp.area) || null,
      description: newProp.description,
      images: newProp.images,
      type: newProp.type,
      status: newProp.status,
      seller_name: newProp.seller_name,
      seller_phone: newProp.seller_phone,
      seller_email: newProp.seller_email,
      document_url: newProp.document_url
    })
    
    if (error) {
      console.error("Insert error:", error);
      alert("فشلت الإضافة: " + error.message);
    } else {
      onClose();
    }
    setSaving(false)
  }

  return (
    <div style={{ padding: 28, fontFamily: lang === "ar" ? "'Cairo', sans-serif" : "'Inter', sans-serif", direction: dir }}>
      <h3 style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 800, marginBottom: 22 }}>{t('addNew')}</h3>
      <div style={{ display: "grid", gap: 14 }}>
        <div>
          <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 5 }}>{t('propTitle')} *</label>
          <input className="input-field" style={{ fontFamily: "inherit" }} placeholder={lang === "ar" ? "مثال: شقة فاخرة في وهران" : "e.g. Luxury apartment in Oran"} value={newProp.title} onChange={e => setNewProp({ ...newProp, title: e.target.value })} />
        </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 5 }}>{t('propType')}</label>
              <select className="input-field" style={{ fontFamily: "inherit" }} value={newProp.type} onChange={e => setNewProp({ ...newProp, type: e.target.value })}>
                <option value="apartment">{t('apartment')}</option>
                <option value="villa">{t('villa')}</option>
                <option value="studio">{t('studio')}</option>
              </select>
            </div>
            <div>
              <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 5 }}>{t('propStatus')}</label>
              <select className="input-field" style={{ fontFamily: "inherit" }} value={newProp.status} onChange={e => setNewProp({ ...newProp, status: e.target.value })}>
                <option value="for_sale">{t('forSale')}</option>
                <option value="for_rent">{t('forRent')}</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 5 }}>{t('propWilaya')}</label>
            <select className="input-field" style={{ fontFamily: "inherit" }} value={newProp.location} onChange={e => setNewProp({ ...newProp, location: e.target.value })}>
              {WILAYAS.map(w => <option key={w} value={w}>{t(`wilayas.${w}`)}</option>)}
            </select>
          </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[[t('propPrice'), "price", "45000000"], [t('propRooms'), "rooms", "3"], [t('propArea'), "area", "120"]].map(([lb, k, ph]) => (
            <div key={k}>
              <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 5 }}>{lb}</label>
              <input type="number" className="input-field" style={{ fontFamily: "inherit" }} placeholder={ph} value={newProp[k]} onChange={e => setNewProp({ ...newProp, [k]: e.target.value })} />
            </div>
          ))}
        </div>
        <div>
          <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 5 }}>{t('propDesc')}</label>
          <textarea className="input-field" style={{ minHeight: 90, resize: "vertical", fontFamily: "inherit" }} value={newProp.description} onChange={e => setNewProp({ ...newProp, description: e.target.value })} />
        </div>
        <div>
          <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 8 }}>{t('propImages')}</label>
          <ImageUploader value={newProp.images} onChange={imgs => setNewProp({ ...newProp, images: imgs })} t={t} lang={lang} />
        </div>

        <div style={{ background: "#1e293b", borderRadius: 16, padding: 20, marginTop: 10 }}>
           <h4 style={{ color: "#38bdf8", fontSize: 14, fontWeight: 800, marginBottom: 12 }}>{t('ownerInfo')}</h4>
           <div style={{ display: "grid", gap: 10 }}>
              <input className="input-field" placeholder={t('fullName')} value={newProp.seller_name} onChange={e => setNewProp({ ...newProp, seller_name: e.target.value })} />
              <input className="input-field" placeholder={t('email')} value={newProp.seller_email} onChange={e => setNewProp({ ...newProp, seller_email: e.target.value })} />
              <input className="input-field" placeholder={t('phone')} value={newProp.seller_phone} onChange={e => setNewProp({ ...newProp, seller_phone: e.target.value })} />
           </div>
        </div>

        <div style={{ background: "#1e293b", border: newProp.document_url ? "1px solid #10b981" : "1px dashed #334155", borderRadius: 12, padding: 18, textAlign: "center" }}>
          <Ico d={newProp.document_url ? icons.check : icons.upload} size={24} color={newProp.document_url ? "#10b981" : "#64748b"} />
          <p style={{ color: newProp.document_url ? "#10b981" : "#64748b", margin: "6px 0 10px", fontSize: 12 }}>
            {newProp.document_url ? t('verified') : t('ownerDocs')}
          </p>
          <label style={{ cursor: "pointer" }}>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={e => e.target.files[0] && handleDocUpload(e.target.files[0])} />
            <span className="btn-ghost" style={{ display: "inline-flex", padding: "7px 14px", fontSize: 12 }}>
              {savingDoc ? <Spinner /> : t('chooseFile')}
            </span>
          </label>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={addProperty} className="btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={saving}>
            {saving ? <Spinner /> : t('addProperty')}
          </button>
          <button onClick={onClose} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>{t('cancel')}</button>
        </div>
      </div>
    </div>
  )
}

function ImageUploader({ value = [], onChange, t }) {
  const fileRef = useRef()
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (files) => {
    setUploading(true)
    const newUrls = []
    for (const file of files) {
      const path = `properties/${Date.now()}_${file.name}`
      const { data, error } = await supabase.storage.from('documents').upload(path, file)
      if (error) {
        console.error("Image upload error:", error)
        alert("Error uploading image: " + error.message)
      } else {
        newUrls.push(supabase.storage.from('documents').getPublicUrl(path).data.publicUrl)
      }
    }
    onChange([...value, ...newUrls])
    setUploading(false)
  }

  const remove = (i) => onChange(value.filter((_, idx) => idx !== i))

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
        {value.map((url, i) => (
          <div key={i} style={{ position: "relative", width: 80, height: 60 }}>
            <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8, border: "1px solid #334155" }} />
            <button onClick={() => remove(i)} style={{ position: "absolute", top: -6, right: -6, background: "#ef4444", border: "none", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Ico d={icons.x} size={10} color="#fff" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline" style={{ height: 60, minWidth: 80, flexDirection: "column", gap: 4, fontSize: 11, borderStyle: "dashed" }}>
          {uploading ? <Spinner /> : <><Ico d={icons.plus} size={18} color="#0ea5e9" /><span>{t('addImages')}</span></>}
        </button>
      </div>
      <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: "none" }} onChange={e => handleFiles(Array.from(e.target.files))} />
      {value.length > 0 && <p style={{ color: "#64748b", fontSize: 12 }}>{value.length} {t('imagesSelected')}</p>}
    </div>
  )
}

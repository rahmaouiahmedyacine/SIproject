import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../services/supabaseClient'
import { MapPin, Home, Bed, Info, Loader2, Calendar, Phone, Mail, User, ShieldCheck } from 'lucide-react'

export default function PropertyDetails({ user }) {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [visitDate, setVisitDate] = useState('')
  const [requestStatus, setRequestStatus] = useState(null)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    async function fetchDetails() {
      const { data, error } = await supabase.from('properties').select('*').eq('id', id).single()
      if (!error) setProperty(data)
      setLoading(false)
    }

    async function checkVerification() {
      if (!user) return
      const { data, error } = await supabase.from('users').select('id_verified').eq('id', user.id).single()
      if (!error && data) setIsVerified(data.id_verified)
    }

    fetchDetails()
    checkVerification()
  }, [id, user])

  const handleRequestVisit = async () => {
    if (!user) return alert(t('login_required'))
    if (!visitDate) return alert(t('select_date'))

    const { error } = await supabase.from('visits').insert([
      { property_id: id, buyer_id: user.id, visit_date: visitDate, status: 'pending' }
    ])

    if (error) setRequestStatus('error')
    else setRequestStatus('success')
  }

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#fffaf3]"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>
  if (!property) return <div className="text-center py-20 bg-[#fffaf3]">{t('property_not_found')}</div>

  return (
    <div className={`min-h-screen bg-[#fffaf3] px-4 py-8 ${isRtl ? 'dir-rtl' : ''}`}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link to="/home" className="text-sm font-medium text-slate-500 hover:text-blue-600">
            {isRtl ? '← العودة إلى العقارات' : '← Back to Properties'}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6 overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                <img src={property.images?.[0]} className="h-96 w-full object-cover rounded-2xl" alt="Main" />
                <div className="grid grid-cols-2 gap-2">
                   {property.images?.slice(1, 5).map((img, i) => (
                     <img key={i} src={img} className="h-47 w-full object-cover rounded-xl" alt={`Sub ${i}`} />
                   ))}
                </div>
              </div>
              <div className="p-8">
                <div className="mb-4 flex items-center justify-between">
                  <h1 className="text-3xl font-black text-slate-900">{property.title}</h1>
                  <span className={`rounded-full px-4 py-1 text-sm font-bold uppercase ${property.status === 'for_sale' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {t(property.status)}
                  </span>
                </div>

                <div className="mb-8 flex flex-wrap gap-6 border-b border-slate-100 pb-8 text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">{t(`wilayas.${property.location}`)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">{t(property.type)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">{property.rooms} {t('rooms')}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="mb-4 text-xl font-bold text-slate-800">{isRtl ? 'الوصف' : 'Description'}</h2>
                  <p className="leading-relaxed text-slate-600">{property.description}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-6">
                  <h2 className="mb-4 text-xl font-bold text-slate-800">{isRtl ? 'الموقع على الخريطة' : 'Map Location'}</h2>
                  <div className="h-64 w-full rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                    {/* Leaflet Map placeholder */}
                    <MapPin className="h-8 w-8" />
                    <span>{isRtl ? 'الخريطة التفاعلية ستظهر هنا' : 'Interactive Map Placeholder'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Request Card */}
            <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-100 sticky top-24">
              <div className="mb-6">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('price')}</div>
                <div className="text-3xl font-black text-blue-600">
                  {new Intl.NumberFormat().format(property.price)} <span className="text-lg font-medium text-slate-400">DZD</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">{isRtl ? 'اختر تاريخ الزيارة' : 'Choose Visit Date'}</label>
                  <div className="relative">
                    <Calendar className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} h-5 w-5 text-slate-400`} />
                    <input 
                      type="datetime-local" 
                      value={visitDate}
                      onChange={e => setVisitDate(e.target.value)}
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-3 ${isRtl ? 'pr-10' : 'pl-10'} text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleRequestVisit}
                  disabled={requestStatus === 'success'}
                  className={`w-full rounded-xl py-4 font-black text-white shadow-lg transition active:scale-95 ${requestStatus === 'success' ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {requestStatus === 'success' ? (isRtl ? 'تم إرسال الطلب' : 'Request Sent') : t('request_visit')}
                </button>
              </div>

              {/* Seller Info (Conditional) */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="mb-4 text-lg font-bold text-slate-800">{t('seller_info')}</h3>
                {isVerified ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-600">
                      <User className="h-5 w-5 text-blue-500" />
                      <span>{property.seller_name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Phone className="h-5 w-5 text-blue-500" />
                      <span>{property.seller_phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <span>{property.seller_email}</span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-orange-50 p-4 border border-orange-100">
                    <div className="flex items-start gap-3 text-orange-700">
                      <ShieldCheck className="h-10 w-10 mt-1" />
                      <p className="text-xs font-bold leading-relaxed">
                        {t('id_required_msg')}
                      </p>
                    </div>
                    <Link to="/dashboard/verify" className="mt-3 block text-center text-xs font-black uppercase text-orange-600 hover:underline">
                      {t('id_verification')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

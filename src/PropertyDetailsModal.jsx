import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../services/supabaseClient'
import { X, MapPin, Home, Bed, Info, Loader2, Calendar, Phone, Mail, User, ShieldCheck, CheckCircle2, ChevronRight, Maximize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PropertyDetailsModal({ property, user, onClose }) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  
  const [visitDate, setVisitDate] = useState('')
  const [requestStatus, setRequestStatus] = useState(null)
  const [isVerified, setIsVerified] = useState(false)
  const [showVisitPicker, setShowVisitPicker] = useState(false)
  const [uploadingId, setUploadingId] = useState(false)

  useEffect(() => {
    async function checkVerification() {
      if (!user) return
      const { data, error } = await supabase.from('users').select('id_verified').eq('id', user.id).single()
      if (!error && data) setIsVerified(data.id_verified)
    }
    checkVerification()
  }, [user])

  const handleIdUpload = async (e) => {
    setUploadingId(true)
    // Simulate ID upload for 2 seconds
    setTimeout(async () => {
      await supabase.from('users').update({ id_verified: true }).eq('id', user.id)
      setIsVerified(true)
      setUploadingId(false)
    }, 2000)
  }

  const handleRequestVisit = async () => {
    if (!user) return alert(t('login_required'))
    if (!visitDate) return alert(t('select_date'))

    const { error } = await supabase.from('visits').insert([
      { property_id: property.id, buyer_id: user.id, visit_date: visitDate, status: 'pending', owner_id: property.owner_id }
    ])

    if (!error) setRequestStatus('success')
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative h-full max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[3rem] bg-white shadow-2xl border border-white"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-10 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-white/40">
          <X className="h-6 w-6" />
        </button>

        <div className="flex h-full flex-col md:flex-row">
          {/* Left: Images (Scrollable) */}
          <div className="h-64 w-full md:h-full md:w-1/2 overflow-y-auto bg-slate-100 scrollbar-hide">
             {property.images?.map((img, i) => (
               <img key={i} src={img} className="h-full w-full object-cover" alt={`Prop ${i}`} />
             ))}
          </div>

          {/* Right: Details */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12">
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600">
                <Home className="h-4 w-4" />
                {t(property.type)} • {t(property.status)}
              </div>
              <h2 className="text-3xl font-black text-slate-900">{property.title}</h2>
              <div className="mt-2 flex items-center gap-2 text-slate-400">
                <MapPin className="h-4 w-4" />
                <span className="font-bold">{t(`wilayas.${property.location}`)}</span>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4">
               <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase">{t('price')}</div>
                  <div className="text-xl font-black text-blue-600">{new Intl.NumberFormat().format(property.price)} <span className="text-xs">DZD</span></div>
               </div>
               <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase">{t('rooms')}</div>
                  <div className="text-xl font-black text-slate-800">{property.rooms}</div>
               </div>
            </div>

            <div className="mb-8">
               <h3 className="mb-3 text-lg font-black text-slate-800">{isRtl ? 'عن العقار' : 'About Property'}</h3>
               <p className="leading-relaxed text-slate-500">{property.description}</p>
            </div>

            {/* Seller Info & Actions */}
            <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white">
               <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                 <User className="h-5 w-5 text-blue-400" />
                 {t('seller_info')}
               </h3>
               
               {isVerified ? (
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 text-slate-300">
                       <Phone className="h-5 w-5" />
                       <span className="font-bold">{property.seller_phone}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                       <Mail className="h-5 w-5" />
                       <span className="font-bold">{property.seller_email}</span>
                    </div>

                    {!requestStatus ? (
                      <div className="mt-8">
                         <button 
                           onClick={() => setShowVisitPicker(!showVisitPicker)}
                           className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-black transition hover:bg-blue-700 active:scale-95"
                         >
                           <Calendar className="h-5 w-5" />
                           {t('request_visit')}
                         </button>

                         <AnimatePresence>
                           {showVisitPicker && (
                             <motion.div 
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: 'auto', opacity: 1 }}
                               className="mt-4 overflow-hidden space-y-4"
                             >
                                <input 
                                  type="datetime-local" 
                                  value={visitDate}
                                  onChange={e => setVisitDate(e.target.value)}
                                  className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                                <button 
                                  onClick={handleRequestVisit}
                                  className="w-full rounded-2xl bg-white py-4 font-black text-slate-900 transition hover:bg-slate-100"
                                >
                                  {isRtl ? 'تأكيد طلب الزيارة' : 'Confirm Visit Request'}
                                </button>
                             </motion.div>
                           )}
                         </AnimatePresence>
                      </div>
                    ) : (
                      <div className="mt-8 rounded-2xl bg-emerald-500/10 p-4 text-center border border-emerald-500/20">
                         <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold">
                           <CheckCircle2 className="h-5 w-5" />
                           {isRtl ? 'الطلب قيد الانتظار' : 'Request Pending'}
                         </div>
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="rounded-2xl bg-white/5 p-4 border border-white/10 text-sm text-slate-400 leading-relaxed">
                       {t('id_required_msg')}
                    </div>
                    <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white py-4 font-black text-slate-900 transition hover:bg-slate-100">
                       {uploadingId ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                       {t('upload_id')}
                       <input type="file" onChange={handleIdUpload} className="hidden" />
                    </label>
                 </div>
               )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

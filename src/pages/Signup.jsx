import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, Loader2, ArrowLeft, UserPlus, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Signup() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else {
      alert(isRtl ? 'تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني.' : 'Account created successfully! Please check your email.')
      navigate('/auth')
    }
    setLoading(false)
  }

  return (
    <div className={`flex min-h-screen items-center justify-center bg-slate-50 p-4 selection:bg-blue-100 ${isRtl ? 'dir-rtl font-cairo' : 'font-inter'}`}>
      <div className="absolute inset-0 overflow-hidden">
         <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />
         <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md"
      >
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition">
          <ArrowLeft className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
          {isRtl ? 'العودة للرئيسية' : 'Back to home'}
        </Link>

        <div className="rounded-[2.5rem] bg-white p-10 shadow-2xl shadow-blue-900/5 border border-white">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-200">
               <UserPlus className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900">{isRtl ? 'إنشاء حساب جديد' : 'Create Account'}</h1>
            <p className="mt-2 text-slate-500">{isRtl ? 'انضم إلى مجتمع توات اليوم' : 'Join the Tawat community today'}</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">{isRtl ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <div className="relative">
                <Mail className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} h-5 w-5 text-slate-300`} />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 ${isRtl ? 'pr-12' : 'pl-12'} text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition`}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">{isRtl ? 'كلمة المرور' : 'Password'}</label>
              <div className="relative">
                <Lock className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} h-5 w-5 text-slate-300`} />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 ${isRtl ? 'pr-12' : 'pl-12'} text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100">
                {error}
              </div>
            )}

            <button 
              disabled={loading}
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-900 py-4 font-black text-white shadow-xl transition active:scale-95 disabled:bg-slate-300"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (isRtl ? 'تسجيل حساب' : 'Create Account')}
            </button>
          </form>

          <div className="mt-10 text-center">
             <p className="text-sm text-slate-500">
               {isRtl ? 'لديك حساب بالفعل؟' : "Already have an account?"}{' '}
               <Link to="/auth" className="font-black text-blue-600 hover:underline">{isRtl ? 'سجل دخولك' : 'Sign In'}</Link>
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../services/supabaseClient'
import { LogOut, User, Globe, LayoutDashboard } from 'lucide-react'

export default function Navbar({ user }){
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isRtl = i18n.language === 'ar'

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')

  return (
    <header className={`sticky top-0 z-40 border-b border-white/20 bg-white/70 backdrop-blur-xl ${isRtl ? 'dir-rtl font-cairo' : 'font-inter'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white shadow-lg shadow-blue-200 transition group-hover:scale-110">
               <span className="text-xl font-black italic">T</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">Tawat</span>
          </Link>
          
          <nav className="hidden items-center gap-1 md:flex">
             <NavLink to="/home" label={t('home')} isRtl={isRtl} />
             {user && <NavLink to="/dashboard" label={t('dashboard')} isRtl={isRtl} />}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-200"
          >
            <Globe className="h-4 w-4" />
            {i18n.language.toUpperCase()}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
               <div className="hidden flex-col items-end md:flex">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{isRtl ? 'حسابي' : 'Account'}</span>
                  <span className="text-sm font-bold text-slate-700">{user.email?.split('@')[0]}</span>
               </div>
               <button 
                 onClick={logout}
                 className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl transition hover:bg-slate-800 hover:scale-105 active:scale-95"
               >
                 <LogOut className="h-5 w-5" />
               </button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="rounded-2xl bg-blue-600 px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:scale-105 active:scale-95"
            >
              {t('login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

function NavLink({ to, label, isRtl }) {
  return (
    <Link 
      to={to} 
      className="rounded-2xl px-5 py-2 text-sm font-black text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
    >
      {label}
    </Link>
  )
}

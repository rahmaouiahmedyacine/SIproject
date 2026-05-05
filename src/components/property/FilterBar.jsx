import React from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const WILAYAS = Array.from({ length: 58 }, (_, i) => (i + 1).toString())

export default function FilterBar({ filters, setFilters }) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className={`mb-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-100 ${isRtl ? 'text-right' : 'text-left'}`}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">{t('type')}</label>
          <select 
            name="type" 
            value={filters.type} 
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          >
            <option value="all">{i18n.language === 'ar' ? 'الكل' : 'All'}</option>
            <option value="apartment">{t('apartment')}</option>
            <option value="villa">{t('villa')}</option>
            <option value="studio">{t('studio')}</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">{t('location')}</label>
          <select 
            name="location" 
            value={filters.location} 
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          >
            <option value="all">{i18n.language === 'ar' ? 'كل الولايات' : 'All Wilayas'}</option>
            {WILAYAS.map(w => (
              <option key={w} value={w}>{t(`wilayas.${w}`)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">{t('status')}</label>
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          >
            <option value="all">{i18n.language === 'ar' ? 'الكل' : 'All'}</option>
            <option value="for_sale">{t('for_sale')}</option>
            <option value="for_rent">{t('for_rent')}</option>
          </select>
        </div>

        <div className="flex items-end">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 shadow-md active:scale-95">
            <Search className="h-5 w-5" />
            {t('search')}
          </button>
        </div>
      </div>
    </div>
  )
}

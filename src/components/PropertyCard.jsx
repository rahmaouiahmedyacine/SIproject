import React from 'react'
import { Link } from 'react-router-dom'

export default function PropertyCard({ property }) {
  const img = property.images?.[0] || 'https://via.placeholder.com/400x300'
  return (
    <article className="overflow-hidden rounded-2xl border border-[#e1d2bf] bg-[#fffaf3] shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <img src={img} alt={property.title} className="h-44 w-full object-cover" />
      <div className="space-y-2 p-4">
        <h4 className="line-clamp-1 text-base font-bold text-[#3f2a1d]">{property.title}</h4>
        <p className="text-sm text-[#7b6656]">{property.type} • {property.rooms} rooms</p>
        <p className="text-lg font-bold text-[#8b5e34]">{property.price} DA</p>
        <Link to={`/property/${property.id}`} className="inline-flex rounded-full bg-gradient-to-r from-[#7d5532] to-[#a87443] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5">View</Link>
      </div>
    </article>
  )
}

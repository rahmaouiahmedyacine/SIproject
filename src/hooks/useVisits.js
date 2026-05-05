import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export function useVisits(userId) {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchVisits = async () => {
    try {
      setLoading(true)
      let query = supabase.from('visits').select(`
        *,
        properties:property_id (title, price, location)
      `)

      if (userId) {
        query = query.eq('buyer_id', userId)
      }

      const { data, error: fetchError } = await query
      if (fetchError) throw fetchError
      setVisits(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisits()
  }, [userId])

  const requestVisit = async (propertyId, dateTime) => {
    const { data, error: requestError } = await supabase.from('visits').insert([
      { property_id: propertyId, buyer_id: userId, visit_date: dateTime, status: 'pending' }
    ])
    if (!requestError) fetchVisits()
    return { data, error: requestError }
  }

  const updateVisitStatus = async (visitId, status) => {
    const { data, error: updateError } = await supabase.from('visits').update({ status }).eq('id', visitId)
    if (!updateError) fetchVisits()
    return { data, error: updateError }
  }

  return { visits, loading, error, requestVisit, updateVisitStatus, refreshVisits: fetchVisits }
}

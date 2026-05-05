import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export function useProperties(filters = {}) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true)
        let query = supabase.from('properties').select('*')

        if (filters.type && filters.type !== 'all') {
          query = query.eq('type', filters.type)
        }
        if (filters.location && filters.location !== 'all') {
          query = query.eq('location', filters.location)
        }
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status)
        }

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError
        setProperties(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [filters.type, filters.location, filters.status])

  return { properties, loading, error }
}

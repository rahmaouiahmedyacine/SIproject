import { supabase } from './supabaseClient'

function getAdminEmails() {
  return (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

async function isCurrentUserAdmin() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user?.email) return false

  const email = data.user.email.toLowerCase()
  return getAdminEmails().includes(email)
}

// =====================
// PROFILES
// =====================

export async function createProfile(userId, { fullName, phone, email }) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: userId, full_name: fullName, phone, email }])
    .select()
  return { data, error }
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
  return { data, error }
}

// =====================
// PROPERTIES
// =====================

export async function getProperties(filters = {}) {
  let query = supabase.from('properties').select('*')
  
  if (filters.type) query = query.eq('type', filters.type)
  if (filters.wilaya) query = query.eq('wilaya', filters.wilaya)
  if (filters.status) query = query.eq('status', filters.status)
  
  const { data, error } = await query
  return { data, error }
}

export async function getProperty(propertyId) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single()
  return { data, error }
}

export async function getOwnerProperties(ownerId) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('owner_id', ownerId)
  return { data, error }
}

export async function createProperty(ownerId, propertyData) {
  const canCreate = await isCurrentUserAdmin()
  if (!canCreate) {
    return {
      data: null,
      error: {
        message: 'Only admin can add properties.'
      }
    }
  }

  const { data, error } = await supabase
    .from('properties')
    .insert([{ owner_id: ownerId, ...propertyData }])
    .select()
  return { data, error }
}

export async function updateProperty(propertyId, updates) {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', propertyId)
    .select()
  return { data, error }
}

export async function deleteProperty(propertyId) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId)
  return { error }
}

// =====================
// VISITS
// =====================

export async function getUserVisits(userId) {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('user_id', userId)
  return { data, error }
}

export async function getPropertyVisits(propertyId) {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('property_id', propertyId)
  return { data, error }
}

export async function createVisit(userId, propertyId, visitData) {
  const { data, error } = await supabase
    .from('visits')
    .insert([{ user_id: userId, property_id: propertyId, ...visitData }])
    .select()
  return { data, error }
}

export async function updateVisit(visitId, updates) {
  const { data, error } = await supabase
    .from('visits')
    .update(updates)
    .eq('id', visitId)
    .select()
  return { data, error }
}

export async function getAllVisits() {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
  return { data, error }
}

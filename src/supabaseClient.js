import { createClient } from '@supabase/supabase-js'

// Supabase client used across the app. Reads from Vite env vars.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Provide a safe stub client when env vars are missing.
const noop = async () => ({ data: null, error: null })
const stubClient = {
	auth: {
		getUser: async () => ({ data: { user: null } }),
		onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
		signOut: async () => ({ error: null }),
		signInWithPassword: async () => ({ error: { message: 'Supabase not configured' } } ),
		signUp: async () => ({ error: { message: 'Supabase not configured' } } )
	},
	from: () => ({ select: noop, insert: noop, update: noop }),
	storage: { from: () => ({ upload: noop, getPublicUrl: () => ({ data: { publicUrl: '' } }) }) }
}

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
	? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
	: (console.warn('Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable backend features.'), stubClient)

import { createClient } from '@supabase/supabase-js'

export let supabase: ReturnType<typeof createClient>

export function initSupabase(){
  if (supabase) return supabase
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if(!url || !key) {
    console.warn('Supabase ENV not set')
  }
  supabase = createClient(url!, key!)
  return supabase
}

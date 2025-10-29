import { supabase } from './supabase'
export type Period = 'day'|'week'|'month'|'all'
export async function fetchLeaderboard(period: Period){
  const { data, error } = await supabase.rpc('get_leaderboard', { period })
  if (error) throw error
  return data as { user_id: string; points: number; last_scored_at: string }[]
}

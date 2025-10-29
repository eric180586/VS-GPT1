import { supabase } from '@/shared/supabase'

export async function upsertShift(input: { date: string; role: string; userId: string; start: string; end: string }){
  const { error } = await supabase.from('roster_shifts').upsert({
    date: input.date, role: input.role, user_id: input.userId,
    start_time: input.start, end_time: input.end
  }, { onConflict: 'date,role,user_id' })
  if (error) throw error
}

export async function checkConflicts(date: string, userId: string){
  const { data, error } = await supabase.from('roster_shifts').select('*').eq('date', date).eq('user_id', userId)
  if (error) throw error
  // minimal conflict rule: overlapping times
  const overlaps = [] as any[]
  for (let i=0;i<data.length;i++){
    for (let j=i+1;j<data.length;j++){
      const a = data[i], b = data[j]
      if (!(a.end_time <= b.start_time || b.end_time <= a.start_time)) overlaps.push([a,b])
    }
  }
  return overlaps
}

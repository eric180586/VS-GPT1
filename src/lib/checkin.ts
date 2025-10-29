import { supabase } from '@/shared/supabase'
import { addPoints } from '@/shared/points'
import { spinReward } from './wheel'

export async function checkIn(userId: string){
  const { error } = await supabase.from('checkins').insert({ user_id: userId })
  if (error) throw error
  const pts = spinReward() // 0,1,2 points with weights
  if (pts > 0){
    await addPoints({ userId, event: 'wheel_reward', delta: pts, meta: { source: 'checkin' } })
    await supabase.from('wheel_spins').insert({ user_id: userId, reward_points: pts })
  }
  return pts
}

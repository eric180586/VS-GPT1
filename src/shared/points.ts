import { supabase } from './supabase'

export type PointEvent = 'task_completed'|'admin_very_good'|'admin_ready'|'admin_not_ready'|'reopen'|'wheel_reward'

export async function addPoints(params: { userId:string; taskId?:string; event:PointEvent; delta:number; meta?:Record<string,any> }){
  const { error } = await supabase.from('points_log').insert({
    user_id: params.userId,
    task_id: params.taskId ?? null,
    event: params.event,
    delta: params.delta,
    meta: params.meta ?? {}
  })
  if (error) throw error
}

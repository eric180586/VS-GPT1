import { supabase } from '@/shared/supabase'
import { addPoints } from '@/shared/points'

export type PhotoMode = 'none'|'required'|'random'  // random = 30% Pflicht

export async function createTask(input: {
  title: string
  description?: string
  assigneeId?: string
  dueAt?: string | null
  photoMode?: PhotoMode
  items?: { label: string; required?: boolean }[]
}){
  const { data, error } = await supabase.from('tasks').insert({
    title: input.title,
    description: input.description ?? '',
    assignee_id: input.assigneeId ?? null,
    due_at: input.dueAt ?? null,
    photo_mode: input.photoMode ?? 'none',
    status: 'open'
  }).select('*').single()
  if (error) throw error
  if (input.items?.length){
    const rows = input.items.map(it=>({ task_id: data.id, label: it.label, required: !!it.required }))
    const { error: e2 } = await supabase.from('task_items').insert(rows)
    if (e2) throw e2
  }
  return data
}

export async function completeTask(taskId: string, actorUserId: string){
  // validate photo requirement server-side would be ideal; here we trust client
  const { error } = await supabase.from('tasks').update({ status: 'done', completed_at: new Date().toISOString() }).eq('id', taskId)
  if (error) throw error
  // +0 log (optional)
  await addPoints({ userId: actorUserId, taskId, event: 'task_completed', delta: 0 })
}

export async function reopenTask(taskId: string, actorUserId: string){
  const { error } = await supabase.from('tasks').update({ status: 'open' }).eq('id', taskId)
  if (error) throw error
  await addPoints({ userId: actorUserId, taskId, event: 'reopen', delta: -1 })
}

export async function adminReview(taskId: string, assigneeId: string, verdict: 'very_good'|'ready'|'not_ready'){
  const { error } = await supabase.from('tasks').update({ reviewed_at: new Date().toISOString(), review: verdict }).eq('id', taskId)
  if (error) throw error
  if (verdict === 'very_good') await addPoints({ userId: assigneeId, taskId, event: 'admin_very_good', delta: 2 })
  else if (verdict === 'not_ready') await addPoints({ userId: assigneeId, taskId, event: 'admin_not_ready', delta: -1 })
  else await addPoints({ userId: assigneeId, taskId, event: 'admin_ready', delta: 0 })
}

export function requiresPhoto(mode: PhotoMode){
  if (mode === 'required') return true
  if (mode === 'random') return Math.random() < 0.3
  return false
}

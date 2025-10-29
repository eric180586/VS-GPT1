import { supabase } from '@/shared/supabase'

const BUCKET = import.meta.env.VITE_PHOTO_BUCKET || 'task-photos'

export async function uploadTaskPhoto(taskId: string, userId: string, file: File){
  const path = `${taskId}/${crypto.randomUUID()}-${file.name}`
  const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false })
  if (error) throw error
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
  const { error: e2 } = await supabase.from('task_photos').insert({
    task_id: taskId, user_id: userId, url: pub.publicUrl
  })
  if (e2) throw e2
  return pub.publicUrl
}

export async function listTaskPhotos(taskId: string){
  const { data, error } = await supabase.from('task_photos').select('*').eq('task_id', taskId).order('created_at', { ascending: false })
  if (error) throw error
  return data
}

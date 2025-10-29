// Deno Edge Function (placeholder). Replace internals with your VAPID sender.
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

export const handler = async (req: Request) => {
  const payload = await req.json().catch(()=>({}))
  // TODO: integrate VAPID private key (server-side)
  return new Response(JSON.stringify({ ok: true, received: payload }), { headers: { 'content-type': 'application/json' } })
}

Deno.serve(handler)

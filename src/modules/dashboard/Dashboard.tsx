import React, { useEffect, useState } from 'react'
import { fetchLeaderboard, Period } from '../../shared/leaderboard'

export function Dashboard(){
  const [period, setPeriod] = useState<Period>('week')
  const [rows, setRows] = useState<any[]>([])
  const [err, setErr] = useState<string| null>(null)

  useEffect(()=>{ fetchLeaderboard(period).then(setRows).catch(e=>setErr(e.message)) }, [period])

  return (
    <div>
      <div style={{display:'flex', gap:8, margin:'12px 0'}}>
        {(['day','week','month','all'] as Period[]).map(p =>
          <button key={p} onClick={()=>setPeriod(p)} style={{padding:'6px 10px', border: '1px solid #ddd', background: p===period?'#eee':'#fff'}}>{p}</button>
        )}
      </div>
      {err && <div style={{color:'crimson'}}>Error: {err}</div>}
      <ol>
        {rows.map((r:any, i:number)=>(
          <li key={r.user_id}>#{i+1} — {r.user_id} — {r.points} pts <small>last: {new Date(r.last_scored_at).toLocaleString()}</small></li>
        ))}
      </ol>
    </div>
  )
}

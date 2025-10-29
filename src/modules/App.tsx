import React from 'react'
import { Dashboard } from './dashboard/Dashboard'
import { initSupabase } from '../shared/supabase'

initSupabase()

export default function App(){
  return (
    <div style={{fontFamily:'system-ui', padding:16}}>
      <h1>Villa Sun Team</h1>
      <Dashboard />
    </div>
  )
}

# Villa Sun Team – Complete v2 (One ZIP)

**Ziel:** Einmal entpacken → ENV setzen → build & deploy. Keine Layout/UX-Änderungen, nur Logik-Features.

## 1) Neues Repo
- Neues leeres GitHub-Repo erstellen (z.B. `villa-sun-team-new`)
- Ordnerinhalt pushen

## 2) ENV
`.env.example` → `.env.local` füllen:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_VAPID_PUBLIC_KEY` (optional, Push)
- `VITE_PHOTO_BUCKET` (default `task-photos`)

## 3) Supabase
SQL Editor → ausführen (Reihenfolge):
1. `supabase/migrations/0001_points_leaderboard.sql`
2. `supabase/migrations/0002_tasks_photos_roster.sql`

Erstellt: `points_log`, RPC `get_leaderboard`, `tasks`, `task_items`, `task_photos`, `checkins`, `wheel_spins`, `roster_shifts` + RLS.
Storage-Bucket `task-photos` im Dashboard anlegen und „Authenticated can upload, public read“ aktivieren (oder signierte URLs verwenden).

## 4) Install/Build/Preview
```bash
npm install
npm run build
npm run preview
```

## 5) Vercel
- Framework: **Vite**
- Build: `npm install && npm run build`
- Output: `dist`
- ENV Variablen für Preview/Prod setzen (s.o.)

## 6) Integration in deine bestehenden Screens (ohne Layout-Änderungen)
- Punkte-Logging: `src/shared/points.ts` → `addPoints(...)` bei Admin-Review & Reopen aufrufen.
- Tasks: `src/lib/tasks.ts` (create/complete/reopen/adminReview, PhotoMode inkl. Random-Gate 30%)
- Fotos: `src/lib/photos.ts` (Storage-Upload + DB-Log)
- Check-in + Glücksrad: `src/lib/checkin.ts` (Auto-Spin & Punkte)
- Leaderboard: `src/shared/leaderboard.ts` (RPC-Aufruf)

## 7) PWA/Push
- `public/sw.js` registriert Service Worker
- Edge Function `supabase/functions/push-send/index.ts` als Platzhalter (VAPID-Private-Key serverseitig hinterlegen)

## 8) Tests (manuell, 5 Minuten)
- Task erstellen → abschließen → Admin-Review (Very good +2 / Not Ready −1) → Leaderboard prüfen
- Reopen → −1
- Foto-Upload bei required/random
- Check-in → Glücksrad → ggf. +1/+2 Punkte
- Roster: `upsertShift` + `checkConflicts` (logische Prüfung)

## Hinweis
Diese ZIP liefert die **vollständige Logik-Basis**. UI-Hooks an deine bestehenden Buttons/Flows sind minimal-invasiv (nur Funktionsaufrufe).


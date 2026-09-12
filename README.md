# Life RPG

Turn real tasks into character progression. Next.js (App Router) + MongoDB/Mongoose + shadcn/ui + Framer Motion + GSAP.

## Stack
- **Frontend/Backend:** Next.js 14 (App Router, API routes)
- **DB:** MongoDB via Mongoose
- **Auth:** JWT (httpOnly cookie) — swap in Clerk/NextAuth if preferred
- **UI:** Tailwind + shadcn/ui (accessible primitives)
- **Motion:** Framer Motion (state-driven transitions), GSAP (one-off level-up/particle bursts)

## Quest Flag System
Every quest is user-titled (free text) and tagged with exactly one flag:
- 🟢 **Green** — positive habit → +XP, +Gold, streak continues
- 🟡 **Yellow** — caution/slip → small XP dip, streak unaffected
- 🔴 **Red** — serious setback → XP/Gold loss, streak resets, Integrity dips
- ⚪ **Neutral** — logged only, no scoring impact

The app intentionally does **not** ship a predefined list of "vice" categories — users define their own quests. All scoring math runs server-side (`lib/engine.js`) so stats can't be edited client-side.

## Setup
```bash
git clone <repo>
cd life-rpg
npm install
cp .env.example .env.local   # fill in MONGODB_URI, JWT_SECRET
npm run dev
```

## Environment Variables (`.env.example`)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/liferpg
JWT_SECRET=replace-with-long-random-string
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Folder Structure
```
app/
  api/
    auth/          # signup, login, session
    quests/        # CRUD + /complete (server-authoritative scoring)
    character/      # get character sheet
  (dashboard)/
    dashboard/      # main app UI
components/
  ui/               # shadcn primitives
  game/             # QuestCard, XPBar, LevelUpModal, AttributeRadar
lib/
  engine.js         # XP curve + flag scoring, pure functions, unit-testable
  mongodb.js         # connection helper
models/
  User.js Quest.js Character.js
```

## Deployment
- Frontend + API: Vercel
- MongoDB: Atlas free tier

## Demo Video
90–180s walkthrough: signup → add quest → complete (green/red/yellow) → level up → refresh to prove persistence.

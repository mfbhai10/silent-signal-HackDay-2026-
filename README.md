# 🔴 Silent Signal

> **HackDay 2026** — A discreet distress signaling app disguised as a weather app.

Silent Signal is a mobile-first Progressive Web App that allows users to silently send emergency signals to trusted contacts without raising suspicion. The app disguises itself as an innocent weather widget, only revealing its true functionality through a hidden long-press gesture.

---

## 📖 How It Works

1. **Disguised Home Screen** — looks and feels exactly like a weather app, showing your real local weather.
2. **Hidden Activation** — long-press (800ms) anywhere on the weather screen to reveal the signal panel.
3. **Signal Selection** — pick one of four distress signals via large, one-thumb-friendly touch targets.
4. **Send** — the signal is written to Supabase (with optional GPS coordinates) and your trusted contact is notified in real-time.
5. **Receiver** — trusted contacts open `/receiver` on their device to see and acknowledge incoming alerts.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 + vite-plugin-pwa |
| Styling | Tailwind CSS v3 + shadcn/ui |
| Backend | Supabase (Auth, Postgres, Realtime) |
| Weather | wttr.in (no API key required) |
| Routing | React Router v6 |
| Data Fetching | TanStack React Query v5 |

---

## 🏗️ Project Structure

```
silent-signal/
├── src/
│   ├── components/
│   │   ├── DisguisedHome.tsx     # Live weather disguise UI (wttr.in)
│   │   ├── SignalSelection.tsx   # 4-signal emoji picker
│   │   ├── SignalConfirmation.tsx # Writes signal to Supabase + cancel button
│   │   ├── ReceiverView.tsx      # Sender's post-send confirmation screen
│   │   └── ui/                  # shadcn/ui components
│   ├── hooks/
│   │   └── use-toast.ts
│   ├── integrations/supabase/
│   │   ├── client.ts             # Supabase client
│   │   └── types.ts              # Typed DB schema
│   ├── lib/
│   │   ├── signals.ts            # Single source of truth for signal config
│   │   └── utils.ts
│   └── pages/
│       ├── Index.tsx             # Main screen state machine (sender flow)
│       ├── AuthPage.tsx          # Magic-link login
│       ├── ContactSetupPage.tsx  # Register trusted contact
│       ├── ReceiverPage.tsx      # Realtime alert receiver for contacts
│       └── NotFound.tsx
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # profiles, contacts, signals tables + RLS
│   └── config.toml
├── .env.example                  # Template — copy to .env and fill in values
├── vite.config.ts                # PWA configuration
└── package.json
```

---

## ⚙️ Setup

### 1. Supabase

1. Go to your [Supabase dashboard](https://supabase.com/dashboard)
2. Open the **SQL Editor** and run the contents of `supabase/migrations/001_initial_schema.sql`
3. This creates `profiles`, `contacts`, and `signals` tables with Row Level Security

### 2. Environment Variables

```bash
cp .env.example .env
```

Fill in `.env` with your Supabase project credentials (find them in Project Settings → API):

```env
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
VITE_SUPABASE_PROJECT_ID=<project-id>
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080)

### 4. Build

```bash
npm run build
```

---

## 📱 User Flow

```
[/login] ──────────────────────── Magic link login via Supabase Auth
    │
    ▼
[/] Contact check ──── No contacts? ──→ [Contact Setup] → save → [/]
    │
    ▼
[DisguisedHome] ──── long press 800ms ──→ [SignalSelection]
                                               │
                                         tap a signal
                                               │
                                      [SignalConfirmation]
                                  (writes to Supabase, get GPS)
                                               │
                                         on success ──→ [ReceiverView]
                                                        (tap to dismiss)

[/receiver] ──── Trusted contact's device
            ──── Realtime Supabase subscription
            ──── Alert screen + vibration + GPS map link + acknowledge
```

### Signal Types

| Signal | Emoji | Color | Meaning |
|--------|-------|-------|---------|
| `danger` | 🆘 | Red | Immediate danger |
| `scared` | 😨 | Blue | Scared/threatened |
| `distress` | 💔 | Yellow | Emotional distress |
| `safe` | ❤️ | Green | I am now safe |

---

## 🗄️ Database Schema

### `profiles`
Auto-created on signup via trigger. Links auth user to display name.

### `contacts`
| Column | Type | Description |
|--------|------|-------------|
| `owner_id` | uuid | The signal sender's user ID |
| `contact_email` | text | Email of the trusted contact |
| `contact_name` | text | Optional display name |

### `signals`
| Column | Type | Description |
|--------|------|-------------|
| `sender_id` | uuid | Who sent the signal |
| `type` | text | `danger`, `scared`, `distress`, or `safe` |
| `latitude` / `longitude` | float | GPS coordinates (nullable) |
| `acknowledged_at` | timestamptz | Set when contact taps Acknowledge |

All tables use Row Level Security — users can only read/write their own data.

---

## 🎨 Design System

### Signal Colors
```css
--signal-danger: hsl(0, 72%, 50%)    /* Red */
--signal-help:   hsl(45, 95%, 55%)   /* Amber */
--signal-fear:   hsl(210, 80%, 55%)  /* Blue */
--signal-safe:   hsl(145, 65%, 45%)  /* Green */
```

### Animations
- `animate-breathing` — slow scale pulse (3s)
- `animate-emoji-pulse` — gentle emoji scale (2s)
- `animate-soft-pulse` — opacity fade (2s)
- `animate-fade-in-up` — entrance slide (0.4s)
- `animate-color-wash` — screen transition fade (0.3s)

---

## 🔮 Future Improvements

- [ ] SMS/push fallback if contact doesn't have the app open
- [ ] Multiple trusted contacts
- [ ] Signal history log
- [ ] Biometric unlock for signal panel
- [ ] Test coverage

---

## 📄 License

HackDay 2026 — Internal use only.

# Ramya's Planner

A personal AI-powered nightly planner, built for an ADHD brain.

------

## Why this exists

Most productivity tools assume you can sit down at 9am, look at a tidy list, and just... start. They don't account for the fact that your brain needs to *care* about something before it can do it. That tasks without a "why" feel invisible. That a long list doesn't feel like a plan — it feels like a threat.

This app was built around how your brain actually works:

- **You need to know why a task matters** before it earns your energy. Every task in your schedule gets connected to one of your life goals. If a task can't be connected to anything meaningful, the planner asks why it's on the list at all.
- **Overwhelm is real.** The planner doesn't just dump your full task list at you. It asks questions, pushes back on an unrealistic day, and tells you honestly if you've over-committed.
- **Your energy isn't predictable.** You set when your deep work window is — the planner respects that, and clusters your hardest tasks there, not wherever has an empty slot.
- **The goal is momentum, not perfection.** A shorter plan you actually finish beats a perfect plan that paralyses you.

---

## What it does

Every night at **11:30pm**, the app opens itself on your Mac and greets you with your tasks for tomorrow. Before planning, it asks *"how did today go?"* — a short check-in that helps it understand your patterns over time (what drained you, what flowed, what you kept avoiding).

Then you plan together. It asks clarifying questions if a task is too vague to schedule. It connects each task to your goals. It proposes a schedule. You approve it — or ask it to adjust — and it writes the events to your Google Calendar.

At **10:30pm**, if you haven't added any tasks yet, your Mac (and iPhone via iCloud) sends a reminder before the session starts.

---

## The three tabs

### ✦ Mind
This is the main screen. It's a chat with your planner. At session time it greets you, walks you through your day, and proposes tomorrow's schedule. You can also open it any time to think out loud.

### Tasks
Shows your active task list and backlog directly from the Apple Reminders app. You can check tasks off here — they get marked complete in Reminders too. No duplicate work.

### Preferences
Where you tell the planner about yourself:
- **Life Goals** — the things that actually matter to you right now. Be honest here; this is what gives the planner context for *why* things are on your list.
- **Scheduling bounds** — what time your day starts, when it ends, when you do your best thinking.
- **Learned patterns** — insights the planner has picked up from your check-ins over time. You can delete any that no longer apply.

---

## Setup

You'll need Node.js installed. Then:

```bash
cd aria
npm install
```

Add your Anthropic API key — create a file called `.env.local` in the project root:

```
ANTHROPIC_API_KEY=your-key-here
```

For Google Calendar access, place your `credentials.json` in the `data/` folder. On first run the app will open a browser tab to authorize access — it only needs to do this once.

Then run:

```bash
npm run dev
```

The app opens. The cron jobs (10:30pm check-in reminder, 11:30pm session trigger) are running inside the app as long as it's open.

---

## Running it automatically every night

You don't want to remember to launch this. That defeats the purpose.

Build it as a standalone app once:

```bash
npm run build:mac
```

This creates `Ramya's Planner.app` in the `dist/` folder. Move it to your `/Applications` folder, then add it to **System Settings → General → Login Items**. It will launch silently when your Mac starts, live in the background all day, and open itself at 11:30pm.

---

## Reminders setup

The app reads from and writes to two lists in Apple Reminders:

| List | Purpose |
|---|---|
| `Daily Tasks` | Your active list — what's on for tomorrow |
| `Backlog Items` | Everything else — ideas, someday tasks, things you're not ready to commit to |

You can rename both lists in the Preferences tab to match whatever you already use.

Add tasks to Reminders whenever — the app picks them up at session time.

---

## What the planner knows about you

The planner's system prompt is rebuilt every session with:

- Your current life goals (from Preferences)
- Behavioral patterns it has learned from your check-ins
- Your tasks for tomorrow (from Reminders)
- Your Google Calendar for the next 3 days
- Your working hours and scheduling preferences
- Today's exact date (it won't guess)

It uses this to make scheduling decisions that are actually relevant to your life — not generic "productivity" advice.

---

## Data & privacy

Everything stays on your machine. There's no server, no cloud sync, no account.

| File | What's in it |
|---|---|
| `data/preferences.json` | Your goals and settings |
| `data/patterns.json` | Learned patterns + session check-in history |
| `data/credentials.json` | Google OAuth credentials (never committed) |
| `data/token.json` | Google access token (never committed) |
| `.env.local` | Your Anthropic API key (never committed) |

The only outbound connections are to the Anthropic API (for Claude) and the Google Calendar API (for reading/writing events).

---

## Adjusting the session times

In the Preferences tab, under **Daily Triggers**, you can change:
- When the early reminder fires (default 10:30pm)
- When the planning session opens (default 11:30pm)

Changes take effect after restarting the app.

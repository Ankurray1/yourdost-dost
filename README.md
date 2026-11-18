# YourDOST · Dost voice guide (prototype)

**New: the YourDOST app built from scratch (Q2)** lives at [`/app`](https://yourdost-dost.vercel.app/app): Home, Experts, Dost, Grow and Me, on the YourDOST App design system. Add `#start` to replay onboarding.

Task 3 of the YourDOST PM assignment: an AI voice guide that helps an employee find the right next step in their mental wellbeing journey, and Task 2's smart counsellor matching behind it.

**Live:** see the Vercel deployment linked in the repo's About section.

## How it works

1. **Talk to Dost** (voice or type). Dost is not a doctor; it runs a 2-minute check-in: what's on your mind, the 4 PHQ-4 questions and one safety question.
2. **The AI understands free answers** ("only on bad days", "every evening before stand-up", Hinglish) and asks again gently if an answer is unclear.
3. **Fixed rules decide the priority**, never the AI: safety yes or score ≥ 9 → High (a person now), 6–8 → Medium, 0–5 → Low.
4. **Closing:** a personal summary of what Dost heard, the plan step by step with a cited research line, and a nudge to start step 1.
5. **Guided steps:** after each exercise, Dost leads to the next step (book the matched counsellor, start the 7-day program) and checks in later.

## Stack

| Part | What |
|---|---|
| App | Static HTML/JS (`index.html`, `catalog.js`, `dost.js`), hosted on Vercel's edge network |
| Speech to text | Whisper (open source) in the browser via Transformers.js; audio never leaves the device |
| Voice | Kokoro-82M (open source) in the browser, with the browser's own voice as fallback |
| Conversation | Supabase Edge Function `supabase/functions/dost` (gpt-4.1-mini, JSON output, PII redaction, rate limits, no chat stored) |
| Offline | If the AI can't be reached, the same check-in runs on local rules |

The first time you use voice, the speech models download to your browser (about a minute, once).

All people, counsellors and data in the prototype are fictional.

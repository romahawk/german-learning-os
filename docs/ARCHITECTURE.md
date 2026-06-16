# German Learning OS — Architecture

## 1. System Overview

Frontend:

- Next.js App Router
- TypeScript
- React components
- Tailwind/shadcn-style UI components

Backend:

- Next.js API routes
- OpenAI API called server-side only

Database:

- Firebase Firestore

Hosting:

- Vercel

Future:

- Firebase Auth
- Firestore security rules
- Optional Google Sheet export

## 2. High-Level Flow

```text
User
↓
New Session UI
↓
/api/analyze-session
↓
OpenAI
↓
Structured JSON
↓
Preview in UI
↓
Save to Firestore
↓
Dashboard / Review / Progress
```

## 3. Audio Flow

```text
User
↓
Upload/record audio
↓
/api/transcribe-audio
↓
OpenAI transcription
↓
Transcript
↓
/api/analyze-session
↓
Save to Firestore
```

## 4. Firestore Collections

### sessions

- learner
- mode
- duration
- notes
- summary
- nextFocus
- roadmapId
- phaseId
- milestoneId
- grammarFocusId
- createdAt

### mistakes

- sessionId
- learner
- original
- correction
- category
- rule
- status
- frequency
- nextReview
- createdAt

### vocabulary

- sessionId
- learner
- word
- pos
- meaning
- exampleSentence
- usageTip
- status
- frequency
- nextReview
- createdAt

### gaps

- sessionId
- learner
- pattern
- frequency
- suggestedDrill
- createdAt

### roadmapProgress

- learner
- roadmapId
- currentPhaseId
- completedMilestoneIds
- inProgressMilestoneIds
- startedAt
- updatedAt

## 5. Roadmap Architecture

Static roadmap content lives in `lib/roadmaps`.

Current roadmap definitions:

- B1 General
- B2 General
- B2 Beruf

Learner progress lives in Firestore in `roadmapProgress`. Firestore stores only learner-specific progress, not the static roadmap content.

Sessions may optionally reference:

- roadmapId
- phaseId
- milestoneId

## 6. Grammar Resources Architecture

Static grammar content lives in `lib/grammar`.

Current grammar resource groups:

- Essentials: sein, haben, werden
- Verbs: regular verbs, irregular verbs, Partizip II, Partizip I
- Cases: articles, cases, and prepositions
- Sentence structure: word order and connectors
- Beruf phrases: formal email and speaking phrases

Grammar resources are versioned in code. Firestore stores only optional session references to grammar resources, not the grammar content itself.

Sessions may optionally reference:

- grammarFocusId

## 7. Relationship Model

`sessionId` links mistakes, vocabulary, and gaps to the session that produced them. This allows a future session detail page to reconstruct the full learning output from one saved session.

Session may also link to a roadmap, phase, and milestone. This allows the app to show which learning goal a session supported.

Session may also link to a grammar focus. This allows the app to show which grammar resource a practice session targeted.

## 8. API Routes

Current:

- `POST /api/analyze-session`
- `POST /api/transcribe-audio`

## 9. Environment Variables

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `OPENAI_API_KEY`
- `OPENAI_TRANSCRIPTION_MODEL` (optional, defaults to `gpt-4o-transcribe`)

Notes:

- `OPENAI_API_KEY` must never be exposed to the browser.
- `NEXT_PUBLIC_FIREBASE_*` variables are public client config.
- Firestore security must come from rules, not hidden config.

## 10. Security Notes

Current MVP:

- Firestore may still be in development/test mode.

Before real use:

- Enable Firebase Auth.
- Restrict reads/writes to authenticated users.
- Add security rules.
- Avoid storing unnecessary sensitive data.

## 11. Design Decisions

- Use Firestore collections instead of a relational schema.
- Avoid Firestore composite indexes in MVP by filtering/sorting small datasets client-side.
- Do not introduce Supabase/Postgres yet.
- Do not build complex multi-tenant SaaS architecture yet.
- Keep static roadmap definitions in code for simplicity, version control, and low complexity.
- Store only learner-specific roadmap progress in Firestore.
- Keep static grammar resource definitions in code for simplicity, version control, and fast browsing.
- Store only optional grammar focus references on sessions in Firestore.

## 12. Known Technical Debt

- Auth/security rules are not finalized.
- Prompt quality needs iteration.

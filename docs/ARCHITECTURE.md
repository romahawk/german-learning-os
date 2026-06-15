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

## 3. Audio Flow Planned

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

## 5. Relationship Model

`sessionId` links mistakes, vocabulary, and gaps to the session that produced them. This allows a future session detail page to reconstruct the full learning output from one saved session.

## 6. API Routes

Current:

- `POST /api/analyze-session`

Planned:

- `POST /api/transcribe-audio`

## 7. Environment Variables

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `OPENAI_API_KEY`

Notes:

- `OPENAI_API_KEY` must never be exposed to the browser.
- `NEXT_PUBLIC_FIREBASE_*` variables are public client config.
- Firestore security must come from rules, not hidden config.

## 8. Security Notes

Current MVP:

- Firestore may still be in development/test mode.

Before real use:

- Enable Firebase Auth.
- Restrict reads/writes to authenticated users.
- Add security rules.
- Avoid storing unnecessary sensitive data.

## 9. Design Decisions

- Use Firestore collections instead of a relational schema.
- Avoid Firestore composite indexes in MVP by filtering/sorting small datasets client-side.
- Do not introduce Supabase/Postgres yet.
- Do not build complex multi-tenant SaaS architecture yet.

## 10. Known Technical Debt

- Some pages may still contain mock data.
- Review scheduling is basic or not implemented yet.
- Auth/security rules are not finalized.
- Audio flow is not implemented yet.
- Prompt quality needs iteration.

# German Learning OS — Roadmap

## Current Priority

1. Replace remaining mock data.
2. Add session detail page.
3. Add review actions.
4. Add audio transcription.
5. Add auth/security.

## Phase 0 — Prototype

Status: mostly done

- v0 UI prototype
- Next.js app
- Firebase connection
- OpenAI analysis
- Firestore persistence

## Phase 1 — Complete Core Learning Loop

Goal:

Practice → Analyze → Save → Read back

Tasks:

- Replace all mock data with Firestore data.
- Add session detail page.
- Show linked mistakes/vocabulary/gaps per session.
- Improve prompt quality.
- Add empty/loading/error states.

Acceptance criteria:

- User can save a session and inspect everything created from it.
- Dashboard, Review, Vocabulary, Mistakes, and Progress show real data.

## Phase 2 — Review System

Goal:

Turn stored data into learning improvement.

Tasks:

- Add review actions for mistakes:
  - Mark resolved
  - Repeat later
  - Increase frequency
- Add review actions for vocabulary:
  - Mark known
  - Still learning
  - Repeat later
- Add nextReview scheduling.
- Add review counters.

Acceptance criteria:

- User can complete a daily review session.
- Resolved/known items update dashboard/progress.

## Phase 3 — Audio and Voice

Goal:

Support real speaking practice.

Tasks:

- Add audio file upload.
- Transcribe with OpenAI.
- Put transcript into session notes.
- Analyze transcript.
- Later add browser voice recording.

Acceptance criteria:

- User can upload or record audio and turn it into analyzed learning data.

## Phase 4 — Authentication and Security

Goal:

Make app safe for real family use.

Tasks:

- Firebase Auth.
- Login/logout.
- Firestore security rules.
- User ownership or family workspace model.

Acceptance criteria:

- Public users cannot access private learning data.

## Phase 5 — DTB B2 Beruf Mode

Goal:

Support Iryna's exam preparation.

Tasks:

- Writing task mode.
- Speaking prompts.
- Formal email rubric.
- Beruf-specific vocabulary.
- Exam readiness dashboard.

Acceptance criteria:

- App can generate, evaluate, and track DTB-style writing/speaking practice.

## Phase 6 — Polish and Portfolio

Goal:

Make project presentable.

Tasks:

- Public case study page.
- Screenshots.
- README update.
- Architecture diagram.
- Demo data mode.
- Deployed version.

Acceptance criteria:

- Project can be shown as an AI/Product Engineer portfolio case.

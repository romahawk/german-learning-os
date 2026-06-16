# German Learning OS - Roadmap

Last checked: 2026-06-16

## Current Priority

Next phase: Phase 3 - Audio and Voice.

1. Add audio transcription.
2. Add browser voice recording or audio upload.
3. Add auth/security.

## Implementation Status Snapshot

Implemented:

- Next.js App Router application shell.
- Firebase client connection.
- Firestore collections and read/write helpers for sessions, mistakes, vocabulary, and gaps.
- `POST /api/analyze-session` server route using OpenAI structured JSON output.
- New Session flow: notes/transcript input, AI analysis preview, save session plus linked mistakes/vocabulary/gaps to Firestore.
- Dashboard reads recent sessions, mistakes, vocabulary, and due review counts from Firestore.
- Review screen reads due mistakes, due vocabulary, and recent gaps from Firestore.
- Vocabulary screen reads Firestore data and supports search plus card/table views.
- Mistakes screen reads Firestore data and supports search.
- Session detail screen reconstructs a saved session with linked mistakes, vocabulary, and gaps.
- Progress screen reads Firestore data for metrics, weekly activity, progress trend, and recurring gaps.
- Sidebar review badge reads Firestore due counts.
- Review actions update Firestore statuses, frequencies, and next review dates.
- Empty/loading/error states exist on the main Firestore-backed screens.

Partially implemented:

- B2 Beruf mode: session mode exists, but exam-specific workflows and rubrics are not implemented.
- Audio: UI affordances exist, but upload/record/transcription is not wired.
- Auth: Firebase auth is initialized, but login/logout and security rules are not implemented.

Not implemented:

- `POST /api/transcribe-audio`.
- Browser voice recording.
- Firestore security rules and user ownership model.
- Portfolio/case-study polish and deployed demo mode.

## Phase 0 - Prototype

Status: done

- [x] v0 UI prototype
- [x] Next.js app
- [x] Firebase connection
- [x] OpenAI analysis
- [x] Firestore persistence

## Phase 1 - Complete Core Learning Loop

Status: done for the MVP loop

Goal:

Practice -> Analyze -> Save -> Read back

Tasks:

- [x] Save a session to Firestore.
- [x] Save linked mistakes, vocabulary, and gaps to Firestore.
- [x] Read Firestore data on Dashboard.
- [x] Read Firestore data on Review.
- [x] Read Firestore data on Vocabulary.
- [x] Read Firestore data on Mistakes.
- [x] Add empty/loading/error states for Firestore-backed screens.
- [x] Replace remaining mock/sample data in live UI with Firestore data.
- [x] Add session detail page.
- [x] Show linked mistakes/vocabulary/gaps per session.
- [ ] Improve prompt quality through real-session iteration.

Acceptance criteria:

- [x] User can save a session and see the created learning data on main screens.
- [x] User can inspect everything created from one saved session.
- [x] Dashboard, Review, Vocabulary, Mistakes, and Progress show real Firestore data.

Next work:

1. Use real saved sessions to tune the analysis prompt.
2. Start Phase 2 review actions and scheduling.

## Phase 2 - Review System

Status: done for the MVP loop

Goal:

Turn stored data into learning improvement.

Tasks:

- [x] Display due mistakes.
- [x] Display due vocabulary.
- [x] Display recent gaps.
- [x] Add review actions for mistakes:
  - Mark resolved
  - Repeat later
  - Increase frequency
- [x] Add review actions for vocabulary:
  - Mark known
  - Still learning
  - Repeat later
- [x] Add `nextReview` scheduling updates.
- [x] Add review counters based on completed actions.

Acceptance criteria:

- [x] User can complete a daily review session.
- [x] Resolved/known items update dashboard/progress.

## Phase 3 - Audio and Voice

Status: planned

Goal:

Support real speaking practice.

Tasks:

- [ ] Add audio file upload.
- [ ] Transcribe with OpenAI.
- [ ] Put transcript into session notes.
- [ ] Analyze transcript.
- [ ] Later add browser voice recording.

Acceptance criteria:

- [ ] User can upload or record audio and turn it into analyzed learning data.

## Phase 4 - Authentication and Security

Status: planned

Goal:

Make app safe for real family use.

Tasks:

- [ ] Firebase Auth login/logout.
- [ ] Firestore security rules.
- [ ] User ownership or family workspace model.
- [ ] Restrict private learning data to authenticated users.

Acceptance criteria:

- [ ] Public users cannot access private learning data.

## Phase 5 - DTB B2 Beruf Mode

Status: planned

Goal:

Support Iryna's exam preparation.

Tasks:

- [ ] Writing task mode.
- [ ] Speaking prompts.
- [ ] Formal email rubric.
- [ ] Beruf-specific vocabulary.
- [ ] Exam readiness dashboard.

Acceptance criteria:

- [ ] App can generate, evaluate, and track DTB-style writing/speaking practice.

## Phase 6 - Polish and Portfolio

Status: planned

Goal:

Make project presentable.

Tasks:

- [ ] Public case study page.
- [ ] Screenshots.
- [ ] README update.
- [ ] Architecture diagram.
- [ ] Demo data mode.
- [ ] Deployed version.

Acceptance criteria:

- [ ] Project can be shown as an AI/Product Engineer portfolio case.

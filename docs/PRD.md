# German Learning OS — PRD

## 1. Product Summary

German Learning OS is a private family German learning system.

Learners:

- Roman: conversational fluency, professional German, job-search context.
- Iryna: everyday German plus DTB B2 Beruf preparation.

Core idea:

- Capture practice sessions.
- Analyze them with AI.
- Extract mistakes, vocabulary, gaps, and next focus.
- Save results.
- Review repeatedly.

## 2. Problem

German practice is fragmented. Mistakes often disappear after the session, vocabulary is not systematically reviewed, and exam preparation needs more structure. Voice and writing practice should become one repeatable learning loop.

## 3. Target Users

- Primary: Roman
- Secondary: Iryna
- Future optional: other German learners preparing for workplace German exams.

## 4. Goals

- Make German learning repeatable.
- Reduce friction in logging sessions.
- Turn practice into reviewable learning data.
- Support writing now and audio/voice later.
- Track progress over time.

## 5. Non-Goals for MVP

- Public SaaS.
- Payments.
- Complex teacher/admin roles.
- Perfect exam simulation.
- Advanced gamification.
- Native mobile app.

## 6. MVP Features

- New session form.
- OpenAI analysis.
- Save session to Firestore.
- Save mistakes, vocabulary, and gaps.
- Dashboard with real data.
- Review page.
- Vocabulary page.
- Mistakes page.
- Progress page with real data.
- Basic learner filter: Roman / Iryna / Both.

## 7. Near-Term Features

- Session detail page.
- Review actions:
  - Mark resolved.
  - Repeat later.
  - Mark known.
- Audio upload transcription.
- Voice recording.
- Firebase Auth.
- Firestore security rules.

## 8. Data Objects

- Session: a saved learning session with learner, mode, duration, notes, summary, next focus, and created date.
- Mistake: a correction extracted from a session, including original text, corrected text, category, rule, status, frequency, and review timing.
- Vocabulary: a word or phrase extracted from a session, including part of speech, meaning, example sentence, usage tip, status, frequency, and review timing.
- Gap: a recurring learning pattern or weak area, linked to the session that produced it.

## 9. Success Metrics

- Sessions logged per week.
- Mistakes resolved.
- Vocabulary marked known.
- Recurring gaps reduced.
- Review items completed.
- For Iryna: DTB B2 writing/speaking readiness.

## 10. Risks

- AI output quality may be inconsistent.
- Too much UI complexity can slow actual learning.
- Firestore queries may require indexes if over-optimized too early.
- Without review actions, the app becomes storage only.

## 11. Product Principle

Build the smallest loop that improves learning:

Practice → Analyze → Save → Review → Repeat.

# German Learning OS - PRD

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
- Connect practice to structured roadmap progress.
- Use grammar resources as reference material and optional drill focus.

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
- Support text, audio upload, and browser voice recording.
- Track progress over time.
- Guide learning with B1 General, B2 General, and B2 Beruf roadmaps.
- Provide fast access to common German grammar tables, mistakes, and Beruf phrases.

## 5. Non-Goals for MVP

- Public SaaS.
- Payments.
- Complex teacher/admin roles.
- Perfect exam simulation.
- Advanced gamification.
- Native mobile app.
- Full LMS.
- Admin roadmap editor.
- Public SaaS roadmap marketplace.

## 6. MVP / Near-Term Features

- New session form.
- OpenAI analysis.
- Audio transcription.
- Voice recording.
- Save session to Firestore.
- Save mistakes, vocabulary, and gaps.
- Dashboard with real data.
- Review page with persisted review actions.
- Vocabulary page.
- Mistakes page.
- Progress page with real data.
- Structured roadmaps:
  - B1 General
  - B2 General
  - B2 Beruf
- Grammar Resources:
  - sein / haben / werden
  - regular and irregular verbs
  - Partizip II and Partizip I
  - articles and cases
  - dative, accusative, and two-way prepositions
  - word order
  - Beruf phrases
- Optional session-to-roadmap linking.
- Optional session-to-grammar-focus linking.
- Learner progress tracking.
- Basic learner filter: Roman / Iryna / Both.

## 7. Later Features

- Firebase Auth.
- Firestore security rules.
- DTB B2 Beruf exam-specific dashboards and rubrics.
- Portfolio/demo mode.

## 8. Data Objects

- Session: a saved learning session with learner, mode, duration, notes, summary, next focus, created date, optional roadmap metadata, and optional grammar focus metadata.
- Mistake: a correction extracted from a session, including original text, corrected text, category, rule, status, frequency, and review timing.
- Vocabulary: a word or phrase extracted from a session, including part of speech, meaning, example sentence, usage tip, status, frequency, and review timing.
- Gap: a recurring learning pattern or weak area, linked to the session that produced it.
- Roadmap: static learning track such as B1 General, B2 General, or B2 Beruf.
- RoadmapPhase: a grouped stage inside a roadmap.
- RoadmapMilestone: a concrete learning target with skill type, recommended practice modes, and evidence rule.
- RoadmapProgress: learner-specific Firestore progress for a roadmap.
- GrammarResource: static grammar reference content grouped by category, level, tables, examples, common mistakes, and quick drill prompt.

## 9. Success Metrics

- Sessions logged per week.
- Mistakes resolved.
- Vocabulary marked known.
- Recurring gaps reduced.
- Review items completed.
- Roadmap milestones completed.
- Grammar resources used as drill focus.
- For Iryna: DTB B2 writing/speaking readiness.

## 10. Risks

- AI output quality may be inconsistent.
- Too much UI complexity can slow actual learning.
- Firestore queries may require indexes if over-optimized too early.
- Roadmap progress can become noisy if milestone completion is marked casually.
- Grammar reference content can become stale if it is not reviewed during real-session use.

## 11. Product Principle

Practice -> Analyze -> Save -> Review -> Grammar Focus -> Roadmap Progress -> Repeat.

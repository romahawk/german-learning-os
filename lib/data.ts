// Sample data + types for German Learning OS (private family tool)

export type LearnerId = "roman" | "iryna"
export type LearnerFilter = LearnerId | "both"

export type Learner = {
  id: LearnerId
  name: string
  level: string
  goal: string
  streak: number
}

export const learners: Learner[] = [
  { id: "roman", name: "Roman", level: "B2", goal: "B2 Beruf (workplace German)", streak: 12 },
  { id: "iryna", name: "Iryna", level: "B1", goal: "Everyday fluency & textbook A2→B1", streak: 8 },
]

export function learnerName(id: LearnerId) {
  return learners.find((l) => l.id === id)?.name ?? id
}

export type SessionMode = "conversation" | "drill" | "b2-beruf" | "textbook" | "review"

export const sessionModes: { value: SessionMode; label: string; description: string }[] = [
  { value: "conversation", label: "Conversation", description: "Free speaking practice" },
  { value: "drill", label: "Drill", description: "Grammar & pattern repetition" },
  { value: "b2-beruf", label: "B2 Beruf", description: "Workplace / professional German" },
  { value: "textbook", label: "Textbook", description: "Structured coursebook unit" },
  { value: "review", label: "Review", description: "Spaced-repetition recall" },
]

export type Session = {
  id: string
  learner: LearnerId
  mode: SessionMode
  duration: number // minutes
  date: string // ISO
  summary: string
  mistakesFound: number
  vocabAdded: number
}

export const sessions: Session[] = [
  { id: "s1", learner: "roman", mode: "b2-beruf", duration: 30, date: "2026-06-09", summary: "Mock job interview — talked about previous projects and team leadership.", mistakesFound: 4, vocabAdded: 7 },
  { id: "s2", learner: "iryna", mode: "conversation", duration: 20, date: "2026-06-09", summary: "Weekend plans and grocery shopping role-play.", mistakesFound: 5, vocabAdded: 6 },
  { id: "s3", learner: "roman", mode: "drill", duration: 15, date: "2026-06-08", summary: "Dative vs. accusative prepositions drill.", mistakesFound: 6, vocabAdded: 2 },
  { id: "s4", learner: "iryna", mode: "textbook", duration: 25, date: "2026-06-07", summary: "Menschen A2 — Kapitel 8, perfect tense with sein.", mistakesFound: 3, vocabAdded: 9 },
  { id: "s5", learner: "roman", mode: "conversation", duration: 35, date: "2026-06-06", summary: "Discussed a news article about renewable energy.", mistakesFound: 2, vocabAdded: 5 },
  { id: "s6", learner: "iryna", mode: "review", duration: 10, date: "2026-06-06", summary: "Reviewed due flashcards — articles and plurals.", mistakesFound: 4, vocabAdded: 0 },
  { id: "s7", learner: "roman", mode: "textbook", duration: 30, date: "2026-06-04", summary: "Sicher! B2 — relative clauses with prepositions.", mistakesFound: 5, vocabAdded: 8 },
  { id: "s8", learner: "iryna", mode: "drill", duration: 15, date: "2026-06-03", summary: "Separable verbs in present tense.", mistakesFound: 7, vocabAdded: 3 },
]

export type Status = "new" | "learning" | "review" | "resolved"

export type Mistake = {
  id: string
  learner: LearnerId
  original: string
  correction: string
  category: string
  note: string
  status: Status
  nextReview: string
  occurrences: number
}

export const mistakes: Mistake[] = [
  { id: "m1", learner: "roman", original: "Ich habe nach Hause gegangen.", correction: "Ich bin nach Hause gegangen.", category: "Auxiliary verb", note: "Movement verbs use 'sein' in the perfect tense.", status: "review", nextReview: "2026-06-10", occurrences: 4 },
  { id: "m2", learner: "iryna", original: "Ich gehe zu der Schule.", correction: "Ich gehe zur Schule.", category: "Contraction", note: "zu + der → zur", status: "learning", nextReview: "2026-06-10", occurrences: 3 },
  { id: "m3", learner: "roman", original: "Wegen dem Wetter", correction: "Wegen des Wetters", category: "Case (Genitive)", note: "'wegen' takes the genitive.", status: "review", nextReview: "2026-06-11", occurrences: 5 },
  { id: "m4", learner: "iryna", original: "Ich habe gesehen den Film.", correction: "Ich habe den Film gesehen.", category: "Word order", note: "Past participle goes to the end of the clause.", status: "new", nextReview: "2026-06-10", occurrences: 2 },
  { id: "m5", learner: "roman", original: "Der Mädchen ist nett.", correction: "Das Mädchen ist nett.", category: "Article / gender", note: "'-chen' diminutives are always neuter.", status: "resolved", nextReview: "2026-06-20", occurrences: 1 },
  { id: "m6", learner: "iryna", original: "Ich freue mich für dich.", correction: "Ich freue mich auf dich.", category: "Preposition", note: "'sich freuen auf' = looking forward to.", status: "learning", nextReview: "2026-06-12", occurrences: 4 },
  { id: "m7", learner: "roman", original: "Ich kann Deutsch sprechen gut.", correction: "Ich kann gut Deutsch sprechen.", category: "Word order", note: "Manner adverb before the object/infinitive.", status: "review", nextReview: "2026-06-10", occurrences: 3 },
  { id: "m8", learner: "iryna", original: "Es gibt viele Leute hier sind.", correction: "Es gibt hier viele Leute.", category: "Sentence structure", note: "'es gibt' + accusative, no extra verb.", status: "new", nextReview: "2026-06-11", occurrences: 2 },
]

export type Vocab = {
  id: string
  learner: LearnerId
  word: string
  article?: string
  meaning: string
  example: string
  category: string
  status: Status
  nextReview: string
}

export const vocabulary: Vocab[] = [
  { id: "v1", learner: "roman", word: "Vorstellungsgespräch", article: "das", meaning: "job interview", example: "Mein Vorstellungsgespräch ist am Montag.", category: "Work", status: "learning", nextReview: "2026-06-10" },
  { id: "v2", learner: "roman", word: "zuverlässig", meaning: "reliable", example: "Er ist ein sehr zuverlässiger Kollege.", category: "Adjectives", status: "review", nextReview: "2026-06-10" },
  { id: "v3", learner: "iryna", word: "Einkaufsliste", article: "die", meaning: "shopping list", example: "Ich schreibe eine Einkaufsliste.", category: "Daily life", status: "new", nextReview: "2026-06-10" },
  { id: "v4", learner: "iryna", word: "umsteigen", meaning: "to change (trains)", example: "Wir müssen in Köln umsteigen.", category: "Travel", status: "learning", nextReview: "2026-06-11" },
  { id: "v5", learner: "roman", word: "Fristgerecht", meaning: "on time / within the deadline", example: "Bitte liefern Sie den Bericht fristgerecht.", category: "Work", status: "review", nextReview: "2026-06-12" },
  { id: "v6", learner: "iryna", word: "Erneuerbar", meaning: "renewable", example: "Erneuerbare Energie ist wichtig.", category: "Environment", status: "new", nextReview: "2026-06-10" },
  { id: "v7", learner: "roman", word: "Verantwortung", article: "die", meaning: "responsibility", example: "Ich übernehme die Verantwortung für das Projekt.", category: "Work", status: "resolved", nextReview: "2026-06-25" },
  { id: "v8", learner: "iryna", word: "gemütlich", meaning: "cozy", example: "Das Café ist sehr gemütlich.", category: "Adjectives", status: "review", nextReview: "2026-06-11" },
  { id: "v9", learner: "iryna", word: "Verspätung", article: "die", meaning: "delay", example: "Der Zug hat zehn Minuten Verspätung.", category: "Travel", status: "learning", nextReview: "2026-06-10" },
  { id: "v10", learner: "roman", word: "ausführlich", meaning: "detailed / thorough", example: "Er hat ausführlich geantwortet.", category: "Adjectives", status: "new", nextReview: "2026-06-13" },
]

export type Gap = {
  id: string
  learner: LearnerId
  topic: string
  description: string
  severity: "high" | "medium" | "low"
  relatedMistakes: number
}

export const gaps: Gap[] = [
  { id: "g1", learner: "roman", topic: "Genitive case", description: "Inconsistent with prepositions that take genitive (wegen, trotz, während).", severity: "high", relatedMistakes: 9 },
  { id: "g2", learner: "iryna", topic: "Verb-final word order", description: "Forgets to move the verb to the end in subordinate clauses.", severity: "high", relatedMistakes: 7 },
  { id: "g3", learner: "roman", topic: "Adverb placement", description: "Manner adverbs occasionally placed after the object.", severity: "medium", relatedMistakes: 4 },
  { id: "g4", learner: "iryna", topic: "Fixed prepositions", description: "Mixes up verb + preposition pairs (freuen auf/über).", severity: "medium", relatedMistakes: 5 },
  { id: "g5", learner: "iryna", topic: "Two-way prepositions", description: "Chooses the wrong case with Wechselpräpositionen.", severity: "low", relatedMistakes: 3 },
]

// Weekly activity for charts
export const weeklyActivity = [
  { day: "Mon", roman: 30, iryna: 20 },
  { day: "Tue", roman: 0, iryna: 25 },
  { day: "Wed", roman: 15, iryna: 0 },
  { day: "Thu", roman: 30, iryna: 10 },
  { day: "Fri", roman: 35, iryna: 15 },
  { day: "Sat", roman: 30, iryna: 25 },
  { day: "Sun", roman: 20, iryna: 20 },
]

export const progressTrend = [
  { week: "W1", resolved: 3, vocab: 12 },
  { week: "W2", resolved: 5, vocab: 18 },
  { week: "W3", resolved: 4, vocab: 15 },
  { week: "W4", resolved: 8, vocab: 22 },
  { week: "W5", resolved: 7, vocab: 19 },
  { week: "W6", resolved: 11, vocab: 27 },
]

// Helpers
export function filterByLearner<T extends { learner: LearnerId }>(items: T[], f: LearnerFilter): T[] {
  return f === "both" ? items : items.filter((i) => i.learner === f)
}

export function dueToday<T extends { nextReview: string }>(items: T[], today = "2026-06-10"): T[] {
  return items.filter((i) => i.nextReview <= today)
}

export const statusLabels: Record<Status, string> = {
  new: "New",
  learning: "Learning",
  review: "Review",
  resolved: "Resolved",
}

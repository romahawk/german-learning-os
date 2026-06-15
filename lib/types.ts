import type { Timestamp } from "firebase/firestore"

export type Learner = "Roman" | "Iryna" | "both"

export type SessionMode =
  | "conversation"
  | "drill"
  | "b2-beruf"
  | "textbook"
  | "review"

export type MistakeCategory =
  | "grammar:cases"
  | "grammar:verb"
  | "grammar:word-order"
  | "grammar:articles"
  | "grammar:prepositions"
  | "vocabulary"
  | "pronunciation"
  | "register"

export type MistakeStatus = "new" | "recurring" | "resolved"

export type VocabularyPos =
  | "noun"
  | "verb"
  | "adj"
  | "adv"
  | "phrase"
  | "idiom"

export type VocabularyStatus = "new" | "drilling" | "known"

export type Session = {
  id: string
  learner: Learner
  mode: SessionMode
  duration: number
  notes: string
  summary: string
  nextFocus: string
  createdAt: Timestamp | null
}

export type Mistake = {
  id: string
  sessionId: string
  learner: Learner
  original: string
  correction: string
  category: MistakeCategory
  rule: string
  status: MistakeStatus
  frequency: number
  nextReview: Timestamp | null
  createdAt: Timestamp | null
}

export type Vocabulary = {
  id: string
  sessionId: string
  learner: Learner
  word: string
  pos: VocabularyPos
  meaning: string
  exampleSentence: string
  usageTip: string
  status: VocabularyStatus
  frequency: number
  nextReview: Timestamp | null
  createdAt: Timestamp | null
}

export type Gap = {
  id: string
  sessionId: string
  learner: Learner
  pattern: string
  frequency: number
  suggestedDrill: string
  createdAt: Timestamp | null
}

export type CreateSessionInput = Omit<Session, "id" | "createdAt">

export type CreateMistakeInput = Omit<
  Mistake,
  "id" | "createdAt" | "frequency" | "nextReview"
> & {
  frequency?: number
  nextReview?: Timestamp | null
}

export type CreateVocabularyInput = Omit<
  Vocabulary,
  "id" | "createdAt" | "frequency" | "nextReview"
> & {
  frequency?: number
  nextReview?: Timestamp | null
}

export type CreateGapInput = Omit<Gap, "id" | "createdAt">

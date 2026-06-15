import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type {
  CreateGapInput,
  CreateMistakeInput,
  CreateSessionInput,
  CreateVocabularyInput,
  Gap,
  Learner,
  Mistake,
  Session,
  Vocabulary,
} from "@/lib/types"

const COLLECTIONS = {
  sessions: "sessions",
  mistakes: "mistakes",
  vocabulary: "vocabulary",
  gaps: "gaps",
} as const

function timestampOrNull(value: unknown): Timestamp | null {
  return value instanceof Timestamp ? value : null
}

function toSession(doc: QueryDocumentSnapshot<DocumentData>): Session {
  const data = doc.data()

  return {
    id: doc.id,
    learner: data.learner,
    mode: data.mode,
    duration: data.duration,
    notes: data.notes,
    summary: data.summary,
    nextFocus: data.nextFocus,
    createdAt: timestampOrNull(data.createdAt),
  }
}

function toMistake(doc: QueryDocumentSnapshot<DocumentData>): Mistake {
  const data = doc.data()

  return {
    id: doc.id,
    sessionId: data.sessionId,
    learner: data.learner,
    original: data.original,
    correction: data.correction,
    category: data.category,
    rule: data.rule,
    status: data.status,
    frequency: data.frequency ?? 1,
    nextReview: timestampOrNull(data.nextReview),
    createdAt: timestampOrNull(data.createdAt),
  }
}

function toVocabulary(doc: QueryDocumentSnapshot<DocumentData>): Vocabulary {
  const data = doc.data()

  return {
    id: doc.id,
    sessionId: data.sessionId,
    learner: data.learner,
    word: data.word,
    pos: data.pos,
    meaning: data.meaning,
    exampleSentence: data.exampleSentence,
    usageTip: data.usageTip,
    status: data.status,
    frequency: data.frequency ?? 1,
    nextReview: timestampOrNull(data.nextReview),
    createdAt: timestampOrNull(data.createdAt),
  }
}

function toGap(doc: QueryDocumentSnapshot<DocumentData>): Gap {
  const data = doc.data()

  return {
    id: doc.id,
    sessionId: data.sessionId,
    learner: data.learner,
    pattern: data.pattern,
    frequency: data.frequency,
    suggestedDrill: data.suggestedDrill,
    createdAt: timestampOrNull(data.createdAt),
  }
}

export async function saveSession(input: CreateSessionInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.sessions), {
    ...input,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

export async function getRecentSessions(
  limitCount = 10
): Promise<Session[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.sessions),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    )
  )

  return snapshot.docs.map(toSession)
}

export async function getSessionsByLearner(
  learner: Learner,
  limitCount = 10
): Promise<Session[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.sessions),
      where("learner", "==", learner),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    )
  )

  return snapshot.docs.map(toSession)
}

export async function saveMistake(input: CreateMistakeInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.mistakes), {
    ...input,
    frequency: input.frequency ?? 1,
    nextReview: input.nextReview ?? null,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

export async function saveMistakes(
  inputs: CreateMistakeInput[]
): Promise<string[]> {
  return Promise.all(inputs.map(saveMistake))
}

export async function getMistakesByLearner(
  learner: Learner
): Promise<Mistake[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.mistakes),
      where("learner", "==", learner),
      orderBy("createdAt", "desc")
    )
  )

  return snapshot.docs.map(toMistake)
}

export async function getMistakesBySession(
  sessionId: string
): Promise<Mistake[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.mistakes),
      where("sessionId", "==", sessionId),
      orderBy("createdAt", "desc")
    )
  )

  return snapshot.docs.map(toMistake)
}

export async function getDueMistakes(learner: Learner): Promise<Mistake[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.mistakes),
      where("learner", "==", learner),
      where("nextReview", "<=", Timestamp.now()),
      orderBy("nextReview", "asc")
    )
  )

  return snapshot.docs.map(toMistake)
}

export async function saveVocabulary(
  input: CreateVocabularyInput
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.vocabulary), {
    ...input,
    frequency: input.frequency ?? 1,
    nextReview: input.nextReview ?? null,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

export async function saveVocabularyItems(
  inputs: CreateVocabularyInput[]
): Promise<string[]> {
  return Promise.all(inputs.map(saveVocabulary))
}

export async function getVocabularyByLearner(
  learner: Learner
): Promise<Vocabulary[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.vocabulary),
      where("learner", "==", learner),
      orderBy("createdAt", "desc")
    )
  )

  return snapshot.docs.map(toVocabulary)
}

export async function getVocabularyBySession(
  sessionId: string
): Promise<Vocabulary[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.vocabulary),
      where("sessionId", "==", sessionId),
      orderBy("createdAt", "desc")
    )
  )

  return snapshot.docs.map(toVocabulary)
}

export async function getDueVocabulary(
  learner: Learner
): Promise<Vocabulary[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.vocabulary),
      where("learner", "==", learner),
      where("nextReview", "<=", Timestamp.now()),
      orderBy("nextReview", "asc")
    )
  )

  return snapshot.docs.map(toVocabulary)
}

export async function saveGap(input: CreateGapInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.gaps), {
    ...input,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

export async function saveGaps(inputs: CreateGapInput[]): Promise<string[]> {
  return Promise.all(inputs.map(saveGap))
}

export async function getGapsByLearner(learner: Learner): Promise<Gap[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.gaps),
      where("learner", "==", learner),
      orderBy("createdAt", "desc")
    )
  )

  return snapshot.docs.map(toGap)
}

export async function getGapsBySession(sessionId: string): Promise<Gap[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.gaps),
      where("sessionId", "==", sessionId),
      orderBy("createdAt", "desc")
    )
  )

  return snapshot.docs.map(toGap)
}

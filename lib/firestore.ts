import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type DocumentSnapshot,
  type Query,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
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
  MistakeStatus,
  Session,
  Vocabulary,
  VocabularyStatus,
} from "@/lib/types"

const COLLECTIONS = {
  sessions: "sessions",
  mistakes: "mistakes",
  vocabulary: "vocabulary",
  gaps: "gaps",
} as const

type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS]

type FirestoreQueryParams = Record<string, unknown>

async function getLoggedDocs(
  collectionName: CollectionName,
  queryParams: FirestoreQueryParams,
  firestoreQuery: Query<DocumentData, DocumentData>
): Promise<QuerySnapshot<DocumentData, DocumentData>> {
  try {
    const snapshot = await getDocs(firestoreQuery)

    console.info("[Firestore] Query succeeded", {
      collection: collectionName,
      queryParams,
      resultCount: snapshot.size,
    })

    return snapshot
  } catch (error) {
    console.error("[Firestore] Query failed", {
      collection: collectionName,
      queryParams,
      error,
    })
    throw error
  }
}

function timestampOrNull(value: unknown): Timestamp | null {
  return value instanceof Timestamp ? value : null
}

function toSession(doc: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>): Session {
  const data = doc.data() as DocumentData

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

function sortByCreatedAtDesc<T extends { createdAt: Timestamp | null }>(
  items: T[]
): T[] {
  return items.sort(
    (a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)
  )
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
  const snapshot = await getLoggedDocs(
    COLLECTIONS.sessions,
    {
      orderBy: { field: "createdAt", direction: "desc" },
      limit: limitCount,
    },
    query(collection(db, COLLECTIONS.sessions), orderBy("createdAt", "desc"), limit(limitCount))
  )

  return snapshot.docs.map(toSession)
}

export async function getSessionById(sessionId: string): Promise<Session | null> {
  const docRef = doc(db, COLLECTIONS.sessions, sessionId)
  const snapshot = await getDoc(docRef)

  console.info("[Firestore] Document read", {
    collection: COLLECTIONS.sessions,
    id: sessionId,
    exists: snapshot.exists(),
  })

  return snapshot.exists() ? toSession(snapshot) : null
}

export async function getSessionsByLearner(
  learner: Learner,
  limitCount = 10
): Promise<Session[]> {
  const snapshot = await getLoggedDocs(
    COLLECTIONS.sessions,
    {
      where: [{ field: "learner", operator: "==", value: learner }],
      clientSort: { field: "createdAt", direction: "desc" },
      limit: limitCount,
    },
    query(
      collection(db, COLLECTIONS.sessions),
      where("learner", "==", learner),
      limit(limitCount)
    )
  )

  return sortByCreatedAtDesc(snapshot.docs.map(toSession))
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
  const snapshot = await getLoggedDocs(
    COLLECTIONS.mistakes,
    {
      where: [{ field: "learner", operator: "==", value: learner }],
      clientSort: { field: "createdAt", direction: "desc" },
    },
    query(
      collection(db, COLLECTIONS.mistakes),
      where("learner", "==", learner)
    )
  )

  return sortByCreatedAtDesc(snapshot.docs.map(toMistake))
}

export async function getMistakesBySession(
  sessionId: string
): Promise<Mistake[]> {
  const snapshot = await getLoggedDocs(
    COLLECTIONS.mistakes,
    {
      where: [{ field: "sessionId", operator: "==", value: sessionId }],
      clientSort: { field: "createdAt", direction: "desc" },
    },
    query(
      collection(db, COLLECTIONS.mistakes),
      where("sessionId", "==", sessionId)
    )
  )

  return sortByCreatedAtDesc(snapshot.docs.map(toMistake))
}

export async function getDueMistakes(learner: Learner): Promise<Mistake[]> {
  const snapshot = await getLoggedDocs(
    COLLECTIONS.mistakes,
    {
      where: [{ field: "learner", operator: "==", value: learner }],
      clientSort: { field: "createdAt", direction: "desc" },
      clientFilter: "nextReview is null or nextReview <= now",
    },
    query(
      collection(db, COLLECTIONS.mistakes),
      where("learner", "==", learner)
    )
  )

  const now = Timestamp.now().toMillis()

  return snapshot.docs
    .map(toMistake)
    .filter(
      (mistake) =>
        mistake.status !== "resolved" &&
        (!mistake.nextReview || mistake.nextReview.toMillis() <= now)
    )
    .sort(
      (a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)
    )
}

export async function updateMistakeReview(
  mistakeId: string,
  input: {
    status?: MistakeStatus
    frequency?: number
    nextReview?: Timestamp | null
  }
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.mistakes, mistakeId), input)
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
  const snapshot = await getLoggedDocs(
    COLLECTIONS.vocabulary,
    {
      where: [{ field: "learner", operator: "==", value: learner }],
      clientSort: { field: "createdAt", direction: "desc" },
    },
    query(
      collection(db, COLLECTIONS.vocabulary),
      where("learner", "==", learner)
    )
  )

  return sortByCreatedAtDesc(snapshot.docs.map(toVocabulary))
}

export async function getVocabularyBySession(
  sessionId: string
): Promise<Vocabulary[]> {
  const snapshot = await getLoggedDocs(
    COLLECTIONS.vocabulary,
    {
      where: [{ field: "sessionId", operator: "==", value: sessionId }],
      clientSort: { field: "createdAt", direction: "desc" },
    },
    query(
      collection(db, COLLECTIONS.vocabulary),
      where("sessionId", "==", sessionId)
    )
  )

  return sortByCreatedAtDesc(snapshot.docs.map(toVocabulary))
}

export async function getDueVocabulary(
  learner: Learner
): Promise<Vocabulary[]> {
  const snapshot = await getLoggedDocs(
    COLLECTIONS.vocabulary,
    {
      where: [{ field: "learner", operator: "==", value: learner }],
      clientSort: { field: "createdAt", direction: "desc" },
      clientFilter: "nextReview is null or nextReview <= now",
    },
    query(
      collection(db, COLLECTIONS.vocabulary),
      where("learner", "==", learner)
    )
  )

  const now = Timestamp.now().toMillis()

  return snapshot.docs
    .map(toVocabulary)
    .filter(
      (item) =>
        item.status !== "known" &&
        (!item.nextReview || item.nextReview.toMillis() <= now)
    )
    .sort(
      (a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)
    )
}

export async function updateVocabularyReview(
  vocabularyId: string,
  input: {
    status?: VocabularyStatus
    frequency?: number
    nextReview?: Timestamp | null
  }
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.vocabulary, vocabularyId), input)
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
  const snapshot = await getLoggedDocs(
    COLLECTIONS.gaps,
    {
      where: [{ field: "learner", operator: "==", value: learner }],
      clientSort: { field: "createdAt", direction: "desc" },
    },
    query(
      collection(db, COLLECTIONS.gaps),
      where("learner", "==", learner)
    )
  )

  return sortByCreatedAtDesc(snapshot.docs.map(toGap))
}

export async function getGapsBySession(sessionId: string): Promise<Gap[]> {
  const snapshot = await getLoggedDocs(
    COLLECTIONS.gaps,
    {
      where: [{ field: "sessionId", operator: "==", value: sessionId }],
      clientSort: { field: "createdAt", direction: "desc" },
    },
    query(
      collection(db, COLLECTIONS.gaps),
      where("sessionId", "==", sessionId)
    )
  )

  return sortByCreatedAtDesc(snapshot.docs.map(toGap))
}

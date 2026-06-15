import type { Timestamp } from "firebase/firestore"

import { learnerName, type LearnerFilter, type LearnerId } from "@/lib/data"
import type { Learner } from "@/lib/types"

export const LEARNING_DATA_CHANGED_EVENT = "learning-data-changed"

export function toFirestoreLearner(learner: LearnerId): Learner {
  return learnerName(learner) as Learner
}

export function firestoreLearnersForFilter(filter: LearnerFilter): Learner[] {
  if (filter === "both") {
    return ["Roman", "Iryna"]
  }

  return [toFirestoreLearner(filter)]
}

export function learnerInitial(learner: Learner) {
  return learner[0] ?? "?"
}

export function formatTimestamp(value: Timestamp | null) {
  if (!value) {
    return "Not scheduled"
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value.toDate())
}

export function announceLearningDataChanged() {
  window.dispatchEvent(new Event(LEARNING_DATA_CHANGED_EVENT))
}

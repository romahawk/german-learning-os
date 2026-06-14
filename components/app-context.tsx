"use client"

import * as React from "react"
import type { LearnerFilter } from "@/lib/data"

export type Screen =
  | "dashboard"
  | "new-session"
  | "review"
  | "vocabulary"
  | "mistakes"
  | "progress"

type AppState = {
  learner: LearnerFilter
  setLearner: (l: LearnerFilter) => void
  screen: Screen
  setScreen: (s: Screen) => void
}

const Ctx = React.createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [learner, setLearner] = React.useState<LearnerFilter>("both")
  const [screen, setScreen] = React.useState<Screen>("dashboard")
  return (
    <Ctx.Provider value={{ learner, setLearner, screen, setScreen }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}

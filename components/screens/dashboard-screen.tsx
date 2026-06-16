"use client"

import * as React from "react"
import {
  Calendar,
  Clock,
  AlertCircle,
  BookOpen,
  Mic,
  PenLine,
  RotateCcw,
  ArrowRight,
  Flame,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useApp } from "@/components/app-context"
import {
  learners,
  sessionModes,
} from "@/lib/data"
import {
  getDueMistakes,
  getDueVocabulary,
  getMistakesByLearner,
  getRecentSessions,
  getVocabularyByLearner,
} from "@/lib/firestore"
import {
  firestoreLearnersForFilter,
  formatTimestamp,
  LEARNING_DATA_CHANGED_EVENT,
  learnerInitial,
} from "@/lib/learning-firestore-ui"
import type { Mistake, Session, Vocabulary } from "@/lib/types"

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Calendar
  label: string
  value: string | number
  hint: string
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 pb-2">
        <CardDescription>{label}</CardDescription>
        <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

export function DashboardScreen() {
  const { learner, setScreen, openSession } = useApp()
  const [recentSessions, setRecentSessions] = React.useState<Session[]>([])
  const [mistakes, setMistakes] = React.useState<Mistake[]>([])
  const [vocabulary, setVocabulary] = React.useState<Vocabulary[]>([])
  const [dueReviews, setDueReviews] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const loadDashboard = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      console.info("[Firestore] Loading sessions...")
      console.info("[Firestore] Loading mistakes...")
      console.info("[Firestore] Loading vocabulary...")

      const selectedLearners = firestoreLearnersForFilter(learner)
      const [
        sessions,
        mistakeGroups,
        vocabularyGroups,
        dueMistakeGroups,
        dueVocabularyGroups,
      ] = await Promise.all([
        getRecentSessions(20),
        Promise.all(selectedLearners.map(getMistakesByLearner)),
        Promise.all(selectedLearners.map(getVocabularyByLearner)),
        Promise.all(selectedLearners.map(getDueMistakes)),
        Promise.all(selectedLearners.map(getDueVocabulary)),
      ])

      const visibleSessions =
        learner === "both"
          ? sessions
          : sessions.filter((session) =>
              selectedLearners.includes(session.learner)
            )

      setRecentSessions(visibleSessions.slice(0, 4))
      setMistakes(mistakeGroups.flat())
      setVocabulary(vocabularyGroups.flat())
      setDueReviews(
        dueMistakeGroups.flat().length + dueVocabularyGroups.flat().length
      )
    } catch (error) {
      console.error("[Firestore] Dashboard load failed", error)
      setError("Could not load dashboard data from Firestore.")
    } finally {
      setLoading(false)
    }
  }, [learner])

  React.useEffect(() => {
    void loadDashboard()

    window.addEventListener(LEARNING_DATA_CHANGED_EVENT, loadDashboard)
    return () =>
      window.removeEventListener(LEARNING_DATA_CHANGED_EVENT, loadDashboard)
  }, [loadDashboard])

  const sessionsThisWeek = recentSessions.length
  const recurringMistakes = mistakes.filter(
    (m) => m.frequency >= 3 && m.status !== "resolved"
  ).length
  const vocabLearned = vocabulary.filter((v) => v.status === "known").length

  const visibleLearners =
    learner === "both" ? learners : learners.filter((l) => l.id === learner)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {visibleLearners.map((l) => (
          <Card key={l.id} className="bg-gradient-to-br from-card to-accent/30">
            <CardContent className="flex items-center gap-4 py-5">
              <Avatar className="size-12 border">
                <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                  {l.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{l.name}</span>
                  <Badge variant="secondary">{l.level}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{l.goal}</p>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-chart-3">
                <Flame className="size-4" />
                {l.streak}d
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Calendar}
          label="Recent sessions"
          value={loading ? "..." : sessionsThisWeek}
          hint="Latest saved Firestore sessions"
        />
        <StatCard
          icon={Clock}
          label="Due reviews"
          value={loading ? "..." : dueReviews}
          hint="Mistakes + vocabulary due"
        />
        <StatCard
          icon={AlertCircle}
          label="Recurring mistakes"
          value={loading ? "..." : recurringMistakes}
          hint="Seen 3+ times, not resolved"
        />
        <StatCard
          icon={BookOpen}
          label="Vocabulary known"
          value={loading ? "..." : vocabLearned}
          hint="Marked known in Firestore"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>Get learning in a single click.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Button
            size="lg"
            className="h-auto justify-start gap-3 py-4"
            onClick={() => setScreen("new-session")}
          >
            <Mic className="size-5" />
            <span className="flex flex-col items-start">
              <span className="font-semibold">Start voice session</span>
              <span className="text-xs font-normal opacity-80">Speak and transcribe</span>
            </span>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="h-auto justify-start gap-3 py-4"
            onClick={() => setScreen("new-session")}
          >
            <PenLine className="size-5" />
            <span className="flex flex-col items-start">
              <span className="font-semibold">Add writing session</span>
              <span className="text-xs font-normal opacity-80">Paste a transcript</span>
            </span>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="h-auto justify-start gap-3 py-4"
            onClick={() => setScreen("review")}
          >
            <RotateCcw className="size-5" />
            <span className="flex flex-col items-start">
              <span className="font-semibold">Review today</span>
              <span className="text-xs font-normal opacity-80">
                {loading ? "Loading" : `${dueReviews} items due`}
              </span>
            </span>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <CardTitle>Recent sessions</CardTitle>
            <CardDescription>Latest saved practice from Firestore.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setScreen("new-session")}>
            New
            <ArrowRight data-icon="inline-end" />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {loading && (
            <p className="text-sm text-muted-foreground">Loading sessions...</p>
          )}

          {!loading && recentSessions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Saved sessions will appear here.
            </p>
          )}

          {!loading &&
            recentSessions.map((s) => {
              const mode = sessionModes.find((m) => m.value === s.mode)
              return (
                <div
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => openSession(s.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      openSession(s.id)
                    }
                  }}
                >
                  <Avatar className="size-9 border">
                    <AvatarFallback className="bg-secondary text-xs font-semibold">
                      {learnerInitial(s.learner)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{s.learner}</span>
                      <Badge variant="outline">{mode?.label ?? s.mode}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {s.duration} min - {formatTimestamp(s.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {s.summary}
                    </p>
                  </div>
                </div>
              )
            })}
        </CardContent>
      </Card>
    </div>
  )
}

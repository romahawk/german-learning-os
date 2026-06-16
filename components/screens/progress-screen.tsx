"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { TrendingUp } from "lucide-react"
import { useApp } from "@/components/app-context"
import {
  getGapsByLearner,
  getMistakesByLearner,
  getRecentSessions,
  getSessionsByLearner,
  getVocabularyByLearner,
} from "@/lib/firestore"
import {
  firestoreLearnersForFilter,
  LEARNING_DATA_CHANGED_EVENT,
} from "@/lib/learning-firestore-ui"
import type { Gap, Mistake, Session, Vocabulary } from "@/lib/types"

const activityConfig: ChartConfig = {
  roman: { label: "Roman", color: "var(--chart-1)" },
  iryna: { label: "Iryna", color: "var(--chart-2)" },
}

const trendConfig: ChartConfig = {
  resolved: { label: "Mistakes resolved", color: "var(--chart-1)" },
  vocab: { label: "Vocabulary known", color: "var(--chart-2)" },
}

type ActivityRow = {
  day: string
  dateKey: string
  roman: number
  iryna: number
}

type TrendRow = {
  week: string
  start: Date
  end: Date
  resolved: number
  vocab: number
}

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub: string
}) {
  return (
    <Card>
      <CardContent className="py-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  )
}

export function ProgressScreen() {
  const { learner } = useApp()
  const [sessions, setSessions] = React.useState<Session[]>([])
  const [mistakes, setMistakes] = React.useState<Mistake[]>([])
  const [vocabulary, setVocabulary] = React.useState<Vocabulary[]>([])
  const [gaps, setGaps] = React.useState<Gap[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const loadProgress = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const selectedLearners = firestoreLearnersForFilter(learner)
      const [sessionRows, mistakeGroups, vocabularyGroups, gapGroups] =
        await Promise.all([
          learner === "both"
            ? getRecentSessions(100)
            : Promise.all(
                selectedLearners.map((selectedLearner) =>
                  getSessionsByLearner(selectedLearner, 100)
                )
              ).then((groups) => groups.flat()),
          Promise.all(selectedLearners.map(getMistakesByLearner)),
          Promise.all(selectedLearners.map(getVocabularyByLearner)),
          Promise.all(selectedLearners.map(getGapsByLearner)),
        ])

      const visibleSessions =
        learner === "both"
          ? sessionRows
          : sessionRows.filter((session) =>
              selectedLearners.includes(session.learner)
            )

      setSessions(visibleSessions)
      setMistakes(mistakeGroups.flat())
      setVocabulary(vocabularyGroups.flat())
      setGaps(gapGroups.flat())
    } catch (error) {
      console.error("[Firestore] Progress load failed", error)
      setError("Could not load progress data from Firestore.")
    } finally {
      setLoading(false)
    }
  }, [learner])

  React.useEffect(() => {
    void loadProgress()

    window.addEventListener(LEARNING_DATA_CHANGED_EVENT, loadProgress)
    return () =>
      window.removeEventListener(LEARNING_DATA_CHANGED_EVENT, loadProgress)
  }, [loadProgress])

  const totalSessions = sessions.length
  const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0)
  const resolvedMistakes = mistakes.filter((item) => item.status === "resolved").length
  const vocabLearned = vocabulary.filter((item) => item.status === "known").length
  const weeklyActivity = buildWeeklyActivity(sessions)
  const progressTrend = buildProgressTrend(mistakes, vocabulary)
  const topGaps = [...gaps]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 4)
  const maxGap = topGaps[0]?.frequency ?? 1

  return (
    <div className="flex flex-col gap-6">
      {loading && (
        <p className="text-sm text-muted-foreground">Loading progress...</p>
      )}

      {!loading && error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && totalSessions === 0 && (
        <Empty className="rounded-xl border py-10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TrendingUp />
            </EmptyMedia>
            <EmptyTitle>No progress data yet</EmptyTitle>
            <EmptyDescription>
              Save a session to start building Firestore-based progress.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {!loading && !error && totalSessions > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Total sessions"
              value={totalSessions}
              sub={`${totalMinutes} minutes practiced`}
            />
            <MetricCard
              label="Mistakes resolved"
              value={resolvedMistakes}
              sub="Marked resolved in Firestore"
            />
            <MetricCard
              label="Vocabulary known"
              value={vocabLearned}
              sub="Marked known in Firestore"
            />
            <MetricCard
              label="Open gaps"
              value={gaps.length}
              sub="Focus areas captured"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly activity</CardTitle>
                <CardDescription>Minutes practiced from saved sessions.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={activityConfig} className="h-64 w-full">
                  <BarChart data={weeklyActivity} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} width={28} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="roman" fill="var(--color-roman)" radius={4} />
                    <Bar dataKey="iryna" fill="var(--color-iryna)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress trend</CardTitle>
                <CardDescription>Resolved mistakes and known vocabulary by week.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={trendConfig} className="h-64 w-full">
                  <LineChart data={progressTrend} accessibilityLayer margin={{ left: 4, right: 8 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} width={28} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line dataKey="resolved" stroke="var(--color-resolved)" strokeWidth={2} dot={false} />
                    <Line dataKey="vocab" stroke="var(--color-vocab)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top recurring gaps</CardTitle>
              <CardDescription>Where to focus the next sessions.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {topGaps.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Saved gaps will appear here.
                </p>
              ) : (
                topGaps.map((gap) => (
                  <div key={gap.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium">{gap.pattern}</span>
                      <span className="flex items-center gap-2 text-muted-foreground">
                        {learner === "both" && (
                          <Badge variant="secondary">{gap.learner}</Badge>
                        )}
                        {gap.frequency}x
                      </span>
                    </div>
                    <Progress value={(gap.frequency / maxGap) * 100} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function buildWeeklyActivity(sessions: Session[]): ActivityRow[] {
  const today = startOfDay(new Date())
  const rows = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))

    return {
      day: new Intl.DateTimeFormat("en", { weekday: "short" }).format(date),
      dateKey: dateKey(date),
      roman: 0,
      iryna: 0,
    }
  })

  for (const session of sessions) {
    const createdAt = session.createdAt?.toDate()

    if (!createdAt) {
      continue
    }

    const row = rows.find((item) => item.dateKey === dateKey(createdAt))

    if (!row) {
      continue
    }

    if (session.learner === "Roman") {
      row.roman += session.duration
    }

    if (session.learner === "Iryna") {
      row.iryna += session.duration
    }
  }

  return rows
}

function buildProgressTrend(
  mistakes: Mistake[],
  vocabulary: Vocabulary[]
): TrendRow[] {
  const currentWeekStart = startOfWeek(new Date())

  const rows = Array.from({ length: 6 }, (_, index) => {
    const start = new Date(currentWeekStart)
    start.setDate(currentWeekStart.getDate() - (5 - index) * 7)
    const end = new Date(start)
    end.setDate(start.getDate() + 7)

    return {
      week: `W${index + 1}`,
      start,
      end,
      resolved: 0,
      vocab: 0,
    }
  })

  for (const mistake of mistakes) {
    if (mistake.status !== "resolved" || !mistake.createdAt) {
      continue
    }

    const row = findTrendRow(rows, mistake.createdAt.toDate())

    if (row) {
      row.resolved += 1
    }
  }

  for (const item of vocabulary) {
    if (item.status !== "known" || !item.createdAt) {
      continue
    }

    const row = findTrendRow(rows, item.createdAt.toDate())

    if (row) {
      row.vocab += 1
    }
  }

  return rows
}

function findTrendRow(rows: TrendRow[], date: Date) {
  return rows.find((row) => date >= row.start && date < row.end)
}

function startOfWeek(date: Date) {
  const start = startOfDay(date)
  const day = start.getDay()
  const offset = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + offset)
  return start
}

function startOfDay(date: Date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return start
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import { Target } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useApp } from "@/components/app-context"
import {
  getGapsByLearner,
  getMistakesByLearner,
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

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

type ActivityRow = {
  day: string
  roman: number
  iryna: number
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
      console.info("[Firestore] Loading sessions...")
      console.info("[Firestore] Loading mistakes...")
      console.info("[Firestore] Loading vocabulary...")

      const selectedLearners = firestoreLearnersForFilter(learner)
      const [sessionGroups, mistakeGroups, vocabularyGroups, gapGroups] =
        await Promise.all([
          Promise.all(
            selectedLearners.map((selectedLearner) =>
              getSessionsByLearner(selectedLearner, 1000)
            )
          ),
          Promise.all(selectedLearners.map(getMistakesByLearner)),
          Promise.all(selectedLearners.map(getVocabularyByLearner)),
          Promise.all(selectedLearners.map(getGapsByLearner)),
        ])

      setSessions(sessionGroups.flat())
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

  const totalMinutes = sessions.reduce(
    (total, session) => total + session.duration,
    0
  )
  const resolvedMistakes = mistakes.filter(
    (mistake) => mistake.status === "resolved"
  ).length
  const vocabLearned = vocabulary.filter(
    (item) => item.status === "known" || item.status === "drilling"
  ).length
  const weeklyActivity = buildWeeklyActivity(sessions)
  const hasWeeklyActivity = weeklyActivity.some(
    (day) => day.roman > 0 || day.iryna > 0
  )
  const topGaps = [...gaps]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 4)
  const maxGap = topGaps[0]?.frequency ?? 1

  return (
    <div className="flex flex-col gap-6">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          label="Total sessions"
          value={loading ? "..." : sessions.length}
          sub={`${loading ? "..." : totalMinutes} minutes practiced`}
        />
        <MetricCard
          label="Mistakes resolved"
          value={loading ? "..." : resolvedMistakes}
          sub="Marked resolved"
        />
        <MetricCard
          label="Vocabulary learned"
          value={loading ? "..." : vocabLearned}
          sub="Known or drilling"
        />
        <MetricCard
          label="Open gaps"
          value={loading ? "..." : gaps.length}
          sub="Focus areas remaining"
        />
        <MetricCard
          label="Total practiced minutes"
          value={loading ? "..." : totalMinutes}
          sub="Across saved sessions"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly activity</CardTitle>
            <CardDescription>Minutes practiced per day.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-8 text-sm text-muted-foreground">
                Loading activity...
              </p>
            ) : hasWeeklyActivity ? (
              <ChartContainer config={activityConfig} className="h-64 w-full">
                <BarChart data={weeklyActivity} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} width={28} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="roman" fill="var(--color-roman)" radius={4} />
                  <Bar dataKey="iryna" fill="var(--color-iryna)" radius={4} />
                </BarChart>
              </ChartContainer>
            ) : (
              <ProgressEmpty
                title="No activity yet"
                description="Saved sessions with a created date will appear here."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress trend</CardTitle>
            <CardDescription>Weekly trend from saved learning data.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-8 text-sm text-muted-foreground">
                Loading trend...
              </p>
            ) : (
              <ProgressEmpty
                title="Not enough data yet"
                description="Save more sessions before showing a weekly progress trend."
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top recurring gaps</CardTitle>
          <CardDescription>Real gaps sorted by frequency.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading gaps...</p>
          ) : topGaps.length > 0 ? (
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
          ) : (
            <ProgressEmpty
              title="No recurring gaps yet"
              description="Saved gaps from analyzed sessions will appear here."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function buildWeeklyActivity(sessions: Session[]): ActivityRow[] {
  const rows = weekdays.map((day) => ({
    day,
    roman: 0,
    iryna: 0,
  }))

  for (const session of sessions) {
    if (!session.createdAt) {
      continue
    }

    const dayIndex = session.createdAt.toDate().getDay()
    const learnerKey = session.learner === "Roman" ? "roman" : "iryna"
    rows[dayIndex][learnerKey] += session.duration
  }

  return rows
}

function ProgressEmpty({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Empty className="rounded-xl border py-8">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Target />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

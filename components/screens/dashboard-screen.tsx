"use client"

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
import { StatusBadge } from "@/components/status-badge"
import {
  dueToday,
  filterByLearner,
  learners,
  learnerName,
  mistakes,
  sessions,
  sessionModes,
  vocabulary,
} from "@/lib/data"

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
  const { learner, setScreen } = useApp()

  const learnerSessions = filterByLearner(sessions, learner)
  const sessionsThisWeek = learnerSessions.length
  const dueReviews =
    dueToday(filterByLearner(mistakes, learner)).length +
    dueToday(filterByLearner(vocabulary, learner)).length
  const recurringMistakes = filterByLearner(mistakes, learner).filter(
    (m) => m.occurrences >= 3 && m.status !== "resolved",
  ).length
  const vocabLearned = filterByLearner(vocabulary, learner).filter(
    (v) => v.status === "review" || v.status === "resolved",
  ).length

  const visibleLearners =
    learner === "both" ? learners : learners.filter((l) => l.id === learner)

  const recentSessions = learnerSessions.slice(0, 4)

  return (
    <div className="flex flex-col gap-6">
      {/* Learner snapshot */}
      <div className="grid gap-4 sm:grid-cols-2">
        {visibleLearners.map((l) => (
          <Card key={l.id} className="bg-gradient-to-br from-card to-accent/30">
            <CardContent className="flex items-center gap-4 py-5">
              <Avatar className="size-12 border">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Calendar}
          label="Sessions this week"
          value={sessionsThisWeek}
          hint="Across all modes"
        />
        <StatCard
          icon={Clock}
          label="Due reviews"
          value={dueReviews}
          hint="Mistakes + vocabulary due today"
        />
        <StatCard
          icon={AlertCircle}
          label="Recurring mistakes"
          value={recurringMistakes}
          hint="Seen 3+ times, not resolved"
        />
        <StatCard
          icon={BookOpen}
          label="Vocabulary learned"
          value={vocabLearned}
          hint="In review or mastered"
        />
      </div>

      {/* Quick actions */}
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
              <span className="text-xs font-normal opacity-80">Speak & transcribe</span>
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
              <span className="text-xs font-normal opacity-80">{dueReviews} items due</span>
            </span>
          </Button>
        </CardContent>
      </Card>

      {/* Recent sessions */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <CardTitle>Recent sessions</CardTitle>
            <CardDescription>Latest practice across the family.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setScreen("new-session")}>
            New
            <ArrowRight data-icon="inline-end" />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {recentSessions.map((s) => {
            const mode = sessionModes.find((m) => m.value === s.mode)
            return (
              <div
                key={s.id}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <Avatar className="size-9 border">
                  <AvatarFallback className="bg-secondary text-xs font-semibold">
                    {learnerName(s.learner)[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{learnerName(s.learner)}</span>
                    <Badge variant="outline">{mode?.label}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {s.duration} min · {s.date}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.summary}</p>
                </div>
                <div className="hidden shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground sm:flex">
                  <span>{s.mistakesFound} fixes</span>
                  <span>+{s.vocabAdded} words</span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

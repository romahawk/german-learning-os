"use client"

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
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/components/app-context"
import {
  filterByLearner,
  gaps,
  learnerName,
  mistakes,
  progressTrend,
  sessions,
  vocabulary,
  weeklyActivity,
} from "@/lib/data"

const activityConfig: ChartConfig = {
  roman: { label: "Roman", color: "var(--chart-1)" },
  iryna: { label: "Iryna", color: "var(--chart-2)" },
}

const trendConfig: ChartConfig = {
  resolved: { label: "Mistakes resolved", color: "var(--chart-1)" },
  vocab: { label: "Vocabulary learned", color: "var(--chart-2)" },
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

  const totalSessions = filterByLearner(sessions, learner).length
  const totalMinutes = filterByLearner(sessions, learner).reduce(
    (a, s) => a + s.duration,
    0,
  )
  const resolvedMistakes = filterByLearner(mistakes, learner).filter(
    (m) => m.status === "resolved",
  ).length
  const vocabLearned = filterByLearner(vocabulary, learner).filter(
    (v) => v.status === "review" || v.status === "resolved",
  ).length

  const topGaps = [...filterByLearner(gaps, learner)]
    .sort((a, b) => b.relatedMistakes - a.relatedMistakes)
    .slice(0, 4)
  const maxGap = topGaps[0]?.relatedMistakes ?? 1

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total sessions" value={totalSessions} sub={`${totalMinutes} minutes practiced`} />
        <MetricCard label="Mistakes resolved" value={resolvedMistakes} sub="Moved to mastered" />
        <MetricCard label="Vocabulary learned" value={vocabLearned} sub="In review or mastered" />
        <MetricCard
          label="Open gaps"
          value={filterByLearner(gaps, learner).length}
          sub="Focus areas remaining"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly activity</CardTitle>
            <CardDescription>Minutes practiced per day.</CardDescription>
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
            <CardDescription>Resolved mistakes & new vocabulary by week.</CardDescription>
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
          {topGaps.map((g) => (
            <div key={g.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium">{g.topic}</span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  {learner === "both" && (
                    <Badge variant="secondary">{learnerName(g.learner)}</Badge>
                  )}
                  {g.relatedMistakes} mistakes
                </span>
              </div>
              <Progress value={(g.relatedMistakes / maxGap) * 100} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

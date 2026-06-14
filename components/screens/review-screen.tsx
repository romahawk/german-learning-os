"use client"

import * as React from "react"
import { Check, Clock, CircleCheck, Target, Volume2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { toast } from "sonner"
import { useApp } from "@/components/app-context"
import { StatusBadge } from "@/components/status-badge"
import {
  dueToday,
  filterByLearner,
  gaps,
  learnerName,
  mistakes,
  vocabulary,
} from "@/lib/data"

function ActionButtons({ id }: { id: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        onClick={() => toast.success("Marked correct", { description: "Pushed further out in the schedule." })}
      >
        <Check data-icon="inline-start" />
        Correct
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => toast("Repeating later", { description: "Will resurface tomorrow." })}
      >
        <Clock data-icon="inline-start" />
        Repeat later
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => toast.success("Resolved", { description: "Moved to mastered." })}
      >
        <CircleCheck data-icon="inline-start" />
        Resolve
      </Button>
    </div>
  )
}

export function ReviewScreen() {
  const { learner } = useApp()

  const dueMistakes = dueToday(filterByLearner(mistakes, learner))
  const dueVocab = dueToday(filterByLearner(vocabulary, learner))
  const learnerGaps = filterByLearner(gaps, learner)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Mistakes due</p>
            <p className="text-2xl font-semibold">{dueMistakes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Vocabulary due</p>
            <p className="text-2xl font-semibold">{dueVocab.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Open gaps</p>
            <p className="text-2xl font-semibold">{learnerGaps.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mistakes">
        <TabsList>
          <TabsTrigger value="mistakes">Mistakes</TabsTrigger>
          <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
          <TabsTrigger value="gaps">Gaps</TabsTrigger>
        </TabsList>

        {/* Mistakes */}
        <TabsContent value="mistakes" className="mt-4 flex flex-col gap-3">
          {dueMistakes.length === 0 ? (
            <DoneEmpty label="No mistakes due today." />
          ) : (
            dueMistakes.map((m) => (
              <Card key={m.id}>
                <CardContent className="flex flex-col gap-3 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{learnerName(m.learner)}</Badge>
                    <Badge variant="outline">{m.category}</Badge>
                    <StatusBadge status={m.status} />
                    <span className="ml-auto text-xs text-muted-foreground">
                      seen {m.occurrences}×
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground line-through">{m.original}</p>
                    <p className="font-medium text-chart-2">{m.correction}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{m.note}</p>
                  </div>
                  <ActionButtons id={m.id} />
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Vocabulary */}
        <TabsContent value="vocabulary" className="mt-4 flex flex-col gap-3">
          {dueVocab.length === 0 ? (
            <DoneEmpty label="No vocabulary due today." />
          ) : (
            dueVocab.map((v) => (
              <Card key={v.id}>
                <CardContent className="flex flex-col gap-3 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{learnerName(v.learner)}</Badge>
                    <Badge variant="outline">{v.category}</Badge>
                    <StatusBadge status={v.status} />
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">
                        {v.article && (
                          <span className="text-muted-foreground">{v.article} </span>
                        )}
                        {v.word}
                      </p>
                      <p className="text-sm text-muted-foreground">{v.meaning}</p>
                      <p className="mt-1 text-sm italic text-foreground/80">
                        &ldquo;{v.example}&rdquo;
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Play pronunciation"
                      onClick={() => toast("Playing audio", { description: v.word })}
                    >
                      <Volume2 />
                    </Button>
                  </div>
                  <ActionButtons id={v.id} />
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Gaps */}
        <TabsContent value="gaps" className="mt-4 flex flex-col gap-3">
          {learnerGaps.length === 0 ? (
            <DoneEmpty label="No open gaps. Great work." />
          ) : (
            learnerGaps.map((g) => (
              <Card key={g.id}>
                <CardContent className="flex flex-col gap-2 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Target className="size-4 text-chart-3" />
                    <span className="font-semibold">{g.topic}</span>
                    <Badge variant="secondary">{learnerName(g.learner)}</Badge>
                    <Badge
                      variant="outline"
                      className={
                        g.severity === "high"
                          ? "border-destructive/40 text-destructive"
                          : g.severity === "medium"
                          ? "border-chart-3/40 text-chart-3"
                          : ""
                      }
                    >
                      {g.severity} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{g.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {g.relatedMistakes} related mistakes
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DoneEmpty({ label }: { label: string }) {
  return (
    <Empty className="border rounded-xl">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleCheck />
        </EmptyMedia>
        <EmptyTitle>All caught up</EmptyTitle>
        <EmptyDescription>{label}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

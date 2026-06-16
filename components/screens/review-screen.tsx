"use client"

import * as React from "react"
import { Check, Clock, CircleCheck, Loader2, Plus, Target, Volume2 } from "lucide-react"
import { Timestamp } from "firebase/firestore"
import {
  Card,
  CardContent,
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
import {
  getDueMistakes,
  getDueVocabulary,
  getGapsByLearner,
  updateMistakeReview,
  updateVocabularyReview,
} from "@/lib/firestore"
import {
  announceLearningDataChanged,
  firestoreLearnersForFilter,
  LEARNING_DATA_CHANGED_EVENT,
} from "@/lib/learning-firestore-ui"
import type { Gap, Mistake, Vocabulary } from "@/lib/types"

type ReviewAction = "mastered" | "repeat" | "practice"

function scheduledTimestamp(daysFromNow: number) {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  date.setHours(9, 0, 0, 0)
  return Timestamp.fromDate(date)
}

function MistakeActionButtons({
  pending,
  onAction,
}: {
  pending: ReviewAction | null
  onAction: (action: ReviewAction) => void
}) {
  const disabled = pending !== null

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        disabled={disabled}
        onClick={() => onAction("mastered")}
      >
        {pending === "mastered" ? (
          <Loader2 data-icon="inline-start" className="animate-spin" />
        ) : (
          <Check data-icon="inline-start" />
        )}
        Mark resolved
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onAction("repeat")}
      >
        {pending === "repeat" ? (
          <Loader2 data-icon="inline-start" className="animate-spin" />
        ) : (
          <Clock data-icon="inline-start" />
        )}
        Repeat later
      </Button>
      <Button
        size="sm"
        variant="secondary"
        disabled={disabled}
        onClick={() => onAction("practice")}
      >
        {pending === "practice" ? (
          <Loader2 data-icon="inline-start" className="animate-spin" />
        ) : (
          <Plus data-icon="inline-start" />
        )}
        Increase frequency
      </Button>
    </div>
  )
}

function VocabularyActionButtons({
  pending,
  onAction,
}: {
  pending: ReviewAction | null
  onAction: (action: ReviewAction) => void
}) {
  const disabled = pending !== null

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        disabled={disabled}
        onClick={() => onAction("mastered")}
      >
        {pending === "mastered" ? (
          <Loader2 data-icon="inline-start" className="animate-spin" />
        ) : (
          <Check data-icon="inline-start" />
        )}
        Mark known
      </Button>
      <Button
        size="sm"
        variant="secondary"
        disabled={disabled}
        onClick={() => onAction("practice")}
      >
        {pending === "practice" ? (
          <Loader2 data-icon="inline-start" className="animate-spin" />
        ) : (
          <Plus data-icon="inline-start" />
        )}
        Still learning
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onAction("repeat")}
      >
        {pending === "repeat" ? (
          <Loader2 data-icon="inline-start" className="animate-spin" />
        ) : (
          <Clock data-icon="inline-start" />
        )}
        Repeat later
      </Button>
    </div>
  )
}

export function ReviewScreen() {
  const { learner } = useApp()
  const [dueMistakes, setDueMistakes] = React.useState<Mistake[]>([])
  const [dueVocab, setDueVocab] = React.useState<Vocabulary[]>([])
  const [recentGaps, setRecentGaps] = React.useState<Gap[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [completedCount, setCompletedCount] = React.useState(0)
  const [pendingMistakeAction, setPendingMistakeAction] = React.useState<
    Record<string, ReviewAction>
  >({})
  const [pendingVocabularyAction, setPendingVocabularyAction] = React.useState<
    Record<string, ReviewAction>
  >({})

  const loadReview = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const learners = firestoreLearnersForFilter(learner)
      const [mistakes, vocabulary, gaps] = await Promise.all([
        Promise.all(learners.map(getDueMistakes)),
        Promise.all(learners.map(getDueVocabulary)),
        Promise.all(learners.map(getGapsByLearner)),
      ])

      setDueMistakes(mistakes.flat())
      setDueVocab(vocabulary.flat())
      setRecentGaps(
        gaps
          .flat()
          .sort(
            (a, b) =>
              (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)
          )
          .slice(0, 8)
      )
    } catch {
      setError("Could not load review data from Firestore.")
    } finally {
      setLoading(false)
    }
  }, [learner])

  React.useEffect(() => {
    void loadReview()

    window.addEventListener(LEARNING_DATA_CHANGED_EVENT, loadReview)
    return () =>
      window.removeEventListener(LEARNING_DATA_CHANGED_EVENT, loadReview)
  }, [loadReview])

  async function reviewMistake(mistake: Mistake, action: ReviewAction) {
    setPendingMistakeAction((current) => ({
      ...current,
      [mistake.id]: action,
    }))

    try {
      if (action === "mastered") {
        await updateMistakeReview(mistake.id, {
          status: "resolved",
          nextReview: scheduledTimestamp(30),
        })
      }

      if (action === "repeat") {
        await updateMistakeReview(mistake.id, {
          status: mistake.status === "new" ? "new" : "recurring",
          nextReview: scheduledTimestamp(3),
        })
      }

      if (action === "practice") {
        await updateMistakeReview(mistake.id, {
          status: "recurring",
          frequency: mistake.frequency + 1,
          nextReview: scheduledTimestamp(1),
        })
      }

      setCompletedCount((count) => count + 1)
      announceLearningDataChanged()
      toast.success("Mistake review saved")
    } catch (error) {
      console.error("[Firestore] Mistake review update failed", error)
      toast.error("Could not save mistake review.")
    } finally {
      setPendingMistakeAction((current) => {
        const next = { ...current }
        delete next[mistake.id]
        return next
      })
    }
  }

  async function reviewVocabulary(item: Vocabulary, action: ReviewAction) {
    setPendingVocabularyAction((current) => ({
      ...current,
      [item.id]: action,
    }))

    try {
      if (action === "mastered") {
        await updateVocabularyReview(item.id, {
          status: "known",
          nextReview: scheduledTimestamp(30),
        })
      }

      if (action === "practice") {
        await updateVocabularyReview(item.id, {
          status: "drilling",
          frequency: item.frequency + 1,
          nextReview: scheduledTimestamp(1),
        })
      }

      if (action === "repeat") {
        await updateVocabularyReview(item.id, {
          status: item.status === "known" ? "known" : item.status,
          nextReview: scheduledTimestamp(3),
        })
      }

      setCompletedCount((count) => count + 1)
      announceLearningDataChanged()
      toast.success("Vocabulary review saved")
    } catch (error) {
      console.error("[Firestore] Vocabulary review update failed", error)
      toast.error("Could not save vocabulary review.")
    } finally {
      setPendingVocabularyAction((current) => {
        const next = { ...current }
        delete next[item.id]
        return next
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <p className="text-sm text-muted-foreground">Recent gaps</p>
            <p className="text-2xl font-semibold">{recentGaps.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Completed now</p>
            <p className="text-2xl font-semibold">{completedCount}</p>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading review items...</p>
      )}

      {!loading && error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && (
        <Tabs defaultValue="mistakes">
          <TabsList>
            <TabsTrigger value="mistakes">Mistakes</TabsTrigger>
            <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
            <TabsTrigger value="gaps">Gaps</TabsTrigger>
          </TabsList>

          <TabsContent value="mistakes" className="mt-4 flex flex-col gap-3">
            {dueMistakes.length === 0 ? (
              <DoneEmpty label="No mistakes due today." />
            ) : (
              dueMistakes.map((m) => (
                <Card key={m.id}>
                  <CardContent className="flex flex-col gap-3 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{m.category}</Badge>
                      <Badge variant="secondary">{m.status}</Badge>
                      <span className="ml-auto text-xs text-muted-foreground">
                        seen {m.frequency}x
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground line-through">
                        {m.original}
                      </p>
                      <p className="font-medium text-chart-2">{m.correction}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {m.rule}
                      </p>
                    </div>
                    <MistakeActionButtons
                      pending={pendingMistakeAction[m.id] ?? null}
                      onAction={(action) => void reviewMistake(m, action)}
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="vocabulary" className="mt-4 flex flex-col gap-3">
            {dueVocab.length === 0 ? (
              <DoneEmpty label="No vocabulary due today." />
            ) : (
              dueVocab.map((v) => (
                <Card key={v.id}>
                  <CardContent className="flex flex-col gap-3 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{v.pos}</Badge>
                      <Badge variant="secondary">{v.status}</Badge>
                      <span className="ml-auto text-xs text-muted-foreground">
                        seen {v.frequency}x
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold">{v.word}</p>
                        <p className="text-sm text-muted-foreground">
                          {v.meaning}
                        </p>
                        <p className="mt-1 text-sm italic text-foreground/80">
                          &ldquo;{v.exampleSentence}&rdquo;
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Play pronunciation"
                        onClick={() =>
                          toast("Audio is not wired yet.", {
                            description: v.word,
                          })
                        }
                      >
                        <Volume2 />
                      </Button>
                    </div>
                    <VocabularyActionButtons
                      pending={pendingVocabularyAction[v.id] ?? null}
                      onAction={(action) => void reviewVocabulary(v, action)}
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="gaps" className="mt-4 flex flex-col gap-3">
            {recentGaps.length === 0 ? (
              <DoneEmpty label="No recent gaps found." />
            ) : (
              recentGaps.map((g) => (
                <Card key={g.id}>
                  <CardContent className="flex flex-col gap-2 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Target className="size-4 text-chart-3" />
                      <span className="font-semibold">{g.pattern}</span>
                      <Badge variant="secondary">x{g.frequency}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {g.suggestedDrill}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function DoneEmpty({ label }: { label: string }) {
  return (
    <Empty className="rounded-xl border">
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

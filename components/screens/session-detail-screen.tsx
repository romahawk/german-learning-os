"use client"

import * as React from "react"
import { AlertCircle, ArrowLeft, BookOpen, Calendar, Clock, Target } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { useApp } from "@/components/app-context"
import {
  getGapsBySession,
  getMistakesBySession,
  getSessionById,
  getVocabularyBySession,
} from "@/lib/firestore"
import { formatTimestamp, LEARNING_DATA_CHANGED_EVENT } from "@/lib/learning-firestore-ui"
import { sessionModes } from "@/lib/data"
import { getGrammarItemById } from "@/lib/grammar"
import {
  getRoadmapById,
  getRoadmapMilestone,
  getRoadmapPhase,
} from "@/lib/roadmaps"
import type { Gap, Mistake, Session, Vocabulary } from "@/lib/types"

export function SessionDetailScreen() {
  const { selectedSessionId, setScreen } = useApp()
  const [session, setSession] = React.useState<Session | null>(null)
  const [mistakes, setMistakes] = React.useState<Mistake[]>([])
  const [vocabulary, setVocabulary] = React.useState<Vocabulary[]>([])
  const [gaps, setGaps] = React.useState<Gap[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const loadSession = React.useCallback(async () => {
    if (!selectedSessionId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [sessionData, mistakeRows, vocabularyRows, gapRows] = await Promise.all([
        getSessionById(selectedSessionId),
        getMistakesBySession(selectedSessionId),
        getVocabularyBySession(selectedSessionId),
        getGapsBySession(selectedSessionId),
      ])

      setSession(sessionData)
      setMistakes(mistakeRows)
      setVocabulary(vocabularyRows)
      setGaps(gapRows)
    } catch (error) {
      console.error("[Firestore] Session detail load failed", error)
      setError("Could not load this session from Firestore.")
    } finally {
      setLoading(false)
    }
  }, [selectedSessionId])

  React.useEffect(() => {
    void loadSession()

    window.addEventListener(LEARNING_DATA_CHANGED_EVENT, loadSession)
    return () => window.removeEventListener(LEARNING_DATA_CHANGED_EVENT, loadSession)
  }, [loadSession])

  const mode = sessionModes.find((item) => item.value === session?.mode)
  const roadmap = getRoadmapById(session?.roadmapId)
  const roadmapPhase = getRoadmapPhase(session?.roadmapId, session?.phaseId)
  const roadmapMilestone = getRoadmapMilestone(
    session?.roadmapId,
    session?.phaseId,
    session?.milestoneId
  )
  const grammarFocus = getGrammarItemById(session?.grammarFocusId)

  if (!selectedSessionId) {
    return (
      <Empty className="rounded-xl border py-10">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Calendar />
          </EmptyMedia>
          <EmptyTitle>No session selected</EmptyTitle>
          <EmptyDescription>Open a saved session from the dashboard.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => setScreen("dashboard")}>
          <ArrowLeft data-icon="inline-start" />
          Dashboard
        </Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading session...</p>}

      {!loading && error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && !session && (
        <Empty className="rounded-xl border py-10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircle />
            </EmptyMedia>
            <EmptyTitle>Session not found</EmptyTitle>
            <EmptyDescription>This session may have been removed.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {!loading && !error && session && (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <CardTitle>{session.learner} session</CardTitle>
                  <CardDescription>
                    {formatTimestamp(session.createdAt)}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{mode?.label ?? session.mode}</Badge>
                  <Badge variant="secondary">
                    <Clock className="size-3" />
                    {session.duration} min
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {session.summary}
              </p>
              <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                <p className="mb-1 font-medium">Next focus</p>
                <p className="text-muted-foreground">{session.nextFocus}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                <p className="mb-2 font-medium">Roadmap link</p>
                {roadmap ? (
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{roadmap.title}</Badge>
                    {roadmapPhase && (
                      <Badge variant="secondary">{roadmapPhase.title}</Badge>
                    )}
                    {roadmapMilestone && (
                      <Badge variant="secondary">{roadmapMilestone.title}</Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No roadmap linked.</p>
                )}
              </div>
              {grammarFocus && (
                <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                  <p className="mb-2 font-medium">Grammar focus</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{grammarFocus.level}</Badge>
                    <Badge variant="secondary">{grammarFocus.title}</Badge>
                    {grammarFocus.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {session.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-1 text-sm font-medium">Notes / transcript</p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {session.notes}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <LinkedCount icon={AlertCircle} label="Mistakes" value={mistakes.length} />
            <LinkedCount icon={BookOpen} label="Vocabulary" value={vocabulary.length} />
            <LinkedCount icon={Target} label="Gaps" value={gaps.length} />
          </div>

          <LinkedSection title="Mistakes" icon={AlertCircle}>
            {mistakes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No linked mistakes saved.</p>
            ) : (
              mistakes.map((item) => (
                <div key={item.id} className="rounded-lg border p-3 text-sm">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    <Badge variant="outline">{item.category}</Badge>
                    <Badge variant="secondary">{item.status}</Badge>
                    <Badge variant="secondary">x{item.frequency}</Badge>
                  </div>
                  <p className="text-muted-foreground line-through">{item.original}</p>
                  <p className="font-medium text-chart-2">{item.correction}</p>
                  <p className="mt-1 text-muted-foreground">{item.rule}</p>
                </div>
              ))
            )}
          </LinkedSection>

          <LinkedSection title="Vocabulary" icon={BookOpen}>
            {vocabulary.length === 0 ? (
              <p className="text-sm text-muted-foreground">No linked vocabulary saved.</p>
            ) : (
              vocabulary.map((item) => (
                <div key={item.id} className="rounded-lg border p-3 text-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{item.word}</p>
                      <p className="text-muted-foreground">{item.meaning}</p>
                    </div>
                    <Badge variant="secondary">{item.status}</Badge>
                  </div>
                  <p className="mt-2 italic text-foreground/80">
                    &ldquo;{item.exampleSentence}&rdquo;
                  </p>
                  <p className="mt-1 text-muted-foreground">{item.usageTip}</p>
                </div>
              ))
            )}
          </LinkedSection>

          <LinkedSection title="Gaps" icon={Target}>
            {gaps.length === 0 ? (
              <p className="text-sm text-muted-foreground">No linked gaps saved.</p>
            ) : (
              gaps.map((item) => (
                <div key={item.id} className="rounded-lg border p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{item.pattern}</span>
                    <Badge variant="secondary">x{item.frequency}</Badge>
                  </div>
                  <p className="mt-1 text-muted-foreground">{item.suggestedDrill}</p>
                </div>
              ))
            )}
          </LinkedSection>
        </>
      )}
    </div>
  )
}

function LinkedCount({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof AlertCircle
  label: string
  value: number
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 py-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-4" />
        </div>
      </CardContent>
    </Card>
  )
}

function LinkedSection({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: typeof AlertCircle
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">{children}</CardContent>
    </Card>
  )
}

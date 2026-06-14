"use client"

import * as React from "react"
import {
  Mic,
  Sparkles,
  AlertCircle,
  BookOpen,
  Target,
  Loader2,
  Check,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { toast } from "sonner"
import { useApp } from "@/components/app-context"
import {
  learners,
  sessionModes,
  type LearnerId,
  type SessionMode,
} from "@/lib/data"

type Analysis = {
  summary: string
  mistakes: { original: string; correction: string; category: string }[]
  vocab: { word: string; meaning: string }[]
  gaps: string[]
}

const SAMPLE_ANALYSIS: Analysis = {
  summary:
    "Confident speaking with good range. Main issues were genitive prepositions and verb placement in subordinate clauses. Vocabulary around the workplace is growing well.",
  mistakes: [
    { original: "Wegen dem Stau", correction: "Wegen des Staus", category: "Genitive case" },
    { original: "...weil ich habe keine Zeit", correction: "...weil ich keine Zeit habe", category: "Word order" },
    { original: "Ich freue mich für das Treffen", correction: "Ich freue mich auf das Treffen", category: "Preposition" },
  ],
  vocab: [
    { word: "die Besprechung", meaning: "meeting" },
    { word: "fristgerecht", meaning: "on time / within deadline" },
    { word: "die Tagesordnung", meaning: "agenda" },
  ],
  gaps: ["Genitive prepositions (wegen, trotz)", "Verb-final order after 'weil'"],
}

export function NewSessionScreen() {
  const { learner } = useApp()
  const defaultLearner: LearnerId =
    learner === "both" ? "roman" : (learner as LearnerId)

  const [selectedLearner, setSelectedLearner] = React.useState<LearnerId>(defaultLearner)
  const [mode, setMode] = React.useState<SessionMode>("conversation")
  const [duration, setDuration] = React.useState("20")
  const [notes, setNotes] = React.useState("")
  const [analyzing, setAnalyzing] = React.useState(false)
  const [result, setResult] = React.useState<Analysis | null>(null)

  React.useEffect(() => {
    setSelectedLearner(defaultLearner)
  }, [defaultLearner])

  function analyze() {
    if (!notes.trim()) {
      toast.error("Add some notes or a transcript first.")
      return
    }
    setAnalyzing(true)
    setResult(null)
    setTimeout(() => {
      setAnalyzing(false)
      setResult(SAMPLE_ANALYSIS)
      toast.success("Session analyzed", {
        description: `${SAMPLE_ANALYSIS.mistakes.length} fixes and ${SAMPLE_ANALYSIS.vocab.length} new words found.`,
      })
    }, 1600)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>New session</CardTitle>
          <CardDescription>
            Capture a practice session, then let the assistant extract mistakes,
            vocabulary, and gaps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Learner</FieldLabel>
              <ToggleGroup
                value={[selectedLearner]}
                onValueChange={(v) => v[0] && setSelectedLearner(v[0] as LearnerId)}
                variant="outline"
                className="justify-start"
              >
                {learners.map((l) => (
                  <ToggleGroupItem key={l.id} value={l.id} className="px-5">
                    {l.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>

            <Field>
              <FieldLabel>Mode</FieldLabel>
              <ToggleGroup
                value={[mode]}
                onValueChange={(v) => v[0] && setMode(v[0] as SessionMode)}
                variant="outline"
                className="flex-wrap justify-start"
              >
                {sessionModes.map((m) => (
                  <ToggleGroupItem key={m.value} value={m.value} className="px-4">
                    {m.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <FieldDescription>
                {sessionModes.find((m) => m.value === mode)?.description}
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Duration</FieldLabel>
              <ToggleGroup
                value={[duration]}
                onValueChange={(v) => v[0] && setDuration(v[0])}
                variant="outline"
                className="justify-start"
              >
                {["10", "15", "20", "30", "45"].map((d) => (
                  <ToggleGroupItem key={d} value={d} className="px-4">
                    {d}m
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Notes / transcript</FieldLabel>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste a transcript or jot down what was practiced, sentences spoken, and anything that felt hard…"
                className="min-h-44 resize-y"
              />
              <FieldDescription>
                Tip: paste a voice-to-text transcript for the richest analysis.
              </FieldDescription>
            </Field>

            <div className="flex flex-wrap gap-3">
              <Button onClick={analyze} disabled={analyzing}>
                {analyzing ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : (
                  <Sparkles data-icon="inline-start" />
                )}
                {analyzing ? "Analyzing…" : "Analyze session"}
              </Button>
              <Button variant="outline" type="button">
                <Mic data-icon="inline-start" />
                Record voice
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Preview panel */}
      <Card className="lg:sticky lg:top-6 h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            AI result
          </CardTitle>
          <CardDescription>Extracted insights from the session.</CardDescription>
        </CardHeader>
        <CardContent>
          {analyzing && (
            <div className="flex flex-col items-center gap-3 py-10 text-center text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-sm">Listening for mistakes & vocabulary…</p>
            </div>
          )}

          {!analyzing && !result && (
            <Empty className="py-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Sparkles />
                </EmptyMedia>
                <EmptyTitle>No analysis yet</EmptyTitle>
                <EmptyDescription>
                  Add your session notes and press Analyze to see results here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {!analyzing && result && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {result.summary}
                </p>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <AlertCircle className="size-4 text-destructive" />
                  Mistakes ({result.mistakes.length})
                </h4>
                {result.mistakes.map((m, i) => (
                  <div key={i} className="rounded-lg border p-3 text-sm">
                    <p className="text-muted-foreground line-through">{m.original}</p>
                    <p className="font-medium text-chart-2">{m.correction}</p>
                    <Badge variant="outline" className="mt-1.5">
                      {m.category}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <BookOpen className="size-4 text-primary" />
                  Vocabulary ({result.vocab.length})
                </h4>
                <div className="flex flex-col gap-1.5">
                  {result.vocab.map((v, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                    >
                      <span className="font-medium">{v.word}</span>
                      <span className="text-muted-foreground">{v.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <Target className="size-4 text-chart-3" />
                  Gaps
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.gaps.map((g, i) => (
                    <Badge key={i} variant="secondary">
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() =>
                  toast.success("Saved to library", {
                    description: "Mistakes and vocabulary scheduled for review.",
                  })
                }
              >
                <Check data-icon="inline-start" />
                Save to library
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

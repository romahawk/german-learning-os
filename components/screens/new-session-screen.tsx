"use client"

import * as React from "react"
import {
  Mic,
  Upload,
  Square,
  Sparkles,
  AlertCircle,
  BookOpen,
  Target,
  Loader2,
  Save,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { grammarItems, selectedGrammarFocusStorageKey } from "@/lib/grammar"
import { roadmaps } from "@/lib/roadmaps"
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
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { toast } from "sonner"
import { useApp } from "@/components/app-context"
import {
  learners,
  learnerName,
  sessionModes,
  type LearnerId,
  type SessionMode,
} from "@/lib/data"
import {
  saveGaps,
  saveMistakes,
  saveSession,
  saveVocabularyItems,
} from "@/lib/firestore"
import {
  announceLearningDataChanged,
  toFirestoreLearner,
} from "@/lib/learning-firestore-ui"
import type { MistakeCategory } from "@/lib/types"

type Analysis = {
  summary: string
  nextFocus: string
  mistakes: {
    original: string
    correction: string
    category: string
    rule: string
    status: "new" | "recurring" | "resolved"
    frequency: number
  }[]
  vocabulary: {
    word: string
    pos: "noun" | "verb" | "adj" | "adv" | "phrase" | "idiom"
    meaning: string
    exampleSentence: string
    usageTip: string
    status: "new" | "drilling" | "known"
    frequency: number
  }[]
  gaps: {
    pattern: string
    frequency: number
    suggestedDrill: string
  }[]
}

type TranscriptionResponse = {
  transcript: string
  fileName: string
  fileSize: number
}

export function NewSessionScreen() {
  const { learner } = useApp()
  const defaultLearner: LearnerId =
    learner === "both" ? "roman" : (learner as LearnerId)

  const [selectedLearner, setSelectedLearner] =
    React.useState<LearnerId>(defaultLearner)
  const [mode, setMode] = React.useState<SessionMode>("conversation")
  const [duration, setDuration] = React.useState("20")
  const [notes, setNotes] = React.useState("")
  const [selectedRoadmapId, setSelectedRoadmapId] = React.useState("none")
  const [selectedPhaseId, setSelectedPhaseId] = React.useState("none")
  const [selectedMilestoneId, setSelectedMilestoneId] = React.useState("none")
  const [selectedGrammarFocusId, setSelectedGrammarFocusId] =
    React.useState("none")
  const [analyzing, setAnalyzing] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [transcribing, setTranscribing] = React.useState(false)
  const [recording, setRecording] = React.useState(false)
  const [result, setResult] = React.useState<Analysis | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [saveError, setSaveError] = React.useState<string | null>(null)
  const [audioError, setAudioError] = React.useState<string | null>(null)
  const [audioFileName, setAudioFileName] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const audioChunksRef = React.useRef<Blob[]>([])
  const selectedRoadmap =
    roadmaps.find((roadmap) => roadmap.id === selectedRoadmapId) ?? null
  const selectedPhase =
    selectedRoadmap?.phases.find((phase) => phase.id === selectedPhaseId) ??
    null
  const selectedMilestone =
    selectedPhase?.milestones.find(
      (milestone) => milestone.id === selectedMilestoneId
    ) ?? null
  const selectedGrammarFocus =
    grammarItems.find((item) => item.id === selectedGrammarFocusId) ?? null

  React.useEffect(() => {
    setSelectedLearner(defaultLearner)
  }, [defaultLearner])

  React.useEffect(() => {
    setSelectedPhaseId("none")
    setSelectedMilestoneId("none")
  }, [selectedRoadmapId])

  React.useEffect(() => {
    setSelectedMilestoneId("none")
  }, [selectedPhaseId])

  React.useEffect(() => {
    const savedGrammarFocusId = window.localStorage.getItem(
      selectedGrammarFocusStorageKey
    )

    if (
      savedGrammarFocusId &&
      grammarItems.some((item) => item.id === savedGrammarFocusId)
    ) {
      setSelectedGrammarFocusId(savedGrammarFocusId)
    }
  }, [])

  React.useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop()
      }
      mediaRecorderRef.current?.stream
        .getTracks()
        .forEach((track) => track.stop())
    }
  }, [])

  function appendTranscript(transcript: string, sourceLabel: string) {
    const trimmedTranscript = transcript.trim()

    if (!trimmedTranscript) {
      toast.error("Transcription returned no text.")
      return
    }

    setNotes((currentNotes) => {
      const separator = currentNotes.trim() ? "\n\n" : ""
      return `${currentNotes}${separator}[Audio transcript - ${sourceLabel}]\n${trimmedTranscript}`
    })
    setResult(null)
    setError(null)
    toast.success("Transcript added", {
      description: "Review it, then analyze the session.",
    })
  }

  async function transcribeAudio(file: File) {
    setTranscribing(true)
    setAudioError(null)
    setAudioFileName(file.name)

    try {
      const formData = new FormData()
      formData.append("audio", file)

      const response = await fetch("/api/transcribe-audio", {
        method: "POST",
        body: formData,
      })
      const data = (await response.json()) as
        | TranscriptionResponse
        | { error?: string }

      if (!response.ok) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Failed to transcribe audio."
        )
      }

      appendTranscript((data as TranscriptionResponse).transcript, file.name)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to transcribe audio."
      setAudioError(message)
      toast.error("Transcription failed", {
        description: message,
      })
    } finally {
      setTranscribing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  function handleAudioUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    void transcribeAudio(file)
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Voice recording is not supported in this browser.")
      return
    }

    setAudioError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      audioChunksRef.current = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        setRecording(false)

        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        })

        if (blob.size === 0) {
          toast.error("Recording was empty.")
          return
        }

        const recordedFile = new File(
          [blob],
          `voice-session-${new Date().toISOString().replace(/[:.]/g, "-")}.webm`,
          { type: blob.type }
        )

        void transcribeAudio(recordedFile)
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setRecording(true)
      toast.success("Recording started")
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not start voice recording."
      setAudioError(message)
      toast.error("Recording failed", {
        description: message,
      })
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop()
    }
  }

  async function analyze() {
    if (!notes.trim()) {
      toast.error("Add some notes or a transcript first.")
      return
    }

    const parsedDuration = Number(duration)

    if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
      toast.error("Choose a valid duration.")
      return
    }

    setAnalyzing(true)
    setResult(null)
    setError(null)
    setSaveError(null)

    try {
      const response = await fetch("/api/analyze-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          learner: learnerName(selectedLearner),
          mode,
          duration: parsedDuration,
          notes,
        }),
      })

      const data = (await response.json()) as Analysis | { error?: string }

      if (!response.ok) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Failed to analyze session."
        )
      }

      const analysis = data as Analysis
      setResult(analysis)
      toast.success("Session analyzed", {
        description: `${analysis.mistakes.length} fixes and ${analysis.vocabulary.length} vocabulary items found.`,
      })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to analyze session."
      setError(message)
      toast.error("Analysis failed", {
        description: message,
      })
    } finally {
      setAnalyzing(false)
    }
  }

  async function saveLearningSession() {
    if (!result || saving) {
      return
    }

    const parsedDuration = Number(duration)

    if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
      toast.error("Choose a valid duration before saving.")
      return
    }

    const firestoreLearner = toFirestoreLearner(selectedLearner)

    setSaving(true)
    setSaveError(null)

    try {
      let sessionId: string

      try {
        sessionId = await saveSession({
          learner: firestoreLearner,
          mode,
          duration: parsedDuration,
          notes,
          summary: result.summary,
          nextFocus: result.nextFocus,
          roadmapId: selectedRoadmap?.id,
          phaseId: selectedPhase?.id,
          milestoneId: selectedMilestone?.id,
          grammarFocusId: selectedGrammarFocus?.id,
        })
      } catch (err) {
        throw new Error("Could not save the session summary. Please try again.")
      }

      try {
        await saveMistakes(
          result.mistakes.map((mistake) => ({
            sessionId,
            learner: firestoreLearner,
            original: mistake.original,
            correction: mistake.correction,
            category: mistake.category as MistakeCategory,
            rule: mistake.rule,
            status: "new",
            frequency: 1,
            nextReview: null,
          }))
        )
      } catch {
        throw new Error("Session saved, but mistakes could not be saved.")
      }

      try {
        await saveVocabularyItems(
          result.vocabulary.map((item) => ({
            sessionId,
            learner: firestoreLearner,
            word: item.word,
            pos: item.pos,
            meaning: item.meaning,
            exampleSentence: item.exampleSentence,
            usageTip: item.usageTip,
            status: "new",
            frequency: 1,
            nextReview: null,
          }))
        )
      } catch {
        throw new Error("Session saved, but vocabulary could not be saved.")
      }

      try {
        await saveGaps(
          result.gaps.map((gap) => ({
            sessionId,
            learner: firestoreLearner,
            pattern: gap.pattern,
            frequency: gap.frequency,
            suggestedDrill: gap.suggestedDrill,
          }))
        )
      } catch {
        throw new Error("Session saved, but gaps could not be saved.")
      }

      announceLearningDataChanged()
      setNotes("")
      setResult(null)
      setError(null)
      toast.success("Session saved successfully")
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not save this learning session."
      setSaveError(message)
      toast.error("Save failed", {
        description: message,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
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
                onValueChange={(v) =>
                  v[0] && setSelectedLearner(v[0] as LearnerId)
                }
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
              <FieldLabel htmlFor="roadmap">Roadmap link</FieldLabel>
              <select
                id="roadmap"
                value={selectedRoadmapId}
                onChange={(event) => setSelectedRoadmapId(event.target.value)}
                className="h-8 w-full max-w-md rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="none">No roadmap</option>
                {roadmaps.map((roadmap) => (
                  <option key={roadmap.id} value={roadmap.id}>
                    {roadmap.title}
                  </option>
                ))}
              </select>
              <FieldDescription>
                Optional. Link this session to a learning milestone without changing milestone progress automatically.
              </FieldDescription>
            </Field>

            {selectedRoadmap && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="roadmap-phase">Phase</FieldLabel>
                  <select
                    id="roadmap-phase"
                    value={selectedPhaseId}
                    onChange={(event) => setSelectedPhaseId(event.target.value)}
                    className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="none">No phase</option>
                    {selectedRoadmap.phases.map((phase) => (
                      <option key={phase.id} value={phase.id}>
                        {phase.title}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="roadmap-milestone">Milestone</FieldLabel>
                  <select
                    id="roadmap-milestone"
                    value={selectedMilestoneId}
                    onChange={(event) => setSelectedMilestoneId(event.target.value)}
                    disabled={!selectedPhase}
                    className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="none">No milestone</option>
                    {selectedPhase?.milestones.map((milestone) => (
                      <option key={milestone.id} value={milestone.id}>
                        {milestone.title}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="grammar-focus">Grammar focus</FieldLabel>
              <select
                id="grammar-focus"
                value={selectedGrammarFocusId}
                onChange={(event) =>
                  setSelectedGrammarFocusId(event.target.value)
                }
                className="h-8 w-full max-w-md rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="none">No grammar focus</option>
                {grammarItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.level} - {item.title}
                  </option>
                ))}
              </select>
              <FieldDescription>
                Optional. Save a reference topic with this session for later review.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Notes / transcript</FieldLabel>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste a transcript or jot down what was practiced, sentences spoken, and anything that felt hard..."
                className="min-h-44 resize-y"
              />
              <FieldDescription>
                Tip: paste a voice-to-text transcript for the richest analysis.
              </FieldDescription>
            </Field>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={analyze}
                disabled={analyzing || saving || transcribing}
              >
                {analyzing ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : (
                  <Sparkles data-icon="inline-start" />
                )}
                {analyzing ? "Analyzing..." : "Analyze session"}
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/webm,video/mp4"
                className="hidden"
                onChange={handleAudioUpload}
              />
              <Button
                variant="outline"
                type="button"
                disabled={analyzing || saving || transcribing || recording}
                onClick={() => fileInputRef.current?.click()}
              >
                {transcribing && !recording ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : (
                  <Upload data-icon="inline-start" />
                )}
                {transcribing && !recording ? "Transcribing..." : "Upload audio"}
              </Button>
              <Button
                variant={recording ? "destructive" : "outline"}
                type="button"
                disabled={analyzing || saving || transcribing}
                onClick={recording ? stopRecording : () => void startRecording()}
              >
                {recording ? (
                  <Square data-icon="inline-start" />
                ) : (
                  <Mic data-icon="inline-start" />
                )}
                {recording ? "Stop recording" : "Record voice"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={saveLearningSession}
                disabled={!result || analyzing || saving || transcribing || recording}
              >
                {saving ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : (
                  <Save data-icon="inline-start" />
                )}
                {saving ? "Saving..." : "Save Learning Session"}
              </Button>
            </div>
            {saveError && (
              <p className="text-sm text-destructive">{saveError}</p>
            )}
            {audioError && (
              <p className="text-sm text-destructive">{audioError}</p>
            )}
            {audioFileName && !audioError && (
              <p className="text-sm text-muted-foreground">
                Last audio source: {audioFileName}
              </p>
            )}
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="h-fit lg:sticky lg:top-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            AI result
          </CardTitle>
          <CardDescription>
            Preview only. Nothing is saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analyzing && (
            <div className="flex flex-col items-center gap-3 py-10 text-center text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-sm">Reading for mistakes and vocabulary...</p>
            </div>
          )}

          {!analyzing && error && (
            <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
              <div className="flex items-center gap-2 font-medium text-destructive">
                <AlertCircle className="size-4" />
                Analysis failed
              </div>
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}

          {!analyzing && !error && !result && (
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
              <p className="text-sm leading-relaxed text-muted-foreground">
                {result.summary}
              </p>

              <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                <p className="mb-1 font-medium">Next focus</p>
                <p className="text-muted-foreground">{result.nextFocus}</p>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <AlertCircle className="size-4 text-destructive" />
                  Mistakes ({result.mistakes.length})
                </h4>
                {result.mistakes.map((m, i) => (
                  <div key={i} className="rounded-lg border p-3 text-sm">
                    <p className="text-muted-foreground line-through">
                      {m.original}
                    </p>
                    <p className="font-medium text-chart-2">{m.correction}</p>
                    <p className="mt-2 text-muted-foreground">{m.rule}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge variant="outline">{m.category}</Badge>
                      <Badge variant="secondary">{m.status}</Badge>
                      <Badge variant="secondary">x{m.frequency}</Badge>
                    </div>
                  </div>
                ))}
                {result.mistakes.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No specific mistakes found in these notes.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <BookOpen className="size-4 text-primary" />
                  Vocabulary ({result.vocabulary.length})
                </h4>
                <div className="flex flex-col gap-1.5">
                  {result.vocabulary.map((v, i) => (
                    <div key={i} className="rounded-md border px-3 py-2 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">{v.word}</span>
                        <span className="text-muted-foreground">
                          {v.meaning}
                        </span>
                      </div>
                      <p className="mt-1 text-muted-foreground">
                        {v.exampleSentence}
                      </p>
                      <p className="mt-1 text-muted-foreground">{v.usageTip}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge variant="outline">{v.pos}</Badge>
                        <Badge variant="secondary">{v.status}</Badge>
                        <Badge variant="secondary">x{v.frequency}</Badge>
                      </div>
                    </div>
                  ))}
                  {result.vocabulary.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No new vocabulary found in these notes.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <Target className="size-4 text-chart-3" />
                  Gaps ({result.gaps.length})
                </h4>
                <div className="flex flex-col gap-2">
                  {result.gaps.map((g, i) => (
                    <div key={i} className="rounded-md border px-3 py-2 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{g.pattern}</span>
                        <Badge variant="secondary">x{g.frequency}</Badge>
                      </div>
                      <p className="mt-1 text-muted-foreground">
                        {g.suggestedDrill}
                      </p>
                    </div>
                  ))}
                  {result.gaps.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No recurring gaps found in these notes.
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="button"
                onClick={saveLearningSession}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : (
                  <Save data-icon="inline-start" />
                )}
                {saving ? "Saving..." : "Save Learning Session"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import * as React from "react"
import { Check, Loader2, Map, Play, Target } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useApp } from "@/components/app-context"
import {
  getRoadmapProgress,
  markMilestoneCompleted,
  markMilestoneInProgress,
} from "@/lib/firestore"
import { learnerName, type LearnerFilter } from "@/lib/data"
import {
  announceLearningDataChanged,
  toFirestoreLearner,
} from "@/lib/learning-firestore-ui"
import {
  roadmaps,
  type Roadmap,
  type RoadmapMilestone,
  type RoadmapMilestoneStatus,
  type RoadmapPhase,
} from "@/lib/roadmaps"
import type { Learner, RoadmapProgress } from "@/lib/types"

const learnerGuidance = {
  roman: {
    title: "Roman",
    lines: [
      "Primary roadmap: B1 General",
      "Secondary roadmap: B2 General",
      "Focus: conversation, professional self-presentation, job-search German, recurring grammar gaps",
    ],
  },
  iryna: {
    title: "Iryna",
    lines: [
      "Primary roadmap: B2 Beruf",
      "Secondary support: B1 General",
      "Focus: DTB B2 Beruf writing/speaking plus grammar repair",
    ],
  },
} as const

function progressLearner(filter: LearnerFilter): Learner {
  return filter === "both" ? "both" : toFirestoreLearner(filter)
}

function learnerDisplayName(filter: LearnerFilter) {
  return filter === "both" ? "Both" : learnerName(filter)
}

function getMilestoneStatus(
  progress: RoadmapProgress | null,
  milestoneId: string
): RoadmapMilestoneStatus {
  if (progress?.completedMilestoneIds.includes(milestoneId)) {
    return "completed"
  }

  if (progress?.inProgressMilestoneIds.includes(milestoneId)) {
    return "in_progress"
  }

  return "not_started"
}

function statusLabel(status: RoadmapMilestoneStatus) {
  if (status === "completed") {
    return "Completed"
  }

  if (status === "in_progress") {
    return "In progress"
  }

  return "Not started"
}

export function RoadmapsScreen() {
  const { learner } = useApp()
  const [selectedRoadmapId, setSelectedRoadmapId] = React.useState(
    roadmaps[0]?.id ?? ""
  )
  const [progress, setProgress] = React.useState<RoadmapProgress | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [pendingMilestoneId, setPendingMilestoneId] = React.useState<string | null>(
    null
  )

  const selectedRoadmap =
    roadmaps.find((roadmap) => roadmap.id === selectedRoadmapId) ?? roadmaps[0]
  const selectedLearner = progressLearner(learner)

  const loadProgress = React.useCallback(async () => {
    if (!selectedRoadmap) {
      return
    }

    setLoading(true)

    try {
      setProgress(await getRoadmapProgress(selectedLearner, selectedRoadmap.id))
    } catch (error) {
      console.error("[Firestore] Roadmap progress load failed", error)
      toast.error("Could not load roadmap progress.")
    } finally {
      setLoading(false)
    }
  }, [selectedLearner, selectedRoadmap])

  React.useEffect(() => {
    void loadProgress()
  }, [loadProgress])

  async function updateMilestone(
    phase: RoadmapPhase,
    milestone: RoadmapMilestone,
    status: "in_progress" | "completed"
  ) {
    if (!selectedRoadmap) {
      return
    }

    setPendingMilestoneId(milestone.id)

    try {
      if (status === "in_progress") {
        await markMilestoneInProgress(
          selectedLearner,
          selectedRoadmap.id,
          phase.id,
          milestone.id
        )
      } else {
        await markMilestoneCompleted(
          selectedLearner,
          selectedRoadmap.id,
          phase.id,
          milestone.id
        )
      }

      await loadProgress()
      announceLearningDataChanged()
      toast.success("Roadmap progress saved")
    } catch (error) {
      console.error("[Firestore] Roadmap progress update failed", error)
      toast.error("Could not save roadmap progress.")
    } finally {
      setPendingMilestoneId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Roadmap selector</CardTitle>
            <CardDescription>
              Choose a learning track. Progress is stored for {learnerDisplayName(learner)}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ToggleGroup
              value={[selectedRoadmap?.id ?? ""]}
              onValueChange={(value) => value[0] && setSelectedRoadmapId(value[0])}
              variant="outline"
              className="flex-wrap justify-start"
            >
              {roadmaps.map((roadmap) => (
                <ToggleGroupItem key={roadmap.id} value={roadmap.id} className="px-4">
                  {roadmap.title}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </CardContent>
        </Card>

        <GuidanceCard learner={learner} />
      </div>

      {selectedRoadmap && (
        <>
          <RoadmapOverview roadmap={selectedRoadmap} />

          <div className="grid gap-4">
            {selectedRoadmap.phases.map((phase, index) => (
              <PhaseCard
                key={phase.id}
                index={index}
                phase={phase}
                progress={progress}
                loading={loading}
                pendingMilestoneId={pendingMilestoneId}
                onUpdate={updateMilestone}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function GuidanceCard({ learner }: { learner: LearnerFilter }) {
  const cards =
    learner === "both"
      ? [learnerGuidance.roman, learnerGuidance.iryna]
      : [learnerGuidance[learner]]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended focus</CardTitle>
        <CardDescription>Helpful defaults for this workspace.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {cards.map((card) => (
          <div key={card.title} className="rounded-lg border p-3">
            <p className="mb-2 font-medium">{card.title}</p>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              {card.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function RoadmapOverview({ roadmap }: { roadmap: Roadmap }) {
  const milestoneCount = roadmap.phases.reduce(
    (total, phase) => total + phase.milestones.length,
    0
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="flex items-center gap-2">
              <Map className="size-4" />
              {roadmap.title}
            </CardTitle>
            <CardDescription>{roadmap.description}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{roadmap.level}</Badge>
            <Badge variant="secondary">{roadmap.variant}</Badge>
            <Badge variant="secondary">{milestoneCount} milestones</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-muted-foreground">Target learners:</span>
          {roadmap.targetLearners.map((target) => (
            <Badge key={target} variant="outline">
              {target}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PhaseCard({
  index,
  phase,
  progress,
  loading,
  pendingMilestoneId,
  onUpdate,
}: {
  index: number
  phase: RoadmapPhase
  progress: RoadmapProgress | null
  loading: boolean
  pendingMilestoneId: string | null
  onUpdate: (
    phase: RoadmapPhase,
    milestone: RoadmapMilestone,
    status: "in_progress" | "completed"
  ) => void
}) {
  const completedCount = phase.milestones.filter((milestone) =>
    progress?.completedMilestoneIds.includes(milestone.id)
  ).length

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>
              {index + 1}. {phase.title}
            </CardTitle>
            <CardDescription>{phase.description}</CardDescription>
          </div>
          <Badge variant="secondary">
            {loading
              ? "Loading"
              : `${completedCount}/${phase.milestones.length} complete`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {phase.milestones.map((milestone) => {
          const status = getMilestoneStatus(progress, milestone.id)
          const pending = pendingMilestoneId === milestone.id

          return (
            <div key={milestone.id} className="flex flex-col gap-3 rounded-lg border p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{milestone.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
                <Badge
                  variant={status === "completed" ? "default" : "secondary"}
                >
                  {statusLabel(status)}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline">{milestone.skillType}</Badge>
                {milestone.recommendedModes.map((mode) => (
                  <Badge key={mode} variant="secondary">
                    {mode}
                  </Badge>
                ))}
              </div>

              <div className="rounded-md bg-muted/40 p-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Evidence: </span>
                {milestone.evidenceRule}
              </div>

              <div className="mt-auto flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending || status === "completed"}
                  onClick={() => onUpdate(phase, milestone, "in_progress")}
                >
                  {pending ? (
                    <Loader2 data-icon="inline-start" className="animate-spin" />
                  ) : (
                    <Play data-icon="inline-start" />
                  )}
                  In progress
                </Button>
                <Button
                  size="sm"
                  disabled={pending}
                  onClick={() => onUpdate(phase, milestone, "completed")}
                >
                  {pending ? (
                    <Loader2 data-icon="inline-start" className="animate-spin" />
                  ) : (
                    <Check data-icon="inline-start" />
                  )}
                  Complete
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

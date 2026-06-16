import type { Learner, SessionMode } from "@/lib/types"

export type RoadmapLevel = "B1" | "B2"
export type RoadmapVariant = "general" | "beruf"
export type RoadmapSkillType =
  | "grammar"
  | "speaking"
  | "writing"
  | "listening"
  | "reading"
  | "vocabulary"
  | "exam"

export type RoadmapMilestone = {
  id: string
  title: string
  description: string
  skillType: RoadmapSkillType
  recommendedModes: SessionMode[]
  evidenceRule: string
}

export type RoadmapPhase = {
  id: string
  title: string
  description: string
  milestones: RoadmapMilestone[]
}

export type Roadmap = {
  id: string
  title: string
  level: RoadmapLevel
  variant: RoadmapVariant
  description: string
  targetLearners: Learner[]
  phases: RoadmapPhase[]
}

export type RoadmapMilestoneStatus =
  | "not_started"
  | "in_progress"
  | "completed"

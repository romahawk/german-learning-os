import { b1GeneralRoadmap } from "./b1-general"
import { b2BerufRoadmap } from "./b2-beruf"
import { b2GeneralRoadmap } from "./b2-general"
import type { Roadmap, RoadmapMilestone, RoadmapPhase } from "./types"

export const roadmaps: Roadmap[] = [
  b1GeneralRoadmap,
  b2GeneralRoadmap,
  b2BerufRoadmap,
]

export function getRoadmapById(roadmapId?: string | null) {
  return roadmaps.find((roadmap) => roadmap.id === roadmapId) ?? null
}

export function getRoadmapPhase(
  roadmapId?: string | null,
  phaseId?: string | null
): RoadmapPhase | null {
  return (
    getRoadmapById(roadmapId)?.phases.find((phase) => phase.id === phaseId) ??
    null
  )
}

export function getRoadmapMilestone(
  roadmapId?: string | null,
  phaseId?: string | null,
  milestoneId?: string | null
): RoadmapMilestone | null {
  return (
    getRoadmapPhase(roadmapId, phaseId)?.milestones.find(
      (milestone) => milestone.id === milestoneId
    ) ?? null
  )
}

export type {
  Roadmap,
  RoadmapMilestone,
  RoadmapMilestoneStatus,
  RoadmapPhase,
  RoadmapSkillType,
} from "./types"

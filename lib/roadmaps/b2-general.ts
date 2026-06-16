import type { Roadmap, RoadmapMilestone, RoadmapSkillType } from "./types"

function milestone(
  id: string,
  title: string,
  skillType: RoadmapSkillType,
  recommendedModes: RoadmapMilestone["recommendedModes"],
  evidenceRule: string
): RoadmapMilestone {
  return { id, title, description: evidenceRule, skillType, recommendedModes, evidenceRule }
}

export const b2GeneralRoadmap: Roadmap = {
  id: "b2-general",
  title: "B2 General",
  level: "B2",
  variant: "general",
  description: "Clear independent communication on complex topics.",
  targetLearners: ["Roman", "both"],
  phases: [
    {
      id: "b2-grammar-bridge",
      title: "B2 Grammar Bridge",
      description: "Build the sentence tools needed for longer B2 communication.",
      milestones: [
        milestone("subordinate-clauses", "Subordinate clauses", "grammar", ["drill", "conversation"], "Use subordinate clauses with correct verb-final structure."),
        milestone("passive-voice", "Passive voice", "grammar", ["drill", "textbook"], "Recognize and produce passive constructions in common contexts."),
        milestone("konjunktiv-ii", "Konjunktiv II", "grammar", ["drill", "conversation"], "Use polite requests, hypotheticals, and wishes with Konjunktiv II."),
        milestone("relative-clauses", "Relative clauses", "grammar", ["drill", "textbook"], "Add precise detail with relative clauses."),
        milestone("nominalization-basics", "Nominalization basics", "grammar", ["textbook", "review"], "Understand and use basic nominalized structures."),
        milestone("advanced-connectors", "Advanced connectors", "grammar", ["drill", "conversation"], "Use connectors to express contrast, cause, sequence, and concession."),
      ],
    },
    {
      id: "argumentation",
      title: "Argumentation",
      description: "Express and defend ideas clearly.",
      milestones: [
        milestone("express-opinion", "Express opinion", "speaking", ["conversation"], "State opinions with appropriate phrases and reasons."),
        milestone("defend-position", "Defend a position", "speaking", ["conversation"], "Support a position with examples and justification."),
        milestone("advantages-disadvantages", "Discuss advantages and disadvantages", "speaking", ["conversation"], "Compare pros and cons with useful connectors."),
        milestone("propose-compromises", "Propose compromises", "speaking", ["conversation"], "Suggest balanced alternatives in discussion."),
        milestone("react-counterarguments", "React to counterarguments", "speaking", ["conversation"], "Respond to disagreement without losing structure."),
      ],
    },
    {
      id: "advanced-communication",
      title: "Advanced Communication",
      description: "Discuss common B2 themes with useful vocabulary.",
      milestones: [
        milestone("education", "Education", "vocabulary", ["conversation", "textbook"], "Discuss learning, schools, qualifications, and education systems."),
        milestone("technology", "Technology", "vocabulary", ["conversation"], "Discuss technology, apps, devices, and digital habits."),
        milestone("society", "Society", "vocabulary", ["conversation", "textbook"], "Discuss social topics with balanced vocabulary."),
        milestone("environment", "Environment", "vocabulary", ["conversation", "textbook"], "Discuss climate, transport, energy, and sustainable choices."),
        milestone("work-life-balance", "Work-life balance", "speaking", ["conversation"], "Discuss stress, time, productivity, and personal boundaries."),
        milestone("media-digital-life", "Media and digital life", "reading", ["conversation", "textbook"], "Understand and discuss online media and digital society."),
      ],
    },
    {
      id: "writing",
      title: "Writing",
      description: "Produce structured written German for formal and opinion tasks.",
      milestones: [
        milestone("formal-email", "Formal email", "writing", ["textbook", "b2-beruf"], "Write a formal email with clear purpose and polite structure."),
        milestone("opinion-text", "Opinion text", "writing", ["textbook"], "Write an opinion text with arguments and conclusion."),
        milestone("complaint", "Complaint", "writing", ["textbook"], "Write a structured complaint and request a solution."),
        milestone("report", "Report", "writing", ["textbook"], "Summarize facts or events in a concise report."),
        milestone("summary", "Summary", "writing", ["textbook", "review"], "Summarize a text without copying its wording."),
      ],
    },
    {
      id: "b2-fluency",
      title: "B2 Fluency",
      description: "Speak longer and more naturally under pressure.",
      milestones: [
        milestone("longer-monologue", "Longer monologue", "speaking", ["conversation"], "Speak for several minutes with clear structure."),
        milestone("spontaneous-discussion", "Spontaneous discussion", "speaking", ["conversation"], "React quickly and stay understandable in discussion."),
        milestone("paraphrase-unknown-words", "Paraphrase unknown words", "speaking", ["conversation"], "Explain around missing vocabulary without switching languages."),
        milestone("natural-collocations", "Natural collocations", "vocabulary", ["review", "conversation"], "Use common word combinations more naturally."),
        milestone("pronunciation-rhythm", "Pronunciation and rhythm", "speaking", ["conversation"], "Improve sentence stress and rhythm in longer speech."),
      ],
    },
    {
      id: "exam-readiness",
      title: "Exam Readiness",
      description: "Turn B2 skills into reliable exam-style performance.",
      milestones: [
        milestone("timed-tasks", "Timed tasks", "exam", ["review", "textbook"], "Complete timed reading, listening, writing, or speaking tasks."),
        milestone("mock-tests", "Mock tests", "exam", ["review"], "Complete mock tasks and track weak points."),
        milestone("weakness-review", "Weakness review", "exam", ["review", "drill"], "Target recurring mistakes and vocabulary gaps."),
      ],
    },
  ],
}

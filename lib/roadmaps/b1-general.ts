import type { Roadmap, RoadmapMilestone, RoadmapSkillType } from "./types"

function milestone(
  id: string,
  title: string,
  skillType: RoadmapSkillType,
  recommendedModes: RoadmapMilestone["recommendedModes"],
  evidenceRule: string
): RoadmapMilestone {
  return {
    id,
    title,
    description: evidenceRule,
    skillType,
    recommendedModes,
    evidenceRule,
  }
}

export const b1GeneralRoadmap: Roadmap = {
  id: "b1-general",
  title: "B1 General",
  level: "B1",
  variant: "general",
  description: "Independent everyday communication.",
  targetLearners: ["Roman", "Iryna", "both"],
  phases: [
    {
      id: "foundation-repair",
      title: "Foundation Repair",
      description: "Repair the grammar patterns that block confident B1 communication.",
      milestones: [
        milestone("word-order-main-questions", "Word order: main clauses and questions", "grammar", ["drill", "conversation"], "Use correct verb position in statements and questions across several sessions."),
        milestone("case-basics", "Cases: nominative, accusative, dative basics", "grammar", ["drill", "textbook"], "Choose basic cases correctly in everyday noun phrases."),
        milestone("articles-basic", "Articles: der/die/das and ein/eine", "grammar", ["drill", "review"], "Use common noun genders and indefinite articles with fewer recurring mistakes."),
        milestone("common-prepositions", "Common prepositions", "grammar", ["drill", "conversation"], "Use common local and everyday prepositions in short sentences."),
        milestone("perfekt-haben-sein", "Perfekt with haben and sein", "grammar", ["drill", "conversation"], "Tell simple past events using Perfekt with the right auxiliary."),
        milestone("modal-verbs-everyday", "Modal verbs in everyday sentences", "grammar", ["conversation", "drill"], "Use modal verbs naturally for plans, needs, permission, and ability."),
      ],
    },
    {
      id: "everyday-communication",
      title: "Everyday Communication",
      description: "Handle common everyday situations without switching languages.",
      milestones: [
        milestone("appointments-scheduling", "Appointments and scheduling", "speaking", ["conversation", "textbook"], "Arrange and change appointments using clear time expressions."),
        milestone("shopping-services", "Shopping and services", "speaking", ["conversation"], "Ask for help, compare options, and solve simple service problems."),
        milestone("housing-neighbors", "Housing and neighbors", "vocabulary", ["conversation", "textbook"], "Discuss apartment, repairs, neighbors, and household issues."),
        milestone("health-doctor", "Health and doctor visits", "speaking", ["conversation", "textbook"], "Describe symptoms, understand advice, and ask follow-up questions."),
        milestone("school-family", "School and family topics", "speaking", ["conversation"], "Talk about family, school, childcare, and routines."),
        milestone("travel-transportation", "Travel and transportation", "listening", ["conversation", "textbook"], "Understand and discuss routes, tickets, delays, and travel problems."),
        milestone("authorities-forms", "Basic authorities and forms", "reading", ["textbook", "conversation"], "Understand basic official wording and complete simple forms."),
      ],
    },
    {
      id: "speaking-fluency",
      title: "Speaking Fluency",
      description: "Move from sentence-by-sentence speech to short connected turns.",
      milestones: [
        milestone("tell-past-experiences", "Tell past experiences", "speaking", ["conversation"], "Tell a short story in the past with understandable sequencing."),
        milestone("explain-plans", "Explain plans", "speaking", ["conversation"], "Explain future plans with reasons and constraints."),
        milestone("weil-deshalb", "Give reasons with weil/deshalb", "grammar", ["drill", "conversation"], "Connect reasons using weil and deshalb with correct structure."),
        milestone("agree-disagree-politely", "Agree and disagree politely", "speaking", ["conversation"], "Respond politely with agreement, disagreement, and alternatives."),
        milestone("describe-problems-help", "Describe problems and ask for help", "speaking", ["conversation"], "Describe a problem clearly and ask for specific support."),
      ],
    },
    {
      id: "writing-basics",
      title: "Writing Basics",
      description: "Write useful short messages for everyday German life.",
      milestones: [
        milestone("personal-email", "Personal email", "writing", ["textbook"], "Write a clear personal email with greeting, body, and closing."),
        milestone("short-formal-request", "Short formal request", "writing", ["textbook", "conversation"], "Write a simple formal request with polite phrasing."),
        milestone("complaint", "Complaint", "writing", ["textbook"], "Explain a problem and desired solution in writing."),
        milestone("invitation-reply", "Invitation/reply", "writing", ["textbook"], "Invite someone or reply to an invitation appropriately."),
        milestone("appointment-change", "Appointment change", "writing", ["textbook"], "Write a short message to reschedule an appointment."),
      ],
    },
    {
      id: "b1-readiness",
      title: "B1 Readiness",
      description: "Practice the task types and weak areas needed for B1 confidence.",
      milestones: [
        milestone("timed-reading", "Timed reading practice", "reading", ["review", "textbook"], "Complete short timed reading tasks and review unknown vocabulary."),
        milestone("listening-practice", "Listening practice", "listening", ["review", "conversation"], "Understand main points from everyday audio tasks."),
        milestone("writing-task", "Writing task", "writing", ["textbook"], "Complete a B1-style writing task with clear structure."),
        milestone("speaking-simulation", "Speaking simulation", "exam", ["conversation"], "Complete a short B1-style speaking simulation."),
        milestone("weakness-review", "Weakness review", "exam", ["review", "drill"], "Review recurring mistakes and reduce repeated error patterns."),
      ],
    },
  ],
}

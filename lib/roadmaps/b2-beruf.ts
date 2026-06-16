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

export const b2BerufRoadmap: Roadmap = {
  id: "b2-beruf",
  title: "B2 Beruf",
  level: "B2",
  variant: "beruf",
  description: "Professional German and DTB B2 Beruf preparation.",
  targetLearners: ["Iryna", "Roman", "both"],
  phases: [
    {
      id: "workplace-foundation",
      title: "Workplace Foundation",
      description: "Build core vocabulary and phrases for working life.",
      milestones: [
        milestone("onboarding-first-days", "Onboarding and first days at work", "vocabulary", ["b2-beruf", "conversation"], "Explain first-day tasks, expectations, and workplace routines."),
        milestone("responsibilities-tasks", "Responsibilities and tasks", "speaking", ["b2-beruf", "conversation"], "Describe responsibilities and ask about tasks clearly."),
        milestone("schedules-appointments", "Schedules and appointments", "speaking", ["b2-beruf"], "Coordinate appointments and working schedules politely."),
        milestone("colleagues-teamwork", "Colleagues and teamwork", "speaking", ["b2-beruf", "conversation"], "Talk about teamwork, roles, and collaboration."),
        milestone("workplace-basics", "Workplace communication basics", "speaking", ["b2-beruf"], "Use standard workplace phrases for clarification and coordination."),
      ],
    },
    {
      id: "professional-writing",
      title: "Professional Writing",
      description: "Practice DTB-style professional written communication.",
      milestones: [
        milestone("formal-inquiry", "Formal inquiry", "writing", ["b2-beruf"], "Write a clear formal inquiry with context and request."),
        milestone("complaint-email", "Complaint email", "writing", ["b2-beruf"], "Write a complaint email with facts, tone, and requested action."),
        milestone("apology-email", "Apology email", "writing", ["b2-beruf"], "Apologize professionally and propose a solution."),
        milestone("rescheduling-appointment", "Rescheduling appointment", "writing", ["b2-beruf"], "Write a concise appointment rescheduling message."),
        milestone("forwarding-information", "Forwarding information", "writing", ["b2-beruf"], "Forward information with a short useful explanation."),
        milestone("application-message", "Short application-related message", "writing", ["b2-beruf"], "Write a short message connected to applications or job search."),
      ],
    },
    {
      id: "speaking-at-work",
      title: "Speaking at Work",
      description: "Handle professional spoken situations.",
      milestones: [
        milestone("telephone-call", "Telephone call", "speaking", ["b2-beruf", "conversation"], "Complete a workplace phone call with clarification and next steps."),
        milestone("meeting-contribution", "Meeting contribution", "speaking", ["b2-beruf"], "Contribute opinions and updates in a meeting."),
        milestone("short-presentation", "Short presentation", "speaking", ["b2-beruf"], "Give a structured short professional presentation."),
        milestone("problem-solving-colleague", "Problem-solving with colleague", "speaking", ["b2-beruf", "conversation"], "Discuss a workplace problem and agree on action."),
        milestone("discussion-compromise", "Discussion and compromise", "speaking", ["b2-beruf"], "Negotiate a compromise in a professional discussion."),
      ],
    },
    {
      id: "sprachbausteine",
      title: "Sprachbausteine",
      description: "Strengthen the language building blocks common in DTB tasks.",
      milestones: [
        milestone("connectors", "Connectors", "grammar", ["drill", "b2-beruf"], "Choose connectors that fit formal workplace texts."),
        milestone("fixed-prepositions", "Fixed prepositions", "grammar", ["drill", "review"], "Use common verb and noun preposition combinations."),
        milestone("articles-endings", "Articles and endings", "grammar", ["drill"], "Reduce article and adjective-ending mistakes in formal phrases."),
        milestone("formal-phrases", "Formal phrases", "vocabulary", ["b2-beruf", "review"], "Use reusable formal email and workplace phrases."),
        milestone("workplace-collocations", "Workplace collocations", "vocabulary", ["b2-beruf", "review"], "Use natural workplace word combinations."),
      ],
    },
    {
      id: "reading-listening",
      title: "Reading and Listening",
      description: "Understand common workplace input.",
      milestones: [
        milestone("internal-notices", "Internal notices", "reading", ["b2-beruf", "review"], "Understand notices about schedules, rules, and changes."),
        milestone("workplace-emails", "Workplace emails", "reading", ["b2-beruf"], "Identify purpose and action items in workplace emails."),
        milestone("instructions", "Instructions", "reading", ["b2-beruf"], "Understand written instructions and procedures."),
        milestone("announcements", "Announcements", "listening", ["b2-beruf"], "Understand workplace announcements and key details."),
        milestone("phone-calls", "Phone calls", "listening", ["b2-beruf", "conversation"], "Understand main points and details in phone calls."),
        milestone("meetings", "Meetings", "listening", ["b2-beruf"], "Follow meeting topics, decisions, and next steps."),
      ],
    },
    {
      id: "dtb-exam-preparation",
      title: "DTB Exam Preparation",
      description: "Practice the DTB B2 Beruf exam task patterns.",
      milestones: [
        milestone("kurzvortrag", "Kurzvortrag", "exam", ["b2-beruf"], "Give a short structured talk with examples and conclusion."),
        milestone("diskussion", "Diskussion", "exam", ["b2-beruf"], "Discuss a topic and respond to another opinion."),
        milestone("gemeinsam-planen", "Gemeinsam etwas planen", "exam", ["b2-beruf"], "Plan something together with proposals and compromises."),
        milestone("formal-email", "Formal email", "exam", ["b2-beruf"], "Complete a DTB-style formal email task."),
        milestone("short-internal-text", "Short internal text", "exam", ["b2-beruf"], "Write a short workplace internal message."),
        milestone("full-mock-test", "Full mock test", "exam", ["b2-beruf", "review"], "Complete and review a full DTB-style mock test."),
      ],
    },
  ],
}

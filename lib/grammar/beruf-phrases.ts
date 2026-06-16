import type { GrammarSection } from "./types"

export const berufPhrasesGrammar: GrammarSection = {
  id: "beruf-phrases",
  title: "Beruf Phrases",
  description: "Formal phrases for workplace German and DTB B2 Beruf.",
  categories: [
    {
      id: "formal-and-speaking-phrases",
      title: "Formal and speaking phrases",
      description: "Reusable phrases for emails, meetings, and discussions.",
      items: [
        {
          id: "formal-email-openings",
          title: "Formal email openings",
          level: "B1",
          tags: ["email", "formal", "opening"],
          explanation: "Use formal openings when you do not know the person well or write in a professional setting.",
          examples: [
            { german: "Sehr geehrte Damen und Herren,", english: "Dear Sir or Madam," },
            { german: "Sehr geehrte Frau Müller,", english: "Dear Ms Müller," },
            { german: "Sehr geehrter Herr Schneider,", english: "Dear Mr Schneider," },
          ],
          quickDrillPrompt: "Pick the correct formal opening for five email situations.",
        },
        {
          id: "formal-email-closings",
          title: "Formal closings",
          level: "B1",
          tags: ["email", "formal", "closing"],
          explanation: "Use polite closings for formal or semi-formal written communication.",
          examples: [
            { german: "Mit freundlichen Grüßen", english: "Kind regards" },
            { german: "Freundliche Grüße", english: "Kind regards" },
          ],
          quickDrillPrompt: "Write three short emails using formal closings.",
        },
        {
          id: "useful-beruf-phrases",
          title: "Useful Beruf phrases",
          level: "B2",
          tags: ["Beruf", "email", "workplace"],
          explanation: "These phrases are useful for professional emails, appointment changes, and requests.",
          examples: [
            { german: "Ich schreibe Ihnen, weil ...", english: "I am writing to you because ..." },
            { german: "Ich möchte Sie bitten, ...", english: "I would like to ask you to ..." },
            { german: "Könnten Sie mir bitte mitteilen, ob ...", english: "Could you please let me know whether ..." },
            { german: "Ich würde gerne einen Termin vereinbaren.", english: "I would like to arrange an appointment." },
            { german: "Leider kann ich an dem Termin nicht teilnehmen.", english: "Unfortunately I cannot attend the appointment." },
            { german: "Könnten wir den Termin verschieben?", english: "Could we postpone the appointment?" },
            { german: "Vielen Dank für Ihre Rückmeldung.", english: "Thank you for your reply." },
          ],
          quickDrillPrompt: "Write a formal email using at least three Beruf phrases.",
        },
        {
          id: "speaking-phrases",
          title: "Speaking phrases",
          level: "B2",
          tags: ["speaking", "discussion", "DTB"],
          explanation: "Use these phrases to structure opinions, agreement, disagreement, and compromise.",
          examples: [
            { german: "Ich würde vorschlagen, dass ...", english: "I would suggest that ..." },
            { german: "Aus meiner Sicht ...", english: "From my point of view ..." },
            { german: "Meiner Meinung nach ...", english: "In my opinion ..." },
            { german: "Da stimme ich Ihnen zu.", english: "I agree with you there." },
            { german: "Da bin ich anderer Meinung.", english: "I have a different opinion there." },
            { german: "Können wir uns darauf einigen, dass ...?", english: "Can we agree that ...?" },
          ],
          quickDrillPrompt: "Practice a short DTB-style discussion using these speaking phrases.",
        },
      ],
    },
  ],
}

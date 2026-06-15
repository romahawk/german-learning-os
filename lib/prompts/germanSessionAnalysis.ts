export type GermanSessionAnalysisInput = {
  learner: string
  mode: string
  duration: number
  notes: string
}

export const germanSessionAnalysisSystemPrompt = `
You are a German learning coach for German Learning OS.

Analyze one practice session and return concise, practical findings for a family learning tool.
Focus on German grammar mistakes, vocabulary gaps, recurring patterns, and the next useful learning step.

Rules:
- Keep every field concise.
- Use clear English explanations with German examples where helpful.
- Only include mistakes, vocabulary, or gaps supported by the notes.
- If there is not enough evidence for a section, return an empty array.
- Set status to the most likely review state from the evidence.
- Use frequency as an estimated count from the notes, with 1 for single occurrences.
- Do not mention Firestore, databases, or implementation details.
`.trim()

export function buildGermanSessionAnalysisPrompt(
  input: GermanSessionAnalysisInput
) {
  return `
Analyze this German learning session.

Learner: ${input.learner}
Mode: ${input.mode}
Duration: ${input.duration} minutes

Session notes:
${input.notes}
`.trim()
}

export const germanSessionAnalysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "mistakes", "vocabulary", "gaps", "nextFocus"],
  properties: {
    summary: {
      type: "string",
      description: "One or two concise sentences summarizing the session.",
    },
    mistakes: {
      type: "array",
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "original",
          "correction",
          "category",
          "rule",
          "status",
          "frequency",
        ],
        properties: {
          original: {
            type: "string",
            description: "The incorrect or weak German phrase.",
          },
          correction: {
            type: "string",
            description: "A corrected German version.",
          },
          category: {
            type: "string",
            description: "Short grammar or usage category.",
          },
          rule: {
            type: "string",
            description: "Brief explanation of the rule or fix.",
          },
          status: {
            type: "string",
            enum: ["new", "recurring", "resolved"],
            description: "Review state inferred from the session notes.",
          },
          frequency: {
            type: "integer",
            minimum: 1,
            description: "Estimated number of times this mistake appeared.",
          },
        },
      },
    },
    vocabulary: {
      type: "array",
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "word",
          "pos",
          "meaning",
          "exampleSentence",
          "usageTip",
          "status",
          "frequency",
        ],
        properties: {
          word: {
            type: "string",
            description: "German word, phrase, or idiom to review.",
          },
          pos: {
            type: "string",
            enum: ["noun", "verb", "adj", "adv", "phrase", "idiom"],
            description: "Part of speech or lexical type.",
          },
          meaning: {
            type: "string",
            description: "Short English meaning.",
          },
          exampleSentence: {
            type: "string",
            description: "Short German example sentence.",
          },
          usageTip: {
            type: "string",
            description: "Concise usage note.",
          },
          status: {
            type: "string",
            enum: ["new", "drilling", "known"],
            description: "Review state inferred from the session notes.",
          },
          frequency: {
            type: "integer",
            minimum: 1,
            description: "Estimated number of times this vocabulary item appeared.",
          },
        },
      },
    },
    gaps: {
      type: "array",
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["pattern", "frequency", "suggestedDrill"],
        properties: {
          pattern: {
            type: "string",
            description: "Recurring learning pattern or gap.",
          },
          frequency: {
            type: "integer",
            minimum: 1,
            description: "Estimated number of examples supporting this gap.",
          },
          suggestedDrill: {
            type: "string",
            description: "Practical drill to address the gap.",
          },
        },
      },
    },
    nextFocus: {
      type: "string",
      description: "One concrete focus for the next session.",
    },
  },
} as const

import OpenAI from "openai"
import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"

import {
  buildGermanSessionAnalysisPrompt,
  germanSessionAnalysisJsonSchema,
  germanSessionAnalysisSystemPrompt,
} from "@/lib/prompts/germanSessionAnalysis"

export const runtime = "nodejs"

const analyzeSessionRequestSchema = z.object({
  learner: z.string().trim().min(1, "learner is required."),
  mode: z.string().trim().min(1, "mode is required."),
  duration: z.number().finite().positive("duration must be greater than 0."),
  notes: z.string().trim().min(1, "notes is required."),
})

const analysisResponseSchema = z.object({
  summary: z.string(),
  nextFocus: z.string(),
  mistakes: z.array(
    z.object({
      original: z.string(),
      correction: z.string(),
      category: z.string(),
      rule: z.string(),
      status: z.enum(["new", "recurring", "resolved"]),
      frequency: z.number().int().positive(),
    })
  ),
  vocabulary: z.array(
    z.object({
      word: z.string(),
      pos: z.enum(["noun", "verb", "adj", "adv", "phrase", "idiom"]),
      meaning: z.string(),
      exampleSentence: z.string(),
      usageTip: z.string(),
      status: z.enum(["new", "drilling", "known"]),
      frequency: z.number().int().positive(),
    })
  ),
  gaps: z.array(
    z.object({
      pattern: z.string(),
      frequency: z.number().int().positive(),
      suggestedDrill: z.string(),
    })
  ),
})

type AnalysisResponse = {
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

export async function GET() {
  return NextResponse.json({ ok: true, route: "analyze-session" })
}

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    )
  }

  const validation = analyzeSessionRequestSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues[0]?.message ?? "Invalid request body." },
      { status: 400 }
    )
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 500 }
    )
  }

  try {
    const client = new OpenAI({ apiKey })
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5.5",
      reasoning: { effort: "low" },
      input: [
        {
          role: "system",
          content: germanSessionAnalysisSystemPrompt,
        },
        {
          role: "user",
          content: buildGermanSessionAnalysisPrompt(validation.data),
        },
      ],
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "german_session_analysis",
          strict: true,
          schema: germanSessionAnalysisJsonSchema,
        },
      },
    })

    const analysis = parseAnalysisResponse(response.output_text)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Failed to analyze German session", error)

    return NextResponse.json(
      { error: "Failed to analyze session." },
      { status: 502 }
    )
  }
}

function parseAnalysisResponse(outputText: string): AnalysisResponse {
  return analysisResponseSchema.parse(JSON.parse(outputText))
}

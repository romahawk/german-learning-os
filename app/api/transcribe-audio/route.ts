import OpenAI from "openai"
import { NextResponse, type NextRequest } from "next/server"

export const runtime = "nodejs"

const MAX_AUDIO_BYTES = 25 * 1024 * 1024

const SUPPORTED_AUDIO_TYPES = new Set([
  "audio/flac",
  "audio/m4a",
  "audio/mp4",
  "audio/mpeg",
  "audio/mp3",
  "audio/mpga",
  "audio/ogg",
  "audio/wave",
  "audio/wav",
  "audio/webm",
  "audio/x-m4a",
  "audio/x-wav",
  "video/mp4",
  "video/webm",
])

function normalizeMimeType(type: string) {
  return type.split(";")[0]?.trim().toLowerCase() ?? ""
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "transcribe-audio" })
}

export async function POST(request: NextRequest) {
  let formData: FormData

  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { error: "Request body must be multipart form data." },
      { status: 400 }
    )
  }

  const audio = formData.get("audio")

  if (!(audio instanceof File)) {
    return NextResponse.json(
      { error: "An audio file is required." },
      { status: 400 }
    )
  }

  if (audio.size <= 0) {
    return NextResponse.json(
      { error: "The audio file is empty." },
      { status: 400 }
    )
  }

  if (audio.size > MAX_AUDIO_BYTES) {
    return NextResponse.json(
      { error: "Audio files must be 25 MB or smaller." },
      { status: 413 }
    )
  }

  const audioType = normalizeMimeType(audio.type)

  if (audioType && !SUPPORTED_AUDIO_TYPES.has(audioType)) {
    return NextResponse.json(
      { error: "Unsupported audio format." },
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
    const transcription = await client.audio.transcriptions.create({
      file: audio,
      model: process.env.OPENAI_TRANSCRIPTION_MODEL ?? "gpt-4o-transcribe",
      language: "de",
      prompt:
        "Deutsch-Lernsession mit moeglichen deutschen und englischen Woertern. Transkribiere genau, ohne zu uebersetzen.",
    })

    return NextResponse.json({
      transcript: transcription.text.trim(),
      fileName: audio.name,
      fileSize: audio.size,
    })
  } catch (error) {
    console.error("Failed to transcribe German audio", error)

    return NextResponse.json(
      { error: "Failed to transcribe audio." },
      { status: 502 }
    )
  }
}

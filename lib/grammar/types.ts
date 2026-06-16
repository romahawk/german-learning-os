export type GrammarLevel = "A1" | "A2" | "B1" | "B2"

export type GrammarExample = {
  german: string
  english: string
  note?: string
}

export type GrammarTable = {
  title: string
  headers: string[]
  rows: string[][]
}

export type CommonMistake = {
  wrong: string
  correct: string
  explanation: string
}

export type GrammarItem = {
  id: string
  title: string
  level: GrammarLevel
  tags: string[]
  explanation: string
  examples: GrammarExample[]
  tables?: GrammarTable[]
  commonMistakes?: CommonMistake[]
  quickDrillPrompt?: string
}

export type GrammarCategory = {
  id: string
  title: string
  description: string
  items: GrammarItem[]
}

export type GrammarSection = {
  id: string
  title: string
  description: string
  categories: GrammarCategory[]
}

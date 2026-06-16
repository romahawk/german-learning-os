import { berufPhrasesGrammar } from "./beruf-phrases"
import { casesGrammar } from "./cases"
import { essentialsGrammar } from "./essentials"
import { sentenceStructureGrammar } from "./sentence-structure"
import { verbsGrammar } from "./verbs"
import type { GrammarItem, GrammarSection } from "./types"

export const grammarSections: GrammarSection[] = [
  essentialsGrammar,
  verbsGrammar,
  casesGrammar,
  sentenceStructureGrammar,
  berufPhrasesGrammar,
]

export const selectedGrammarFocusStorageKey =
  "german-learning-os:selected-grammar-focus"

export const grammarItems: GrammarItem[] = grammarSections.flatMap((section) =>
  section.categories.flatMap((category) => category.items)
)

export function getGrammarItemById(grammarFocusId?: string | null) {
  return grammarItems.find((item) => item.id === grammarFocusId) ?? null
}

export type {
  CommonMistake,
  GrammarCategory,
  GrammarExample,
  GrammarItem,
  GrammarLevel,
  GrammarSection,
  GrammarTable,
} from "./types"

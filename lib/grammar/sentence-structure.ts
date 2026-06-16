import type { GrammarSection } from "./types"

export const sentenceStructureGrammar: GrammarSection = {
  id: "sentence-structure",
  title: "Sentence Structure",
  description: "Word order, subordinate clauses, and connectors.",
  categories: [
    {
      id: "word-order",
      title: "Word order",
      description: "Core sentence patterns for clear German.",
      items: [
        {
          id: "v2-word-order",
          title: "V2 word order",
          level: "A2",
          tags: ["word order", "V2", "main clauses"],
          explanation: "In main clauses, the conjugated verb is in position 2.",
          examples: [
            { german: "Ich lerne heute Deutsch.", english: "I am learning German today." },
            { german: "Heute lerne ich Deutsch.", english: "Today I am learning German." },
            { german: "Am Montag habe ich einen Termin.", english: "On Monday I have an appointment." },
          ],
          commonMistakes: [
            { wrong: "Heute ich lerne Deutsch.", correct: "Heute lerne ich Deutsch.", explanation: "If Heute is position 1, the verb must be position 2." },
          ],
          quickDrillPrompt: "Rewrite five sentences starting with a time phrase and keep V2 order.",
        },
        {
          id: "subordinate-clauses",
          title: "Subordinate clauses",
          level: "B1",
          tags: ["subordinate clauses", "weil", "dass", "wenn", "obwohl"],
          explanation: "After weil, dass, wenn, and obwohl, the conjugated verb goes to the end.",
          examples: [
            { german: "Ich lerne Deutsch, weil ich in Deutschland lebe.", english: "I learn German because I live in Germany." },
            { german: "Ich glaube, dass ich besser werde.", english: "I think that I am getting better." },
            { german: "Wenn ich Zeit habe, übe ich Deutsch.", english: "When I have time, I practice German." },
          ],
          commonMistakes: [
            { wrong: "weil ich kann nicht kommen", correct: "weil ich nicht kommen kann", explanation: "In subordinate clauses, the conjugated verb goes to the end." },
          ],
          quickDrillPrompt: "Make five weil/dass/wenn clauses with verb-final order.",
        },
        {
          id: "connectors",
          title: "Connectors",
          level: "B1",
          tags: ["connectors", "word order", "linking"],
          explanation: "Connectors change the relationship between clauses and can affect word order.",
          examples: [],
          tables: [
            {
              title: "Common connectors",
              headers: ["Connector", "Meaning", "Word order", "Example"],
              rows: [
                ["und", "and", "normal", "Ich lerne Deutsch und ich arbeite."],
                ["aber", "but", "normal", "Ich möchte kommen, aber ich habe keine Zeit."],
                ["denn", "because", "normal", "Ich komme nicht, denn ich bin krank."],
                ["deshalb", "therefore", "V2 after connector", "Ich bin krank, deshalb komme ich nicht."],
                ["weil", "because", "verb-final", "Ich komme nicht, weil ich krank bin."],
                ["dass", "that", "verb-final", "Ich hoffe, dass ich bald besser spreche."],
                ["obwohl", "although", "verb-final", "Ich komme, obwohl ich müde bin."],
              ],
            },
          ],
          quickDrillPrompt: "Choose the right connector and word order for seven short situations.",
        },
      ],
    },
  ],
}

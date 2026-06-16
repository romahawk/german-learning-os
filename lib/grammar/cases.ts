import type { GrammarSection } from "./types"

export const casesGrammar: GrammarSection = {
  id: "cases",
  title: "Cases",
  description: "Articles, cases, and prepositions.",
  categories: [
    {
      id: "articles-and-prepositions",
      title: "Articles and prepositions",
      description: "Core forms for case decisions.",
      items: [
        {
          id: "definite-articles",
          title: "Definite articles",
          level: "A1",
          tags: ["articles", "cases", "der die das"],
          explanation: "Definite articles change by case, gender, and number.",
          examples: [
            { german: "Der Mann kommt.", english: "The man is coming." },
            { german: "Ich sehe den Mann.", english: "I see the man." },
            { german: "Ich helfe dem Mann.", english: "I help the man." },
          ],
          tables: [
            {
              title: "Definite articles",
              headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
              rows: [
                ["Nominativ", "der", "die", "das", "die"],
                ["Akkusativ", "den", "die", "das", "die"],
                ["Dativ", "dem", "der", "dem", "den + n"],
                ["Genitiv", "des", "der", "des", "der"],
              ],
            },
          ],
          quickDrillPrompt: "Choose der/die/das forms for ten short sentences.",
        },
        {
          id: "indefinite-articles",
          title: "Indefinite articles",
          level: "A1",
          tags: ["articles", "cases", "ein"],
          explanation: "Indefinite articles follow the same case logic as definite articles.",
          examples: [],
          tables: [
            {
              title: "Indefinite articles",
              headers: ["Case", "Masculine", "Feminine", "Neuter"],
              rows: [
                ["Nominativ", "ein", "eine", "ein"],
                ["Akkusativ", "einen", "eine", "ein"],
                ["Dativ", "einem", "einer", "einem"],
                ["Genitiv", "eines", "einer", "eines"],
              ],
            },
          ],
          quickDrillPrompt: "Practice ein/eine/einen/einem in everyday noun phrases.",
        },
        {
          id: "dative-prepositions",
          title: "Dative prepositions",
          level: "A2",
          tags: ["dative", "prepositions"],
          explanation: "These prepositions normally take dative: mit, nach, bei, seit, von, zu, aus.",
          examples: [
            { german: "Ich fahre mit dem Auto.", english: "I go by car." },
            { german: "Ich gehe zum Arzt.", english: "I am going to the doctor." },
            { german: "Ich komme aus der Ukraine.", english: "I come from Ukraine." },
            { german: "Ich wohne seit einem Jahr in Deutschland.", english: "I have lived in Germany for one year." },
          ],
          quickDrillPrompt: "Make seven sentences, one for each dative preposition.",
        },
        {
          id: "accusative-prepositions",
          title: "Accusative prepositions",
          level: "A2",
          tags: ["accusative", "prepositions"],
          explanation: "These prepositions take accusative: durch, für, gegen, ohne, um.",
          examples: [
            { german: "Das ist für meinen Sohn.", english: "That is for my son." },
            { german: "Ich gehe ohne meine Tasche.", english: "I go without my bag." },
            { german: "Wir laufen durch den Park.", english: "We walk through the park." },
          ],
          quickDrillPrompt: "Practice accusative article changes after für, ohne, and durch.",
        },
        {
          id: "two-way-prepositions",
          title: "Two-way prepositions",
          level: "A2",
          tags: ["dative", "accusative", "Wechselpräpositionen"],
          explanation: "Two-way prepositions include in, an, auf, unter, über, vor, hinter, neben, zwischen. Location uses dative. Direction uses accusative.",
          examples: [
            { german: "Ich bin in der Schule.", english: "I am in school.", note: "Location = dative." },
            { german: "Ich gehe in die Schule.", english: "I go into/to school.", note: "Direction = accusative." },
          ],
          quickDrillPrompt: "Contrast location and direction with five two-way prepositions.",
        },
      ],
    },
  ],
}

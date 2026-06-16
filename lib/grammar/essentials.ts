import type { GrammarSection } from "./types"

export const essentialsGrammar: GrammarSection = {
  id: "essentials",
  title: "Essentials",
  description: "Core helper verbs and forms used constantly in German.",
  categories: [
    {
      id: "core-verbs",
      title: "Core verbs",
      description: "High-frequency verbs that support everyday sentences.",
      items: [
        {
          id: "sein-praesens",
          title: "sein - Präsens",
          level: "A1",
          tags: ["sein", "present", "helper verb"],
          explanation: "Sein means to be and is used for identity, location, condition, and some Perfekt forms.",
          examples: [
            { german: "Ich bin zu Hause.", english: "I am at home." },
            { german: "Bist du bereit?", english: "Are you ready?" },
            { german: "Wir sind in Hamburg.", english: "We are in Hamburg." },
          ],
          tables: [
            {
              title: "sein - Präsens",
              headers: ["Person", "Form"],
              rows: [
                ["ich", "bin"],
                ["du", "bist"],
                ["er/sie/es", "ist"],
                ["wir", "sind"],
                ["ihr", "seid"],
                ["sie/Sie", "sind"],
              ],
            },
          ],
          commonMistakes: [
            {
              wrong: "Ich bin habe Zeit.",
              correct: "Ich habe Zeit.",
              explanation: "Use haben for possession or availability, not sein.",
            },
          ],
          quickDrillPrompt: "Practice five short sentences with sein in Präsens.",
        },
        {
          id: "haben-praesens",
          title: "haben - Präsens",
          level: "A1",
          tags: ["haben", "present", "helper verb"],
          explanation: "Haben means to have and is used for possession, availability, and many Perfekt forms.",
          examples: [
            { german: "Ich habe heute Zeit.", english: "I have time today." },
            { german: "Hast du einen Termin?", english: "Do you have an appointment?" },
            { german: "Wir haben Deutschunterricht.", english: "We have German class." },
          ],
          tables: [
            {
              title: "haben - Präsens",
              headers: ["Person", "Form"],
              rows: [
                ["ich", "habe"],
                ["du", "hast"],
                ["er/sie/es", "hat"],
                ["wir", "haben"],
                ["ihr", "habt"],
                ["sie/Sie", "haben"],
              ],
            },
          ],
          commonMistakes: [
            {
              wrong: "Ich habe 42 Jahre.",
              correct: "Ich bin 42 Jahre alt.",
              explanation: "German uses sein for age. Do not copy English, Russian, or Ukrainian structure here.",
            },
          ],
          quickDrillPrompt: "Practice haben with time, appointments, and possessions.",
        },
        {
          id: "werden-praesens",
          title: "werden - Präsens",
          level: "A2",
          tags: ["werden", "future", "passive", "become"],
          explanation: "Werden is used for future meaning, becoming something, and as an auxiliary in passive forms.",
          examples: [
            { german: "Ich werde morgen lernen.", english: "I will study tomorrow.", note: "Future use." },
            { german: "Es wird besser.", english: "It is getting better.", note: "Becoming/change." },
            { german: "Das wird oft benutzt.", english: "That is often used.", note: "Passive auxiliary." },
          ],
          tables: [
            {
              title: "werden - Präsens",
              headers: ["Person", "Form"],
              rows: [
                ["ich", "werde"],
                ["du", "wirst"],
                ["er/sie/es", "wird"],
                ["wir", "werden"],
                ["ihr", "werdet"],
                ["sie/Sie", "werden"],
              ],
            },
          ],
          quickDrillPrompt: "Make three sentences with werden: future, becoming, and passive.",
        },
      ],
    },
  ],
}

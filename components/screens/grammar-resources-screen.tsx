"use client"

import * as React from "react"
import { CheckCircle2, Search, Target } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  grammarItems,
  grammarSections,
  selectedGrammarFocusStorageKey,
  type GrammarItem,
  type GrammarLevel,
} from "@/lib/grammar"

const levels: ("all" | GrammarLevel)[] = ["all", "A1", "A2", "B1", "B2"]

export function GrammarResourcesScreen() {
  const [query, setQuery] = React.useState("")
  const [selectedLevel, setSelectedLevel] = React.useState<
    "all" | GrammarLevel
  >("all")
  const [selectedSectionId, setSelectedSectionId] = React.useState("all")
  const [selectedDrillId, setSelectedDrillId] = React.useState<string | null>(
    null
  )

  React.useEffect(() => {
    setSelectedDrillId(
      window.localStorage.getItem(selectedGrammarFocusStorageKey)
    )
  }, [])

  const itemContexts = React.useMemo(
    () =>
      grammarSections.flatMap((section) =>
        section.categories.flatMap((category) =>
          category.items.map((item) => ({
            item,
            section,
            category,
          }))
        )
      ),
    []
  )

  const filteredItems = itemContexts.filter(({ item, section, category }) => {
    const normalizedQuery = query.trim().toLowerCase()
    const matchesQuery =
      !normalizedQuery ||
      [
        item.title,
        item.explanation,
        section.title,
        category.title,
        item.quickDrillPrompt ?? "",
        ...item.tags,
        ...item.examples.flatMap((example) => [
          example.german,
          example.english,
          example.note ?? "",
        ]),
        ...(item.commonMistakes?.flatMap((mistake) => [
          mistake.wrong,
          mistake.correct,
          mistake.explanation,
        ]) ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)

    const matchesLevel =
      selectedLevel === "all" || item.level === selectedLevel
    const matchesSection =
      selectedSectionId === "all" || section.id === selectedSectionId

    return matchesQuery && matchesLevel && matchesSection
  })

  const selectedDrillItem =
    grammarItems.find((item) => item.id === selectedDrillId) ?? null

  function selectForDrill(item: GrammarItem) {
    setSelectedDrillId(item.id)
    window.localStorage.setItem(selectedGrammarFocusStorageKey, item.id)
    toast.success("Grammar focus selected", {
      description: `${item.title} is ready for your next drill.`,
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="flex flex-col gap-4">
        <div className="rounded-lg border bg-background p-3">
          <p className="mb-2 text-sm font-medium">Categories</p>
          <ToggleGroup
            value={[selectedSectionId]}
            onValueChange={(value) =>
              value[0] && setSelectedSectionId(value[0])
            }
            variant="outline"
            className="grid gap-2"
          >
            <ToggleGroupItem value="all" className="justify-start">
              All resources
            </ToggleGroupItem>
            {grammarSections.map((section) => (
              <ToggleGroupItem
                key={section.id}
                value={section.id}
                className="justify-start"
              >
                {section.title}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Target className="size-4 text-primary" />
            Next drill
          </div>
          {selectedDrillItem ? (
            <div className="mt-3 flex flex-col gap-2">
              <div>
                <p className="text-sm font-medium">{selectedDrillItem.title}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedDrillItem.level} grammar focus
                </p>
              </div>
              {selectedDrillItem.quickDrillPrompt && (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {selectedDrillItem.quickDrillPrompt}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Select a resource to use as your next local drill focus.
            </p>
          )}
        </div>
      </aside>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 rounded-lg border bg-background p-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search verbs, cases, prepositions, Beruf phrases..."
              className="pl-8"
            />
          </div>
          <select
            value={selectedLevel}
            onChange={(event) =>
              setSelectedLevel(event.target.value as "all" | GrammarLevel)
            }
            className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level === "all" ? "All levels" : level}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {filteredItems.length} of {grammarItems.length} resources shown
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["sein", "haben", "werden", "Partizip II", "cases", "Beruf"].map(
              (term) => (
                <Button
                  key={term}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuery(term)}
                >
                  {term}
                </Button>
              )
            )}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <Empty className="rounded-xl border py-10">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search />
              </EmptyMedia>
              <EmptyTitle>No resources found</EmptyTitle>
              <EmptyDescription>
                Try a different search term, level, or category.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map(({ item, section, category }) => (
              <GrammarResourceCard
                key={item.id}
                item={item}
                sectionTitle={section.title}
                categoryTitle={category.title}
                selected={selectedDrillId === item.id}
                onSelect={() => selectForDrill(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function GrammarResourceCard({
  item,
  sectionTitle,
  categoryTitle,
  selected,
  onSelect,
}: {
  item: GrammarItem
  sectionTitle: string
  categoryTitle: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-1.5">
              <Badge variant="outline">{item.level}</Badge>
              <Badge variant="secondary">{sectionTitle}</Badge>
              <Badge variant="secondary">{categoryTitle}</Badge>
            </div>
            <CardTitle className="text-base">{item.title}</CardTitle>
            <CardDescription className="mt-1 leading-relaxed">
              {item.explanation}
            </CardDescription>
          </div>
          <Button
            type="button"
            variant={selected ? "secondary" : "outline"}
            size="sm"
            onClick={onSelect}
          >
            {selected ? (
              <CheckCircle2 data-icon="inline-start" />
            ) : (
              <Target data-icon="inline-start" />
            )}
            {selected ? "Selected" : "Use for next drill"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {item.examples.map((example) => (
            <div
              key={`${item.id}-${example.german}`}
              className="rounded-lg border p-3 text-sm"
            >
              <p className="font-medium">{example.german}</p>
              <p className="text-muted-foreground">{example.english}</p>
              {example.note && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {example.note}
                </p>
              )}
            </div>
          ))}
        </div>

        {item.tables?.map((table) => (
          <div key={`${item.id}-${table.title}`} className="rounded-lg border">
            <div className="border-b px-3 py-2 text-sm font-medium">
              {table.title}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  {table.headers.map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.rows.map((row, index) => (
                  <TableRow key={`${item.id}-${table.title}-${index}`}>
                    {row.map((cell, cellIndex) => (
                      <TableCell
                        key={`${item.id}-${table.title}-${index}-${cellIndex}`}
                        className="min-w-28 whitespace-normal"
                      >
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}

        {item.commonMistakes && item.commonMistakes.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Common mistakes</p>
              <div className="grid gap-2 md:grid-cols-2">
                {item.commonMistakes.map((mistake) => (
                  <div
                    key={`${item.id}-${mistake.wrong}`}
                    className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm"
                  >
                    <p className="text-muted-foreground line-through">
                      {mistake.wrong}
                    </p>
                    <p className="font-medium text-chart-2">
                      {mistake.correct}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {mistake.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {item.quickDrillPrompt && (
          <div className="rounded-lg border bg-muted/30 p-3 text-sm">
            <p className="mb-1 font-medium">Quick drill</p>
            <p className="text-muted-foreground">{item.quickDrillPrompt}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

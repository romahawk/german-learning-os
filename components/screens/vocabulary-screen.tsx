"use client"

import * as React from "react"
import { LayoutGrid, List, Search } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useApp } from "@/components/app-context"
import { getVocabularyByLearner } from "@/lib/firestore"
import {
  firestoreLearnersForFilter,
  formatTimestamp,
  LEARNING_DATA_CHANGED_EVENT,
} from "@/lib/learning-firestore-ui"
import type { Vocabulary } from "@/lib/types"

export function VocabularyScreen() {
  const { learner } = useApp()
  const [view, setView] = React.useState<"cards" | "table">("cards")
  const [search, setSearch] = React.useState("")
  const [rows, setRows] = React.useState<Vocabulary[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const loadVocabulary = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      console.info("[Firestore] Loading vocabulary...")

      const data = await Promise.all(
        firestoreLearnersForFilter(learner).map(getVocabularyByLearner)
      )
      setRows(
        data
          .flat()
          .sort(
            (a, b) =>
              (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)
          )
      )
    } catch (error) {
      console.error("[Firestore] Vocabulary load failed", error)
      setError("Could not load vocabulary from Firestore.")
    } finally {
      setLoading(false)
    }
  }, [learner])

  React.useEffect(() => {
    void loadVocabulary()

    window.addEventListener(LEARNING_DATA_CHANGED_EVENT, loadVocabulary)
    return () =>
      window.removeEventListener(LEARNING_DATA_CHANGED_EVENT, loadVocabulary)
  }, [loadVocabulary])

  const filteredRows = rows.filter((item) => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return true
    }

    return [
      item.word,
      item.meaning,
      item.status,
      item.exampleSentence,
      item.usageTip,
    ]
      .join(" ")
      .toLowerCase()
      .includes(query)
  })

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-row items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <CardTitle>Vocabulary</CardTitle>
              <CardDescription>
                Words gathered from Firestore sessions, with review metadata.
              </CardDescription>
            </div>
            <ToggleGroup
              value={[view]}
              onValueChange={(v) => v[0] && setView(v[0] as "cards" | "table")}
              variant="outline"
            >
              <ToggleGroupItem value="cards" aria-label="Card view">
                <LayoutGrid />
              </ToggleGroupItem>
              <ToggleGroupItem value="table" aria-label="Table view">
                <List />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search vocabulary"
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className={view === "table" ? "px-0" : undefined}>
          {loading && (
            <p className="px-6 py-8 text-sm text-muted-foreground">
              Loading vocabulary...
            </p>
          )}

          {!loading && error && (
            <p className="px-6 py-8 text-sm text-destructive">{error}</p>
          )}

          {!loading && !error && filteredRows.length === 0 && (
            <Empty className="py-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Search />
                </EmptyMedia>
                <EmptyTitle>No vocabulary found</EmptyTitle>
                <EmptyDescription>
                  Saved session vocabulary will appear here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {!loading && !error && filteredRows.length > 0 && view === "cards" && (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredRows.map((v) => (
                <div key={v.id} className="flex flex-col gap-2 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-lg font-semibold leading-tight">
                        {v.word}
                      </p>
                      <p className="text-sm text-muted-foreground">{v.meaning}</p>
                    </div>
                    <Badge variant="secondary">{v.status}</Badge>
                  </div>
                  <p className="text-sm italic text-foreground/80">
                    &ldquo;{v.exampleSentence}&rdquo;
                  </p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline">{v.pos}</Badge>
                      <Badge variant="outline">x{v.frequency}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(v.nextReview)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredRows.length > 0 && view === "table" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Word</TableHead>
                  <TableHead>Meaning</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead className="text-right">Next review</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.word}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {v.meaning}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{v.status}</Badge>
                    </TableCell>
                    <TableCell>{v.frequency}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatTimestamp(v.nextReview)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

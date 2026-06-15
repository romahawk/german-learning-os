"use client"

import * as React from "react"
import { AlertCircle, Search } from "lucide-react"
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useApp } from "@/components/app-context"
import { getMistakesByLearner } from "@/lib/firestore"
import {
  firestoreLearnersForFilter,
  LEARNING_DATA_CHANGED_EVENT,
} from "@/lib/learning-firestore-ui"
import type { Mistake } from "@/lib/types"

export function MistakesScreen() {
  const { learner } = useApp()
  const [search, setSearch] = React.useState("")
  const [rows, setRows] = React.useState<Mistake[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const loadMistakes = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      console.info("[Firestore] Loading mistakes...")

      const data = await Promise.all(
        firestoreLearnersForFilter(learner).map(getMistakesByLearner)
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
      console.error("[Firestore] Mistakes load failed", error)
      setError("Could not load mistakes from Firestore.")
    } finally {
      setLoading(false)
    }
  }, [learner])

  React.useEffect(() => {
    void loadMistakes()

    window.addEventListener(LEARNING_DATA_CHANGED_EVENT, loadMistakes)
    return () =>
      window.removeEventListener(LEARNING_DATA_CHANGED_EVENT, loadMistakes)
  }, [loadMistakes])

  const filteredRows = rows.filter((item) => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return true
    }

    return [
      item.original,
      item.correction,
      item.category,
      item.rule,
      item.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(query)
  })

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="gap-4">
          <div>
            <CardTitle>Mistakes</CardTitle>
            <CardDescription>
              Every Firestore correction captured, categorized, and ready for review.
            </CardDescription>
          </div>
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search mistakes"
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {loading && (
            <p className="px-6 py-8 text-sm text-muted-foreground">
              Loading mistakes...
            </p>
          )}

          {!loading && error && (
            <p className="px-6 py-8 text-sm text-destructive">{error}</p>
          )}

          {!loading && !error && filteredRows.length === 0 && (
            <Empty className="py-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <AlertCircle />
                </EmptyMedia>
                <EmptyTitle>No mistakes found</EmptyTitle>
                <EmptyDescription>
                  Saved session mistakes will appear here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {!loading && !error && filteredRows.length > 0 && (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Original</TableHead>
                      <TableHead>Correction</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Frequency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRows.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="text-muted-foreground line-through">
                          {m.original}
                        </TableCell>
                        <TableCell className="font-medium text-chart-2">
                          {m.correction}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{m.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{m.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{m.frequency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-3 px-6 md:hidden">
                {filteredRows.map((m) => (
                  <div key={m.id} className="rounded-lg border p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{m.category}</Badge>
                      <Badge variant="secondary">{m.status}</Badge>
                      <Badge variant="secondary">x{m.frequency}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-through">
                      {m.original}
                    </p>
                    <p className="text-sm font-medium text-chart-2">
                      {m.correction}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

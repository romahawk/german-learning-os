"use client"

import * as React from "react"
import { LayoutGrid, List } from "lucide-react"
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useApp } from "@/components/app-context"
import { StatusBadge } from "@/components/status-badge"
import { filterByLearner, learnerName, vocabulary } from "@/lib/data"

export function VocabularyScreen() {
  const { learner } = useApp()
  const [view, setView] = React.useState<"cards" | "table">("cards")
  const rows = filterByLearner(vocabulary, learner)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <CardTitle>Vocabulary</CardTitle>
            <CardDescription>
              Words gathered from sessions, with examples and review schedule.
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
        </CardHeader>
        <CardContent className={view === "table" ? "px-0" : undefined}>
          {view === "cards" ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {rows.map((v) => (
                <div key={v.id} className="flex flex-col gap-2 rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-lg font-semibold leading-tight">
                        {v.article && (
                          <span className="text-muted-foreground">{v.article} </span>
                        )}
                        {v.word}
                      </p>
                      <p className="text-sm text-muted-foreground">{v.meaning}</p>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>
                  <p className="text-sm italic text-foreground/80">
                    &ldquo;{v.example}&rdquo;
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-1">
                    <Badge variant="outline">{v.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {learner === "both" ? `${learnerName(v.learner)} · ` : ""}
                      {v.nextReview}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {learner === "both" && <TableHead>Learner</TableHead>}
                  <TableHead>Word</TableHead>
                  <TableHead>Meaning</TableHead>
                  <TableHead>Example</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Next review</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((v) => (
                  <TableRow key={v.id}>
                    {learner === "both" && (
                      <TableCell>
                        <Badge variant="secondary">{learnerName(v.learner)}</Badge>
                      </TableCell>
                    )}
                    <TableCell className="font-medium">
                      {v.article && (
                        <span className="text-muted-foreground">{v.article} </span>
                      )}
                      {v.word}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{v.meaning}</TableCell>
                    <TableCell className="max-w-xs truncate italic text-muted-foreground">
                      {v.example}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={v.status} />
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {v.nextReview}
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

"use client"

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
import { useApp } from "@/components/app-context"
import { StatusBadge } from "@/components/status-badge"
import { filterByLearner, learnerName, mistakes } from "@/lib/data"

export function MistakesScreen() {
  const { learner } = useApp()
  const rows = filterByLearner(mistakes, learner)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Mistakes</CardTitle>
          <CardDescription>
            Every correction captured, categorized, and scheduled for spaced review.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  {learner === "both" && <TableHead>Learner</TableHead>}
                  <TableHead>Original</TableHead>
                  <TableHead>Correction</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Next review</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((m) => (
                  <TableRow key={m.id}>
                    {learner === "both" && (
                      <TableCell>
                        <Badge variant="secondary">{learnerName(m.learner)}</Badge>
                      </TableCell>
                    )}
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
                      <StatusBadge status={m.status} />
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {m.nextReview}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 px-6 md:hidden">
            {rows.map((m) => (
              <div key={m.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-center gap-2">
                  {learner === "both" && (
                    <Badge variant="secondary">{learnerName(m.learner)}</Badge>
                  )}
                  <Badge variant="outline">{m.category}</Badge>
                  <StatusBadge status={m.status} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-through">
                  {m.original}
                </p>
                <p className="text-sm font-medium text-chart-2">{m.correction}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Next review: {m.nextReview}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

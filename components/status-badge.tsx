"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Status } from "@/lib/data"
import { statusLabels } from "@/lib/data"

const styles: Record<Status, string> = {
  new: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  learning: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  review: "bg-primary/15 text-primary border-primary/30",
  resolved: "bg-chart-2/15 text-chart-2 border-chart-2/30",
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant="outline" className={cn("font-medium", styles[status])}>
      {statusLabels[status]}
    </Badge>
  )
}

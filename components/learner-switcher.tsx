"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useApp } from "@/components/app-context"
import type { LearnerFilter } from "@/lib/data"

export function LearnerSwitcher() {
  const { learner, setLearner } = useApp()
  return (
    <ToggleGroup
      value={[learner]}
      onValueChange={(v) => v[0] && setLearner(v[0] as LearnerFilter)}
      variant="outline"
      className="bg-card"
    >
      <ToggleGroupItem value="roman" className="px-4">
        Roman
      </ToggleGroupItem>
      <ToggleGroupItem value="iryna" className="px-4">
        Iryna
      </ToggleGroupItem>
      <ToggleGroupItem value="both" className="px-4">
        Both
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

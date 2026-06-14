"use client"

import {
  LayoutDashboard,
  Plus,
  RotateCcw,
  BookOpen,
  AlertCircle,
  TrendingUp,
  Languages,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useApp, type Screen } from "@/components/app-context"
import {
  dueToday,
  filterByLearner,
  mistakes,
  vocabulary,
} from "@/lib/data"

const nav: { id: Screen; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "new-session", label: "New Session", icon: Plus },
  { id: "review", label: "Review", icon: RotateCcw },
  { id: "vocabulary", label: "Vocabulary", icon: BookOpen },
  { id: "mistakes", label: "Mistakes", icon: AlertCircle },
  { id: "progress", label: "Progress", icon: TrendingUp },
]

export function AppSidebar() {
  const { screen, setScreen, learner } = useApp()

  const dueCount =
    dueToday(filterByLearner(mistakes, learner)).length +
    dueToday(filterByLearner(vocabulary, learner)).length

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Languages className="size-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">German Learning OS</span>
            <span className="text-xs text-muted-foreground">Family edition</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={screen === item.id}
                    onClick={() => setScreen(item.id)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {item.id === "review" && dueCount > 0 && (
                    <SidebarMenuBadge>{dueCount}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          Private family tool. No accounts, no data leaves home.
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

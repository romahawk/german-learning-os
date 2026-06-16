"use client"

import { Mic } from "lucide-react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AppProvider, useApp, type Screen } from "@/components/app-context"
import { AppSidebar } from "@/components/app-sidebar"
import { FirebaseConnectionTest } from "@/components/firebase-connection-test"
import { LearnerSwitcher } from "@/components/learner-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { DashboardScreen } from "@/components/screens/dashboard-screen"
import { SessionDetailScreen } from "@/components/screens/session-detail-screen"
import { NewSessionScreen } from "@/components/screens/new-session-screen"
import { ReviewScreen } from "@/components/screens/review-screen"
import { VocabularyScreen } from "@/components/screens/vocabulary-screen"
import { MistakesScreen } from "@/components/screens/mistakes-screen"
import { ProgressScreen } from "@/components/screens/progress-screen"

const meta: Record<Screen, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Your family's German learning at a glance." },
  "session-detail": { title: "Session Detail", subtitle: "Everything saved from one practice session." },
  "new-session": { title: "New Session", subtitle: "Capture and analyze a practice session." },
  review: { title: "Review", subtitle: "Spaced repetition for what's due today." },
  vocabulary: { title: "Vocabulary", subtitle: "Words collected from every session." },
  mistakes: { title: "Mistakes", subtitle: "Corrections, categorized and scheduled." },
  progress: { title: "Progress", subtitle: "Trends and recurring gaps over time." },
}

function ScreenRouter() {
  const { screen } = useApp()
  switch (screen) {
    case "dashboard":
      return <DashboardScreen />
    case "session-detail":
      return <SessionDetailScreen />
    case "new-session":
      return <NewSessionScreen />
    case "review":
      return <ReviewScreen />
    case "vocabulary":
      return <VocabularyScreen />
    case "mistakes":
      return <MistakesScreen />
    case "progress":
      return <ProgressScreen />
  }
}

function Shell() {
  const { screen, setScreen } = useApp()
  const m = meta[screen]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex flex-col gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1">
              <h1 className="text-base font-semibold leading-tight md:text-lg">
                {m.title}
              </h1>
              <p className="hidden text-sm text-muted-foreground sm:block">
                {m.subtitle}
              </p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <FirebaseConnectionTest />
              <LearnerSwitcher />
              <ThemeToggle />
              <Button onClick={() => setScreen("new-session")}>
                <Mic data-icon="inline-start" />
                Start session
              </Button>
            </div>
            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <FirebaseConnectionTest />
            <LearnerSwitcher />
            <Button
              size="sm"
              className="ml-auto"
              onClick={() => setScreen("new-session")}
            >
              <Mic data-icon="inline-start" />
              Session
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <ScreenRouter />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function AppShell() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}

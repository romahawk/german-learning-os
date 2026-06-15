"use client"

import * as React from "react"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"

type TestStatus =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string }

export function FirebaseConnectionTest() {
  const [status, setStatus] = React.useState<TestStatus>({
    type: "idle",
    message: "",
  })
  const [isTesting, setIsTesting] = React.useState(false)

  async function handleTestFirebase() {
    setIsTesting(true)
    setStatus({ type: "idle", message: "" })

    try {
      await addDoc(collection(db, "test"), {
        message: "Firebase connection successful",
        createdAt: serverTimestamp(),
      })

      setStatus({
        type: "success",
        message: "Firebase connection successful.",
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Firebase connection test failed."

      setStatus({ type: "error", message })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleTestFirebase}
        disabled={isTesting}
      >
        {isTesting ? "Testing..." : "Test Firebase"}
      </Button>
      {status.type !== "idle" ? (
        <p
          className={
            status.type === "success"
              ? "max-w-48 truncate text-xs text-chart-2"
              : "max-w-48 truncate text-xs text-destructive"
          }
          title={status.message}
        >
          {status.message}
        </p>
      ) : null}
    </div>
  )
}

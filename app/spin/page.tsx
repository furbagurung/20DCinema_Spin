"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"

import { ThemeToggle } from "@/components/theme-toggle"
import { SpinWheel } from "@/components/spin-wheel"

export default function SpinPage() {
  const [name, setName] = useState("")

  useEffect(() => {
    const saved = sessionStorage.getItem("20d-spin-participant")

    if (!saved) {
      window.location.replace("/")
      return
    }

    try {
      const participant = JSON.parse(saved) as { name?: string }
      setName(participant.name ?? "")
    } catch {
      setName("")
    }
  }, [])

  return (
    <main className="relative min-h-svh overflow-hidden bg-background px-5 py-7 text-foreground sm:py-10">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[44%] h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [0.94, 1.04, 0.94], opacity: [0.16, 0.28, 0.16] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-lg flex-col sm:min-h-[calc(100svh-5rem)]">
        <div className="flex items-center justify-between"><div className="absolute right-0 top-0"><ThemeToggle/></div>
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Link
              href="/"
              aria-label="Go back"
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="rounded-xl bg-[#100A0C] px-3 py-1.5"><Image
              src="/logo/White Reversed 20D Cinema Secondary Logo.png"
              alt="20D Cinema"
              width={220}
              height={90}
              priority
              className="h-auto w-28 sm:w-32"
            /></div>
          </motion.div>

          <div className="size-10" aria-hidden="true" />
        </div>

        <motion.div
          className="mt-5 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {name ? `Good luck, ${name}` : "Good luck"}
          </p>
          <h1 className="mt-2 font-heading text-2xl font-semibold uppercase tracking-[0.08em] sm:text-3xl">
            Spin the Wheel
          </h1>
        </motion.div>

        <motion.div
          className="flex flex-1 items-center justify-center pb-2 pt-1"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          <SpinWheel />
        </motion.div>
      </div>
    </main>
  )
}

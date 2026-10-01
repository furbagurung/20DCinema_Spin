"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowLeft, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

import { DashainDecor } from "@/components/dashain-decor"
import { ThemeToggle } from "@/components/theme-toggle"
import { SpinWheel } from "@/components/spin-wheel"
import { Badge } from "@/components/ui/badge"

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
    <main className="dashain-client relative min-h-svh overflow-hidden bg-background px-4 py-5 text-foreground sm:px-6 sm:py-7">
      <DashainDecor />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-2.5rem)] w-full max-w-xl flex-col sm:min-h-[calc(100svh-3.5rem)]">
        <header className="flex items-center justify-between gap-3">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Link
              href="/"
              aria-label="Go back"
              className="inline-flex size-10 items-center justify-center rounded-full border border-[#E8B94F]/25 bg-background/75 text-muted-foreground shadow-sm backdrop-blur-md transition hover:border-[#E8B94F]/50 hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="rounded-xl border border-[#E8B94F]/30 bg-[#100A0C] px-3 py-1.5 shadow-[0_10px_30px_rgba(214,0,60,0.12)]">
              <Image
                src="/logo/White Reversed 20D Cinema Secondary Logo.png"
                alt="20D Cinema"
                width={220}
                height={90}
                priority
                className="h-auto w-28 sm:w-32"
              />
            </div>
          </motion.div>

          <div className="flex size-10 items-center justify-center">
            <ThemeToggle />
          </div>
        </header>

        <motion.div
          className="mt-5 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <Badge className="border border-[#E8B94F]/30 bg-[#E8B94F]/10 text-[#B98A28] shadow-none dark:text-[#F3D47A]">
            <Sparkles className="size-3" />
            Dashain Spin &amp; Win
          </Badge>

          <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {name ? "Good luck, " + name : "Good luck"}
          </p>

          <h1 className="mt-2 font-heading text-2xl font-semibold uppercase tracking-[0.07em] sm:text-3xl">
            Spin the Wheel
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Spin once and reveal your Dashain surprise.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-1 items-center justify-center pb-4 pt-1 sm:pb-7"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.16,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <SpinWheel />
        </motion.div>
      </div>
    </main>
  )
}

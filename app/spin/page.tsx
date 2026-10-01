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
    <main className="dashain-client relative min-h-svh overflow-hidden px-3 py-4 text-foreground sm:px-5 sm:py-7">
      <DashainDecor />

      <div className="relative z-10 mx-auto w-full max-w-[440px]">
        <motion.div
          className="dashain-game-frame overflow-hidden rounded-[30px] border-[3px] border-[#D9AD3C] bg-[#5E071A] p-1 shadow-[0_25px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,229,151,0.35)]"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative overflow-hidden rounded-[24px] border border-[#F2D06C]/65 bg-[#760A22] px-3 pb-4 pt-4 sm:px-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,210,73,0.16),transparent_32%),linear-gradient(180deg,#7F0A23_0%,#5A0719_100%)]" />

            <header className="relative z-20 text-center">
              <div className="mx-auto w-fit rounded-lg border border-[#F1D06B]/60 bg-[#FFF4D0] px-4 py-1.5 shadow-[0_5px_16px_rgba(0,0,0,0.25)]">
                <Image
                  src="/logo/White Reversed 20D Cinema Secondary Logo.png"
                  alt="20D Cinema"
                  width={220}
                  height={90}
                  priority
                  className="h-auto w-28 sm:w-32"
                />
              </div>

              <Badge className="mt-3 border border-[#F1D06B]/35 bg-[#F1D06B]/10 text-[#FFEAA2] shadow-none">
                <Sparkles className="size-3" />
                Dashain Spin &amp; Win
              </Badge>

              <h1 className="mt-2 text-[24px] font-black leading-tight text-[#FFD85F] [text-shadow:0_2px_0_#7C2600,0_4px_12px_rgba(0,0,0,0.35)] sm:text-3xl">
                Spin &amp; Win
              </h1>

              <p className="mt-1 text-[10px] font-medium tracking-[0.12em] text-[#FFE9A2]/80">
                {name ? "Good luck, " + name : "Good luck"} · एकपटक मात्र spin
              </p>
            </header>

            <div className="relative z-10 mt-4 overflow-hidden rounded-[20px] border border-[#F4D46F]/45 bg-[linear-gradient(180deg,#2F82CF_0%,#7FC5E8_55%,#D39A58_100%)] px-2 pb-3 pt-2">
              <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.6),transparent_24%),radial-gradient(circle_at_80%_28%,rgba(255,255,255,0.55),transparent_20%)]" />
              <div className="absolute left-[8%] top-3 text-lg">🪁</div>
              <div className="absolute right-[8%] top-4 text-lg">🪁</div>

              <div className="relative z-10">
                <SpinWheel />
              </div>
            </div>
          </div>
        </motion.div>

        <p className="relative z-10 mt-3 text-center text-[10px] text-muted-foreground">
          20D Cinema · KL Tower · Chuchepati, Kathmandu
        </p>
      </div>

      <div className="absolute right-3 top-3 z-50 sm:right-5 sm:top-5">
        <ThemeToggle />
      </div>

      <div className="absolute left-3 top-3 z-50 sm:left-5 sm:top-5">
        <Link
          href="/"
          aria-label="Go back"
          className="inline-flex size-9 items-center justify-center rounded-full border border-[#E8B94F]/30 bg-background/70 text-muted-foreground shadow-sm backdrop-blur-md transition hover:border-[#E8B94F]/60 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
        </Link>
      </div>
    </main>
  )
}

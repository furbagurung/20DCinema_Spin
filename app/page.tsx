"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Gift, Sparkles } from "lucide-react"

import { DashainDecor } from "@/components/dashain-decor"
import { ThemeToggle } from "@/components/theme-toggle"
import { ParticipantForm } from "@/components/participant-form"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <main className="dashain-client relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 py-7 text-foreground sm:px-6 sm:py-10">
      <DashainDecor />

      <div className="absolute right-4 top-4 z-30 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <section className="relative z-10 w-full max-w-md">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-[#E8B94F]/35 bg-[#E8B94F]/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#B98A28] dark:text-[#F3D47A]">
            <Sparkles className="size-3" />
            Dashain Special
          </div>

          <div className="relative mx-auto w-fit">
            <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D6003C]/20 blur-2xl" />
            <div className="relative rounded-2xl border border-[#E8B94F]/35 bg-[#100A0C] px-5 py-2.5 shadow-[0_16px_50px_rgba(214,0,60,0.16)]">
              <Image
                src="/logo/White Reversed 20D Cinema Secondary Logo.png"
                alt="20D Cinema"
                width={220}
                height={90}
                priority
                className="h-auto w-36 sm:w-40"
              />
            </div>
          </div>

          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#B98A28] dark:text-[#F3D47A]">
            Dashain ko khusi · 20D ko surprise
          </p>

          <h1 className="mt-2 font-heading text-[2rem] font-semibold uppercase leading-none tracking-[0.06em] sm:text-4xl">
            Spin <span className="text-[#D6003C]">&amp;</span> Win
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Enter your details, spin the wheel, and discover your Dashain reward.
          </p>
        </motion.div>

        <motion.div
          className="mt-7"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="dashain-card overflow-hidden border-[#D6003C]/15 bg-card/95 shadow-[0_24px_80px_rgba(75,7,21,0.16)] backdrop-blur-xl">
            <div className="h-1 w-full bg-gradient-to-r from-[#31521E] via-[#E8B94F] to-[#D6003C]" />

            <CardHeader className="pb-2 text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-[#D6003C]/10 text-[#D6003C]">
                <Gift className="size-5" />
              </div>

              <CardTitle className="mt-2 text-lg">Enter &amp; Play</CardTitle>
              <CardDescription>
                Your name and Nepal mobile number are all you need.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ParticipantForm />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[10px] text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.3 }}
        >
          <Badge
            variant="outline"
            className="border-[#668F35]/25 bg-[#668F35]/5 text-[#49652A] dark:text-[#A9C77C]"
          >
            1 spin per phone
          </Badge>
          <span>•</span>
          <span>20D Cinema · KL Tower · Kathmandu</span>
        </motion.div>
      </section>
    </main>
  )
}

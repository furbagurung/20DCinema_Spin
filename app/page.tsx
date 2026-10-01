"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Gift, Sparkles } from "lucide-react"

import { DashainDecor } from "@/components/dashain-decor"
import { DashainWheelPreview } from "@/components/dashain-wheel-preview"
import { ThemeToggle } from "@/components/theme-toggle"
import { ParticipantForm } from "@/components/participant-form"

export default function Home() {
  return (
    <main className="dashain-client relative min-h-svh overflow-hidden px-3 py-5 text-foreground sm:px-5 sm:py-8">
      <DashainDecor />

      <div className="absolute right-3 top-3 z-50 sm:right-5 sm:top-5">
        <ThemeToggle />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-[430px]">
        <motion.div
          className="dashain-game-frame relative overflow-hidden rounded-[30px] border-[3px] border-[#D9AD3C] bg-[#5E071A] p-1 shadow-[0_25px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,229,151,0.35)]"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative overflow-hidden rounded-[24px] border border-[#F2D06C]/65 bg-[#760A22]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,210,73,0.16),transparent_32%),linear-gradient(180deg,#7F0A23_0%,#5A0719_100%)]" />

            <header className="relative z-20 px-4 pb-3 pt-4 text-center sm:px-6 sm:pt-5">
              <div className="mx-auto w-fit rounded-lg border border-[#F1D06B]/60 bg-[#FFF4D0] px-5 py-1.5 shadow-[0_5px_16px_rgba(0,0,0,0.25)]">
                <Image
                  src="/logo/White Reversed 20D Cinema Secondary Logo.png"
                  alt="20D Cinema"
                  width={220}
                  height={90}
                  priority
                  className="h-auto w-32 sm:w-36"
                />
              </div>

              <p className="mt-3 text-[9px] font-semibold tracking-[0.2em] text-[#FFEAA4]">
                गेम खेल्नुहोस्, उपहार जित्नुहोस्
              </p>
              <h1 className="mt-1 text-[25px] font-black leading-tight tracking-[-0.02em] text-[#FFD85F] [text-shadow:0_2px_0_#7C2600,0_4px_12px_rgba(0,0,0,0.35)] sm:text-3xl">
                दशैं–तिहार अफर गेम
              </h1>
              <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-[#E69A1A] via-[#FFE57A] to-[#E69A1A]" />
            </header>

            <div className="relative z-10 mx-3 overflow-hidden rounded-[20px] border border-[#F4D46F]/50 bg-[#2B5F9A] shadow-[inset_0_0_50px_rgba(0,0,0,0.2)] sm:mx-4">
              <div className="relative h-[150px] overflow-hidden bg-gradient-to-b from-[#2F82CF] via-[#7FC5E8] to-[#F2C77B] sm:h-[175px]">
                <div className="absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.65),transparent_24%),radial-gradient(circle_at_72%_22%,rgba(255,255,255,0.55),transparent_20%)]" />

                <div className="absolute left-[10%] top-5 rotate-[-18deg] text-xl sm:text-2xl">🪁</div>
                <div className="absolute right-[12%] top-8 rotate-[18deg] text-xl sm:text-2xl">🪁</div>

                <div className="absolute bottom-[-30px] left-[-6%] h-28 w-[62%] rotate-[7deg] bg-[#355A70] [clip-path:polygon(0_100%,18%_42%,34%_64%,51%_20%,70%_57%,84%_34%,100%_100%)] opacity-90" />
                <div className="absolute bottom-[-26px] right-[-8%] h-28 w-[68%] rotate-[-6deg] bg-[#496F7C] [clip-path:polygon(0_100%,18%_55%,34%_28%,50%_63%,68%_18%,82%_48%,100%_100%)] opacity-95" />

                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#7E4B20]/65 to-transparent" />

                <div className="absolute left-1.5 top-0 flex h-full flex-col justify-between py-3 text-[15px] sm:text-lg">
                  <span>🌼</span><span>🌼</span><span>🌼</span><span>🌼</span>
                </div>
                <div className="absolute right-1.5 top-0 flex h-full flex-col justify-between py-3 text-[15px] sm:text-lg">
                  <span>🌼</span><span>🌼</span><span>🌼</span><span>🌼</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 px-3 pb-3 pt-5 sm:px-5">
              <DashainWheelPreview />

              <div className="mt-5 rounded-[18px] border border-[#F1C85B]/60 bg-[#8A102A] p-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.22)] sm:p-4">
                <div className="mb-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFEAA2]">
                  <Gift className="size-3.5" />
                  Enter your details to play
                </div>

                <ParticipantForm />
              </div>

              <div className="mt-3 flex items-center justify-center gap-2 text-[9px] font-medium text-[#FFE8A0]/75">
                <Sparkles className="size-3" />
                One spin per phone number · Terms apply
              </div>
            </div>
          </div>
        </motion.div>

        <p className="relative z-10 mt-4 text-center text-[10px] text-muted-foreground">
          20D Cinema · KL Tower · Chuchepati, Kathmandu
        </p>
      </section>
    </main>
  )
}

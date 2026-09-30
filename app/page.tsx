"use client"

import Image from "next/image"
import { motion } from "motion/react"

import { ParticipantForm } from "@/components/participant-form"

export default function Home() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#09060A] px-5 py-10 text-[#F8F7F4]">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[42%] h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5A0B1B]/20 blur-3xl"
        animate={{ scale: [0.92, 1.06, 0.92], opacity: [0.16, 0.28, 0.16] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <section className="relative z-10 w-full max-w-sm">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/logo/White Reversed 20D Cinema Secondary Logo.png"
            alt="20D Cinema"
            width={220}
            height={90}
            priority
            className="h-auto w-36 sm:w-40"
          />
        </motion.div>

        <motion.div
          className="mt-9 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#FF3B70]/70">
            Play · Spin · Win
          </p>
          <h1 className="mt-3 font-heading text-3xl font-semibold uppercase tracking-[0.08em] sm:text-4xl">
            Spin & Win
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/45">
            Enter your details and try your luck.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          <ParticipantForm />
        </motion.div>

        <motion.p
          className="mt-7 text-center text-[11px] text-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.28 }}
        >
          20D Cinema · KL Tower, Chuchepati
        </motion.p>
      </section>
    </main>
  )
}

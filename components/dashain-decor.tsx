"use client"

import { motion } from "motion/react"

export function DashainDecor() {
  const leaves = Array.from({ length: 5 })

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8B94F]/80 to-transparent" />

      <motion.div
        className="absolute left-1/2 top-[-90px] h-64 w-64 -translate-x-1/2 rounded-full bg-[#D6003C]/15 blur-3xl"
        animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.55, 0.8, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute left-3 top-8 hidden h-36 w-20 sm:block">
        {leaves.map((_, index) => (
          <span
            key={index}
            className="absolute bottom-0 left-1/2 h-28 w-3 origin-bottom rounded-full bg-gradient-to-t from-[#31521E] via-[#668F35] to-[#D6B24C]"
            style={{
              transform: `translateX(-50%) rotate(${-34 + index * 17}deg)`,
            }}
          />
        ))}
      </div>

      <div className="absolute right-3 top-8 hidden h-36 w-20 scale-x-[-1] sm:block">
        {leaves.map((_, index) => (
          <span
            key={index}
            className="absolute bottom-0 left-1/2 h-28 w-3 origin-bottom rounded-full bg-gradient-to-t from-[#31521E] via-[#668F35] to-[#D6B24C]"
            style={{
              transform: `translateX(-50%) rotate(${-34 + index * 17}deg)`,
            }}
          />
        ))}
      </div>

      <div className="absolute left-5 top-1/3 size-2 rounded-full bg-[#E8B94F]/70 shadow-[0_0_18px_rgba(232,185,79,0.65)]" />
      <div className="absolute right-8 top-[28%] size-1.5 rounded-full bg-[#D6003C]/70 shadow-[0_0_16px_rgba(214,0,60,0.6)]" />
      <div className="absolute bottom-24 left-[12%] size-1.5 rounded-full bg-[#E8B94F]/60" />
      <div className="absolute bottom-32 right-[12%] size-2 rounded-full bg-[#668F35]/60" />

      <div className="absolute bottom-0 left-1/2 h-48 w-[min(100%,700px)] -translate-x-1/2 rounded-full bg-[#D6003C]/8 blur-3xl" />
    </div>
  )
}

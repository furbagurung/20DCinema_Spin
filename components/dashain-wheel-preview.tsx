"use client"

import { motion } from "motion/react"

const prizes = [
  ["FREE", "TICKET"],
  ["50%", "OFF"],
  ["Rs.100", "OFF"],
  ["Rs.50", "OFF"],
  ["20%", "OFF"],
  ["SPIN", "AGAIN"],
]

export function DashainWheelPreview() {
  return (
    <div className="relative mx-auto w-[min(72vw,270px)]">
      <div className="absolute left-1/2 top-1/2 size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F3B52B]/20 blur-2xl" />

      <div className="relative aspect-square rounded-full border-[7px] border-[#F0C95A] bg-[#7A0B24] p-2 shadow-[0_14px_35px_rgba(0,0,0,0.35),inset_0_0_0_3px_rgba(255,226,128,0.35)]">
        <motion.div
          className="relative h-full w-full overflow-hidden rounded-full border-2 border-[#F8D979]/70"
          style={{
            background:
              "conic-gradient(from -30deg, #D6003C 0deg 60deg, #F2C531 60deg 120deg, #A40B31 120deg 180deg, #F4C83D 180deg 240deg, #D6003C 240deg 300deg, #F2C531 300deg 360deg)",
          }}
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {prizes.map((prize, index) => {
            const angle = index * 60
            return (
              <div
                key={prize.join("-")}
                className="absolute left-1/2 top-1/2 z-10 flex w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center text-white"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(clamp(-92px, -22vw, -70px)) rotate(${-angle}deg)`,
                }}
              >
                <span className="font-heading text-[8px] font-bold leading-tight tracking-[0.03em] sm:text-[9px]">
                  {prize[0]}
                </span>
                <span className="mt-0.5 text-[7px] font-bold tracking-[0.1em] text-white/80 sm:text-[8px]">
                  {prize[1]}
                </span>
              </div>
            )
          })}

          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-1/2 w-px origin-top bg-[#FFF0AE]/55"
              style={{
                transform: `translateX(-50%) rotate(${index * 60 + 30}deg)`,
              }}
            />
          ))}

          <div className="absolute inset-[15%] rounded-full border border-[#FFF0AE]/35" />
        </motion.div>

        <div className="absolute left-1/2 top-1/2 z-20 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#F5D06B] bg-[#9C1835] shadow-[0_8px_20px_rgba(0,0,0,0.35)] sm:size-16">
          <span className="font-heading text-[10px] font-bold tracking-[0.1em] text-[#FFE9A2]">
            20D
          </span>
        </div>

        {Array.from({ length: 6 }).map((_, index) => {
          const angle = index * 60
          return (
            <span
              key={`bolt-${index}`}
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 z-30 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FFF0AE] bg-[#D6A52C] shadow-[0_0_8px_rgba(255,220,115,0.65)]"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(clamp(-123px, -29vw, -95px))`,
              }}
            />
          )
        })}
      </div>

      <div className="absolute left-1/2 top-[-12px] z-40 -translate-x-1/2">
        <div className="h-0 w-0 border-x-[13px] border-t-[24px] border-x-transparent border-t-[#FFF0AE] drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]" />
      </div>
    </div>
  )
}

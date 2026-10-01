"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

type PrizeKey =
  | "free_ticket"
  | "fifty_percent"
  | "rs_100_off"
  | "rs_50_off"
  | "twenty_percent"
  | "spin_again"

export type SpinGameResult = {
  ok: boolean
  code?: string
  message?: string
  prize_key: PrizeKey
  label?: string
  prize_code?: string
}

type Props = {
  resetSignal?: number
  onResult: (result: SpinGameResult) => void
  onError: (message: string) => void
}

const labels: Array<{ top: string; bottom: string } | null> = [
  { top: "FREE", bottom: "TICKET" },
  { top: "50%", bottom: "OFF" },
  { top: "Rs.100", bottom: "OFF" },
  { top: "Rs.50", bottom: "OFF" },
  { top: "20%", bottom: "OFF" },
  { top: "SPIN", bottom: "AGAIN" },
  null,
  null,
]

const slotByPrize: Record<PrizeKey, number> = {
  free_ticket: 0,
  fifty_percent: 1,
  rs_100_off: 2,
  rs_50_off: 3,
  twenty_percent: 4,
  spin_again: 5,
}

const normalize = (value: number) => ((value % 360) + 360) % 360

export function SpinGame({
  resetSignal = 0,
  onResult,
  onError,
}: Props) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [countdown, setCountdown] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [pendingResult, setPendingResult] = useState<SpinGameResult | null>(null)
  const rotationRef = useRef(0)
  const lastTickRef = useRef(-1)
  const audioRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("20d-spin-participant")
      if (saved) setName(JSON.parse(saved)?.name ?? "")
    } catch {}
  }, [])

  useEffect(() => {
    setRotation(0)
    rotationRef.current = 0
    setSpinning(false)
    setCountdown(null)
    setPendingResult(null)
  }, [resetSignal])

  const tick = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (!AudioCtx) return
      audioRef.current ??= new AudioCtx()
      const ctx = audioRef.current
      void ctx.resume()
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.type = "triangle"
      oscillator.frequency.value = 650
      gain.gain.setValueAtTime(0.0001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.004)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045)
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.05)
    } catch {}
  }, [])

  const requestSpin = useCallback(async () => {
    const saved = sessionStorage.getItem("20d-spin-participant")
    if (!saved) throw new Error("Please enter your details first.")

    let participant: { name?: string; phone?: string }
    try {
      participant = JSON.parse(saved)
    } catch {
      throw new Error("Please enter your details first.")
    }

    if (!participant.name || !participant.phone) {
      throw new Error("Please enter your details first.")
    }

    const response = await fetch("/api/spin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(participant),
    })
    const data = (await response.json()) as Partial<SpinGameResult>

    if (!response.ok || !data.ok || !data.prize_key) {
      throw new Error(data.message ?? "We couldn't start your spin.")
    }

    return data as SpinGameResult
  }, [])

  const startCountdown = useCallback((callback: () => void) => {
    const steps = ["3", "2", "1", "SPIN!"]
    let index = 0
    const next = () => {
      setCountdown(steps[index])
      if (index === steps.length - 1) {
        window.setTimeout(() => {
          setCountdown(null)
          callback()
        }, 420)
        return
      }
      window.setTimeout(() => {
        index += 1
        next()
      }, 620)
    }
    next()
  }, [])

  const spinTo = useCallback(
    (result: SpinGameResult) => {
      const slot = slotByPrize[result.prize_key]
      const current = normalize(rotationRef.current)
      const desired = normalize(-(slot * 45))
      const delta = normalize(desired - current)
      const target = rotationRef.current + 7 * 360 + delta

      lastTickRef.current = Math.floor(current / 45)
      rotationRef.current = target
      setPendingResult(result)
      setRotation(target)
    },
    [],
  )

  async function handleSpin() {
    if (spinning || countdown) return
    setSpinning(true)

    try {
      const result = await requestSpin()
      startCountdown(() => spinTo(result))
    } catch (error) {
      setSpinning(false)
      onError(
        error instanceof Error
          ? error.message
          : "We couldn't start your spin.",
      )
    }
  }

  return (
    <div className="relative mx-auto aspect-[500/874] w-full max-w-[500px] overflow-hidden bg-[#5d0718] shadow-[0_20px_80px_rgba(0,0,0,.45)]">
      <Image
        src="/game-assets/background.webp"
        alt=""
        fill
        priority
        sizes="(max-width: 500px) 100vw, 500px"
        className="object-cover"
      />

      <Image
        src="/game-assets/festival-banner.webp"
        alt="दशैं–तिहार अफर गेम"
        width={700}
        height={236}
        priority
        className="absolute left-[6%] top-[2.2%] z-10 w-[88%] max-w-none"
      />

      <Image
        src="/game-assets/20d-logo.webp"
        alt="20D Cinema"
        width={235}
        height={71}
        priority
        className="absolute left-[38%] top-[8.2%] z-20 w-[24%]"
      />

      <div className="absolute left-1/2 top-[15.8%] z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#7d1229]/90 px-3 py-1 text-[8px] font-bold text-[#ffe7a1]">
        {name ? `Good luck, ${name}!` : "Good luck!"}
      </div>

      <div className="absolute left-[14%] top-[25.5%] z-10 aspect-square w-[72%]">
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: rotation }}
          transition={{ duration: 5.75, ease: [0.12, 0.78, 0.18, 1] }}
          onUpdate={(latest) => {
            const degrees =
              typeof latest.rotate === "number"
                ? latest.rotate
                : rotationRef.current
            rotationRef.current = degrees
            const sector = Math.floor(normalize(degrees) / 45)
            if (sector !== lastTickRef.current) {
              lastTickRef.current = sector
              tick()
            }
          }}
          onAnimationComplete={() => {
            if (!pendingResult) return
            setSpinning(false)
            onResult(pendingResult)
            setPendingResult(null)
          }}
        >
          <Image
            src="/game-assets/wheel.webp"
            alt=""
            fill
            sizes="360px"
            className="object-contain"
          />

          {labels.map((label, index) => {
            if (!label) return null
            const angle = (index * Math.PI) / 4
            const left = 50 + Math.sin(angle) * 30
            const top = 50 - Math.cos(angle) * 30
            return (
              <div
                key={index}
                className="absolute w-[24%] -translate-x-1/2 -translate-y-1/2 text-center text-[clamp(9px,2.6vw,13px)] font-black leading-[1.05]"
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <span
                  className={
                    index % 2
                      ? "text-[#fff8d7] [text-shadow:0_1px_3px_rgba(80,0,0,.8)]"
                      : "text-[#6d1709]"
                  }
                >
                  {label.top}
                  <br />
                  <span className="text-[.78em] tracking-[.08em]">
                    {label.bottom}
                  </span>
                </span>
              </div>
            )
          })}
        </motion.div>

        <Image
          src="/game-assets/hub.webp"
          alt=""
          width={178}
          height={178}
          className="absolute left-[36.3%] top-[36.3%] z-20 w-[27.4%]"
        />

        <Image
          src="/game-assets/pointer.webp"
          alt=""
          width={140}
          height={154}
          className="absolute left-[42.2%] top-[-8.5%] z-30 w-[15.6%] drop-shadow-[0_3px_3px_rgba(0,0,0,.35)]"
        />
      </div>

      <Image
        src="/game-assets/pedestal.webp"
        alt=""
        width={600}
        height={179}
        className="absolute left-[10%] top-[56.5%] z-10 w-[80%]"
      />

      <div className="absolute left-[8%] top-[67.2%] z-20 w-[84%] rounded-[18px] border-[3px] border-[#f0c447] bg-gradient-to-b from-[#b70b24] to-[#7a071b] px-[6%] pb-[2.5%] pt-[3%] shadow-[inset_0_0_0_2px_rgba(255,210,100,.35),0_8px_20px_rgba(50,0,0,.28)]">
        <p className="text-center text-[8px] font-black uppercase tracking-[.16em] text-[#ffe9aa]">
          Ready to win?
        </p>

        <motion.button
          type="button"
          disabled={spinning || Boolean(countdown)}
          onClick={() => void handleSpin()}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: spinning ? 1 : 1.02 }}
          className="relative mx-auto mt-[2%] block w-[68%] overflow-hidden rounded-full disabled:opacity-75"
        >
          <Image
            src="/game-assets/spin-button.webp"
            alt=""
            width={500}
            height={127}
            className="block w-full"
          />
          <span className="absolute inset-0 flex items-center justify-center text-[clamp(13px,4vw,22px)] font-black uppercase text-[#76100d]">
            {spinning ? "Spinning..." : "Spin & Win"}
          </span>
        </motion.button>

        <p className="mt-[2%] text-center text-[7px] text-[#ffe9b0]/70">
          One spin per phone number · Terms apply
        </p>
      </div>

      <div className="absolute bottom-[1.8%] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-[7px] font-bold tracking-[.06em] text-[#ffe6a0]/85">
        20D CINEMA · KATHMANDU
      </div>

      <AnimatePresence>
        {countdown ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#26020c]/30 backdrop-blur-[1px]"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-black text-[76px] text-[#fff0a6] [text-shadow:0_4px_0_#7c2600,0_8px_30px_rgba(0,0,0,.45)]"
            >
              {countdown}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

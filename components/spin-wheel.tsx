"use client"

import { AnimatePresence, motion } from "motion/react"
import { AlertCircle, LoaderCircle, RotateCcw, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"

const prizes = [
  { key: "free_ticket", label: "FREE TICKET", shortTop: "FREE", shortBottom: "TICKET" },
  { key: "fifty_percent", label: "50% OFF", shortTop: "50%", shortBottom: "OFF" },
  { key: "rs_100_off", label: "Rs. 100 OFF", shortTop: "Rs.100", shortBottom: "OFF" },
  { key: "rs_50_off", label: "Rs. 50 OFF", shortTop: "Rs.50", shortBottom: "OFF" },
  { key: "twenty_percent", label: "20% OFF", shortTop: "20%", shortBottom: "OFF" },
  { key: "spin_again", label: "SPIN AGAIN", shortTop: "SPIN", shortBottom: "AGAIN" },
] as const

type PrizeKey = (typeof prizes)[number]["key"]

type SpinResponse = {
  ok: boolean
  code?: string
  message?: string
  spin_again?: boolean
  prize_key?: PrizeKey
  label?: string
  prize_code?: string
  attempt?: number
}

const confetti = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: (index * 37) % 100,
  delay: (index % 7) * 0.07,
  rotate: (index * 47) % 360,
  drift: ((index % 5) - 2) * 18,
  size: 5 + (index % 4) * 2,
}))

export function SpinWheel() {
  const router = useRouter()
  const [rotation, setRotation] = useState(0)
  const [isRequesting, setIsRequesting] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [pendingIndex, setPendingIndex] = useState<number | null>(null)
  const [pendingPrizeCode, setPendingPrizeCode] = useState("")
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [prizeCode, setPrizeCode] = useState("")
  const [errorState, setErrorState] = useState<{
    message: string
    terminal: boolean
  } | null>(null)

  const selectedPrize =
    selectedIndex === null ? null : prizes[selectedIndex]

  const segmentAngles = useMemo(
    () => prizes.map((_, index) => index * 60),
    []
  )

  async function spin() {
    if (isRequesting || isSpinning || selectedIndex !== null) return

    const saved = sessionStorage.getItem("20d-spin-participant")

    if (!saved) {
      router.replace("/")
      return
    }

    let participant: { name?: string; phone?: string }

    try {
      participant = JSON.parse(saved)
    } catch {
      router.replace("/")
      return
    }

    if (!participant.name || !participant.phone) {
      router.replace("/")
      return
    }

    setIsRequesting(true)
    setErrorState(null)

    try {
      const response = await fetch("/api/spin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          name: participant.name,
          phone: participant.phone,
        }),
      })

      const result = (await response.json()) as SpinResponse

      if (!response.ok || !result.ok || !result.prize_key) {
        setErrorState({
          message: result.message ?? "We couldn't start your spin. Please try again.",
          terminal: result.code === "already_played",
        })
        return
      }

      const nextIndex = prizes.findIndex(
        (prize) => prize.key === result.prize_key
      )

      if (nextIndex < 0) {
        setErrorState({
          message: "We couldn't read the prize result. Please ask our staff.",
          terminal: false,
        })
        return
      }

      const currentModulo = ((rotation % 360) + 360) % 360
      const targetModulo = (360 - nextIndex * 60) % 360
      const alignmentDelta = (targetModulo - currentModulo + 360) % 360
      const nextRotation = rotation + 360 * 6 + alignmentDelta

      setSelectedIndex(null)
      setPrizeCode("")
      setPendingPrizeCode(result.prize_code ?? "")
      setPendingIndex(nextIndex)
      setIsSpinning(true)
      setRotation(nextRotation)

      if ("vibrate" in navigator) {
        navigator.vibrate?.(35)
      }
    } catch {
      setErrorState({
        message: "Connection problem. Please check the internet and try again.",
        terminal: false,
      })
    } finally {
      setIsRequesting(false)
    }
  }

  function finishSpin() {
    if (!isSpinning || pendingIndex === null) return

    setIsSpinning(false)
    setSelectedIndex(pendingIndex)
    setPendingIndex(null)
    setPrizeCode(pendingPrizeCode)
    setPendingPrizeCode("")

    if ("vibrate" in navigator) {
      navigator.vibrate?.([70, 45, 90])
    }
  }

  function spinAgain() {
    setSelectedIndex(null)
    setPrizeCode("")
  }

  function finishParticipant() {
    sessionStorage.removeItem("20d-spin-participant")
    router.push("/")
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative mt-7 w-[min(82vw,390px)] max-w-[390px]">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[7%] rounded-full bg-[#D6003C]/25 blur-3xl"
          animate={
            isSpinning
              ? { opacity: [0.24, 0.55, 0.24], scale: [0.96, 1.08, 0.96] }
              : { opacity: 0.24, scale: 1 }
          }
          transition={
            isSpinning
              ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.3 }
          }
        />

        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-[-13px] z-30 -translate-x-1/2"
          animate={isSpinning ? { y: [0, 5, 0] } : { y: 0 }}
          transition={
            isSpinning
              ? { duration: 0.18, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 }
          }
        >
          <div className="h-0 w-0 border-x-[15px] border-t-[26px] border-x-transparent border-t-[#F8F7F4] drop-shadow-[0_5px_10px_rgba(0,0,0,0.55)]" />
        </motion.div>

        <div className="relative aspect-square rounded-full border border-white/15 bg-[#120A0D] p-[10px] shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_0_6px_rgba(255,255,255,0.025)]">
          <motion.div
            className="relative h-full w-full overflow-hidden rounded-full border border-white/15"
            style={{
              background:
                "conic-gradient(from -30deg, #E00043 0deg 60deg, #241117 60deg 120deg, #A30031 120deg 180deg, #1A0D11 180deg 240deg, #760024 240deg 300deg, #2B1119 300deg 360deg)",
              willChange: "transform",
            }}
            animate={{ rotate: rotation }}
            transition={{
              duration: isSpinning ? 5.4 : 0,
              ease: [0.12, 0.82, 0.12, 1],
            }}
            onAnimationComplete={finishSpin}
          >
            {segmentAngles.map((angle) => (
              <div
                key={`divider-${angle}`}
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-1/2 w-px origin-top bg-white/25"
                style={{ transform: `translateX(-50%) rotate(${angle + 30}deg)` }}
              />
            ))}

            {segmentAngles.map((angle, index) => (
              <div
                key={prizes[index].key}
                className="absolute left-1/2 top-1/2 z-10 flex w-[74px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center text-white sm:w-[86px]"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(clamp(-142px, -31vw, -108px)) rotate(${-angle}deg)`,
                }}
              >
                <span className="font-heading text-[10px] font-semibold leading-tight tracking-[0.08em] drop-shadow-sm sm:text-xs">
                  {prizes[index].shortTop}
                </span>
                <span className="mt-0.5 text-[9px] font-semibold tracking-[0.14em] text-white/70 sm:text-[10px]">
                  {prizes[index].shortBottom}
                </span>
              </div>
            ))}

            <div
              aria-hidden="true"
              className="absolute inset-[17%] rounded-full border border-white/10"
            />
          </motion.div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex size-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#09060A] shadow-[0_10px_30px_rgba(0,0,0,0.5)] sm:size-20">
            <span className="font-heading text-[13px] font-semibold tracking-[0.12em] text-white">
              20D
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full max-w-sm">
        <Button
          type="button"
          onClick={spin}
          disabled={isRequesting || isSpinning || selectedIndex !== null}
          className="relative h-13 w-full overflow-hidden rounded-xl bg-[#D6003C] text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_36px_rgba(214,0,60,0.22)] hover:bg-[#BE0036] focus-visible:ring-[#D6003C]/30"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isRequesting ? "preparing" : isSpinning ? "spinning" : "spin"}
              className="inline-flex items-center gap-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.16 }}
            >
              {isRequesting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Preparing
                </>
              ) : isSpinning ? (
                <>
                  <RotateCcw className="size-4 animate-spin" />
                  Spinning
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Spin
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </Button>

        <p className="mt-3 text-center text-[11px] tracking-wide text-white/25">
          One spin per phone number · Terms apply
        </p>
      </div>

      <AnimatePresence>
        {selectedPrize ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {selectedIndex !== 5
              ? confetti.map((piece) => (
                  <motion.span
                    key={piece.id}
                    aria-hidden="true"
                    className="pointer-events-none absolute top-[-16px] rounded-[2px]"
                    style={{
                      left: `${piece.left}%`,
                      width: piece.size,
                      height: piece.size * 1.8,
                      background:
                        piece.id % 3 === 0
                          ? "#FFFFFF"
                          : piece.id % 3 === 1
                            ? "#D6003C"
                            : "#FF7A9E",
                    }}
                    initial={{
                      y: -20,
                      x: 0,
                      opacity: 0,
                      rotate: piece.rotate,
                    }}
                    animate={{
                      y: "105vh",
                      x: piece.drift,
                      opacity: [0, 1, 1, 0],
                      rotate: piece.rotate + 420,
                    }}
                    transition={{
                      duration: 2.4 + (piece.id % 5) * 0.12,
                      delay: piece.delay,
                      ease: "easeOut",
                    }}
                  />
                ))
              : null}

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="prize-title"
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#100A0C] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.65)]"
              initial={{ opacity: 0, y: 42, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-40 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D6003C]/25 blur-3xl"
              />

              <div className="relative text-center">
                <motion.div
                  className="mx-auto flex size-14 items-center justify-center rounded-full border border-[#D6003C]/30 bg-[#D6003C]/10"
                  initial={{ scale: 0.4, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.08, type: "spring", stiffness: 330 }}
                >
                  <Sparkles className="size-6 text-[#FF3B70]" />
                </motion.div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
                  {selectedIndex === 5 ? "Lucky you" : "Congratulations"}
                </p>
                <h2
                  id="prize-title"
                  className="mt-2 font-heading text-3xl font-semibold tracking-[0.04em] text-white"
                >
                  {selectedPrize.label}
                </h2>

                {selectedIndex === 5 ? (
                  <p className="mx-auto mt-3 max-w-[260px] text-sm leading-6 text-white/45">
                    You earned another chance. Give the wheel one more spin.
                  </p>
                ) : (
                  <>
                    <p className="mt-3 text-sm text-white/45">
                      Show this result at the 20D Cinema counter.
                    </p>

                    <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/[0.035] px-4 py-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                        Prize code
                      </p>
                      <p className="mt-1.5 font-heading text-lg font-semibold tracking-[0.12em] text-white">
                        {prizeCode}
                      </p>
                    </div>
                  </>
                )}

                <Button
                  type="button"
                  onClick={selectedIndex === 5 ? spinAgain : finishParticipant}
                  className="mt-6 h-12 w-full rounded-xl bg-[#D6003C] text-sm font-semibold text-white hover:bg-[#BE0036]"
                >
                  {selectedIndex === 5 ? "Spin Again" : "Done"}
                </Button>

                {selectedIndex !== 5 ? (
                  <p className="mt-3 text-[11px] text-white/25">
                    Keep this screen visible until staff confirms your prize.
                  </p>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}

        {errorState ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="alertdialog"
              aria-modal="true"
              className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#100A0C] p-6 text-center shadow-[0_30px_100px_rgba(0,0,0,0.65)]"
              initial={{ opacity: 0, y: 36, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
            >
              <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <AlertCircle className="size-6 text-white/70" />
              </div>
              <h2 className="mt-5 font-heading text-xl font-semibold uppercase tracking-[0.06em]">
                {errorState.terminal ? "Already Played" : "Try Again"}
              </h2>
              <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-white/45">
                {errorState.message}
              </p>

              <Button
                type="button"
                onClick={
                  errorState.terminal
                    ? finishParticipant
                    : () => setErrorState(null)
                }
                className="mt-6 h-12 w-full rounded-xl bg-[#D6003C] text-white hover:bg-[#BE0036]"
              >
                {errorState.terminal ? "Done" : "Try Again"}
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Clipboard, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  PhaserSpinGame,
  type PhaserSpinResult,
} from "@/components/phaser-spin-game"
import { Button } from "@/components/ui/button"

const labels: Record<string, string> = {
  free_ticket: "FREE TICKET",
  fifty_percent: "50% OFF",
  rs_100_off: "Rs. 100 OFF",
  rs_50_off: "Rs. 50 OFF",
  twenty_percent: "20% OFF",
  spin_again: "SPIN AGAIN",
}

export default function SpinPage() {
  const router = useRouter()
  const [result, setResult] = useState<PhaserSpinResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resetSignal, setResetSignal] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleResult = useCallback((next: PhaserSpinResult) => {
    setResult(next)
  }, [])

  const handleError = useCallback((message: string) => {
    setError(message)
  }, [])

  function done() {
    sessionStorage.removeItem("20d-spin-participant")
    router.push("/")
  }

  async function copyCode() {
    if (!result?.prize_code) return

    try {
      await navigator.clipboard.writeText(result.prize_code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {}
  }

  return (
    <main className="min-h-svh bg-[#080407] px-3 py-4 text-white sm:px-5 sm:py-6">
      <div className="mx-auto flex w-full max-w-[470px] flex-col">
        <header className="mb-3 flex items-center justify-between px-1">
          <Link
            href="/"
            aria-label="Back"
            className="inline-flex size-9 items-center justify-center rounded-full border border-[#f0c95a]/25 bg-[#140a0e] text-white/70 transition hover:border-[#f0c95a]/55 hover:text-white"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div className="text-center">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#f3d47a]">
              20D Cinema
            </p>
            <p className="mt-0.5 text-[10px] text-white/40">
              Dashain · Spin & Win
            </p>
          </div>

          <div className="size-9" />
        </header>

        <PhaserSpinGame
          resetSignal={resetSignal}
          onResult={handleResult}
          onError={handleError}
        />

        <p className="mt-3 text-center text-[10px] text-white/35">
          KL Tower · Chuchepati, Kathmandu · One spin per phone number
        </p>
      </div>

      {result ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-sm overflow-hidden rounded-[28px] border border-[#f0c95a]/35 bg-[#140a0e] p-6 text-center shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-[#f0c95a]/25 bg-[#f0c95a]/10 text-[#ffd85f]">
              <Sparkles className="size-6" />
            </div>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#f3d47a]">
              {result.prize_key === "spin_again" ? "Lucky you" : "Congratulations"}
            </p>

            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-[#ffd85f]">
              {result.label ?? labels[result.prize_key]}
            </h2>

            {result.prize_key === "spin_again" ? (
              <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-white/55">
                You earned another chance. Spin the wheel again.
              </p>
            ) : (
              <>
                <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-white/55">
                  Show this prize code at the 20D Cinema counter.
                </p>

                <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/[0.035] p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/40">
                    Your prize code
                  </p>
                  <p className="mt-2 font-mono text-lg font-bold tracking-[0.12em] text-white">
                    {result.prize_code}
                  </p>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => void copyCode()}
                    className="mt-2 h-8 w-full text-xs text-white/55 hover:bg-white/10 hover:text-white"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Clipboard className="size-3.5" />
                        Copy code
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            <Button
              type="button"
              onClick={() => {
                if (result.prize_key === "spin_again") {
                  setResult(null)
                  setCopied(false)
                  setResetSignal((value) => value + 1)
                  return
                }

                done()
              }}
              className="mt-5 h-12 w-full rounded-xl bg-[#d6003c] font-semibold text-white hover:bg-[#be0036]"
            >
              {result.prize_key === "spin_again" ? "Spin Again" : "Done"}
            </Button>

            {result.prize_key !== "spin_again" ? (
              <p className="mt-3 text-[10px] leading-5 text-white/35">
                Keep this screen visible until our staff confirms your prize.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-sm rounded-[28px] border border-[#f0c95a]/25 bg-[#140a0e] p-6 text-center shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#d6003c]/15 text-[#ff6a91]">
              <Sparkles className="size-5" />
            </div>
            <h2 className="mt-4 text-xl font-bold">Unable to spin</h2>
            <p className="mt-3 text-sm leading-6 text-white/55">{error}</p>
            <Button
              type="button"
              onClick={() => setError(null)}
              className="mt-5 h-11 w-full rounded-xl bg-[#d6003c] text-white hover:bg-[#be0036]"
            >
              Try Again
            </Button>
          </div>
        </div>
      ) : null}
    </main>
  )
}

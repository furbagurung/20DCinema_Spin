"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function SpinPage() {
  const [name, setName] = useState("")

  useEffect(() => {
    const saved = sessionStorage.getItem("20d-spin-participant")

    if (!saved) return

    try {
      const participant = JSON.parse(saved) as { name?: string }
      setName(participant.name ?? "")
    } catch {
      setName("")
    }
  }, [])

  return (
    <main className="flex min-h-svh items-center justify-center bg-[#09060A] px-5 text-[#F8F7F4]">
      <section className="w-full max-w-sm text-center">
        <Image
          src="/logo/White Reversed 20D Cinema Secondary Logo.png"
          alt="20D Cinema"
          width={220}
          height={90}
          priority
          className="mx-auto h-auto w-36"
        />

        <p className="mt-10 text-sm text-white/45">
          {name ? `Ready, ${name}?` : "Ready to spin?"}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold uppercase tracking-[0.08em]">
          Spin Wheel
        </h1>
        <p className="mt-3 text-sm text-white/35">
          Wheel experience comes next.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex text-sm text-white/50 underline underline-offset-4 transition hover:text-white"
        >
          Back
        </Link>
      </section>
    </main>
  )
}

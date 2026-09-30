import Image from "next/image"

import { ParticipantForm } from "@/components/participant-form"

export default function Home() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#09060A] px-5 py-10 text-[#F8F7F4]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[42%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5A0B1B]/20 blur-3xl"
      />

      <section className="relative z-10 w-full max-w-sm">
        <div className="flex justify-center">
          <Image
            src="/logo/White Reversed 20D Cinema Secondary Logo.png"
            alt="20D Cinema"
            width={220}
            height={90}
            priority
            className="h-auto w-36 sm:w-40"
          />
        </div>

        <div className="mt-9 text-center">
          <h1 className="font-heading text-3xl font-semibold uppercase tracking-[0.08em] sm:text-4xl">
            Spin & Win
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/45">
            Enter your details to spin the wheel.
          </p>
        </div>

        <ParticipantForm />
      </section>
    </main>
  )
}

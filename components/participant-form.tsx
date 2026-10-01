"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const participantSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  phone: z
    .string()
    .trim()
    .regex(/^9[78]\d{8}$/, "Enter a valid Nepal mobile number."),
})

type FormErrors = {
  name?: string
  phone?: string
}

export function ParticipantForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = participantSchema.safeParse({ name, phone })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({
        name: fieldErrors.name?.[0],
        phone: fieldErrors.phone?.[0],
      })
      return
    }

    sessionStorage.setItem(
      "20d-spin-participant",
      JSON.stringify(result.data)
    )

    router.push("/spin")
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3" noValidate>
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-[9px] font-bold uppercase tracking-[0.14em] text-[#FFE9A2]/80"
        >
          Name
        </label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Your name / तपाईंको नाम"
          value={name}
          aria-invalid={Boolean(errors.name)}
          onChange={(event) => {
            setName(event.target.value)
            if (errors.name) {
              setErrors((current) => ({ ...current, name: undefined }))
            }
          }}
          className="h-10 rounded-xl border-[#F1D17A]/45 bg-[#FFF4D8] px-3.5 text-[#4A101C] placeholder:text-[#8B6E63] shadow-inner hover:border-[#FFE08A] focus-visible:border-[#FFE08A] focus-visible:ring-[#FFE08A]/25"
        />
        {errors.name ? (
          <p className="text-xs text-destructive">{errors.name}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
        >
          Phone number
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          placeholder="98XXXXXXXX"
          value={phone}
          aria-invalid={Boolean(errors.phone)}
          onChange={(event) => {
            const value = event.target.value.replace(/\D/g, "").slice(0, 10)
            setPhone(value)
            if (errors.phone) {
              setErrors((current) => ({ ...current, phone: undefined }))
            }
          }}
          className="h-10 rounded-xl border-[#F1D17A]/45 bg-[#FFF4D8] px-3.5 text-[#4A101C] placeholder:text-[#8B6E63] shadow-inner hover:border-[#FFE08A] focus-visible:border-[#FFE08A] focus-visible:ring-[#FFE08A]/25"
        />
        {errors.phone ? (
          <p className="text-xs text-[#FF527D]">{errors.phone}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="group mt-2 h-11 w-full rounded-xl border border-[#FFE88A]/60 bg-gradient-to-b from-[#FFD95C] via-[#F6B51E] to-[#E68A12] text-sm font-extrabold tracking-wide text-[#6B1021] shadow-[0_8px_18px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.65)] hover:brightness-105 focus-visible:ring-[#FFE08A]/40"
      >
        Start
        <ArrowRight className="ml-1 size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Button>
    </form>
  )
}

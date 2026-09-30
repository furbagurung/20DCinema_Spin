"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const participantSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  phone: z
    .string()
    .trim()
    .regex(/^9\d{9}$/, "Enter a valid 10-digit phone number."),
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
    <form onSubmit={handleSubmit} className="mt-9 space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-white/70">
          Name
        </label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          aria-invalid={Boolean(errors.name)}
          onChange={(event) => {
            setName(event.target.value)
            if (errors.name) setErrors((current) => ({ ...current, name: undefined }))
          }}
          className="h-12 border-white/12 bg-white/[0.035] text-white placeholder:text-white/30 focus-visible:border-[#D6003C] focus-visible:ring-[#D6003C]/20"
        />
        {errors.name ? (
          <p className="text-xs text-[#FF3B66]">{errors.name}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-white/70">
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
            if (errors.phone) setErrors((current) => ({ ...current, phone: undefined }))
          }}
          className="h-12 border-white/12 bg-white/[0.035] text-white placeholder:text-white/30 focus-visible:border-[#D6003C] focus-visible:ring-[#D6003C]/20"
        />
        {errors.phone ? (
          <p className="text-xs text-[#FF3B66]">{errors.phone}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="mt-2 h-12 w-full rounded-lg bg-[#D6003C] text-sm font-semibold text-white hover:bg-[#bd0036] focus-visible:ring-[#D6003C]/30"
      >
        Start
      </Button>
    </form>
  )
}

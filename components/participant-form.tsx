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
    <form onSubmit={handleSubmit} className="mt-9 space-y-5" noValidate>
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
        >
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
            if (errors.name) {
              setErrors((current) => ({ ...current, name: undefined }))
            }
          }}
          className="h-12 rounded-xl border-input bg-surface px-4 text-foreground placeholder:text-muted-foreground hover:border-input focus-visible:border-[#D6003C] focus-visible:ring-[#D6003C]/15"
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
          className="h-12 rounded-xl border-input bg-surface px-4 text-foreground placeholder:text-muted-foreground hover:border-input focus-visible:border-[#D6003C] focus-visible:ring-[#D6003C]/15"
        />
        {errors.phone ? (
          <p className="text-xs text-[#FF527D]">{errors.phone}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="group mt-2 h-12 w-full rounded-xl bg-[#D6003C] text-sm font-semibold text-white shadow-[0_12px_36px_rgba(214,0,60,0.2)] hover:bg-[#BE0036] focus-visible:ring-[#D6003C]/30"
      >
        Start
        <ArrowRight className="ml-1 size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Button>
    </form>
  )
}

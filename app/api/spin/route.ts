import { z } from "zod"

import { createSupabaseAdmin } from "@/lib/supabase-admin"

const spinSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^9[78]\d{8}$/),
})

function getStatus(code?: string) {
  if (code === "already_played") return 409
  if (code === "invalid_name" || code === "invalid_phone") return 400
  if (code === "no_prize_available") return 503
  return 400
}

export async function POST(request: Request) {
  const url = process.env.SUPABASE_URL
  if (!url || !process.env.SUPABASE_SECRET_KEY) {
    return Response.json(
      {
        ok: false,
        code: "server_not_configured",
        message: "Spin service is not configured yet.",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    )
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json(
      {
        ok: false,
        code: "invalid_request",
        message: "Invalid request.",
      },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      }
    )
  }

  const parsed = spinSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      {
        ok: false,
        code: "invalid_details",
        message: "Please check your name and phone number.",
      },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      }
    )
  }

  let supabase

  try {
    supabase = createSupabaseAdmin()
  } catch {
    return Response.json(
      {
        ok: false,
        code: "server_not_configured",
        message: "Spin service is not configured yet.",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    )
  }

  const { data, error } = await supabase.rpc("perform_spin", {
    p_name: parsed.data.name,
    p_phone: parsed.data.phone,
  })

  if (error) {
    console.error("perform_spin failed", error)

    return Response.json(
      {
        ok: false,
        code: "spin_failed",
        message: "We couldn't start your spin. Please try again.",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    )
  }

  const result = data as {
    ok?: boolean
    code?: string
    message?: string
    spin_again?: boolean
    prize_key?: string
    label?: string
    prize_code?: string
    attempt?: number
  } | null

  if (!result?.ok) {
    return Response.json(result ?? {
      ok: false,
      code: "spin_failed",
      message: "We couldn't start your spin. Please try again.",
    }, {
      status: getStatus(result?.code),
      headers: { "Cache-Control": "no-store" },
    })
  }

  return Response.json(result, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  })
}

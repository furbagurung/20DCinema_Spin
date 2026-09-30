import { z } from "zod"

import { isAdminRequest } from "@/lib/admin-request"
import { createSupabaseAdmin } from "@/lib/supabase-admin"

const prizeSchema = z.object({
  key: z.string().min(1).max(80),
  weight: z.number().int().min(1).max(1000),
  daily_limit: z.number().int().min(1).max(10000).nullable(),
  is_active: z.boolean(),
})

export async function PATCH(request: Request) {
  if (!(await isAdminRequest())) {
    return Response.json(
      { ok: false, message: "Unauthorized." },
      { status: 401 }
    )
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json(
      { ok: false, message: "Invalid request." },
      { status: 400 }
    )
  }

  const parsed = prizeSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      { ok: false, message: "Invalid prize settings." },
      { status: 400 }
    )
  }

  const supabase = createSupabaseAdmin()

  if (!parsed.data.is_active) {
    const [{ data: current }, { count: activeCount }] = await Promise.all([
      supabase
        .from("prizes")
        .select("is_active")
        .eq("key", parsed.data.key)
        .maybeSingle(),
      supabase
        .from("prizes")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
    ])

    if (current?.is_active && (activeCount ?? 0) <= 1) {
      return Response.json(
        { ok: false, message: "At least one prize must remain active." },
        { status: 400 }
      )
    }
  }

  const { data, error } = await supabase
    .from("prizes")
    .update({
      weight: parsed.data.weight,
      daily_limit: parsed.data.daily_limit,
      is_active: parsed.data.is_active,
    })
    .eq("key", parsed.data.key)
    .select(
      "key,label,weight,daily_limit,is_active,is_spin_again,sort_order"
    )
    .maybeSingle()

  if (error) {
    console.error("Prize settings update failed", error)

    return Response.json(
      { ok: false, message: "Could not update prize settings." },
      { status: 500 }
    )
  }

  if (!data) {
    return Response.json(
      { ok: false, message: "Prize not found." },
      { status: 404 }
    )
  }

  return Response.json({ ok: true, prize: data })
}

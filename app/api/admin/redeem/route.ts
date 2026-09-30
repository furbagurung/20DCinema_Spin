import { z } from "zod"

import { isAdminRequest } from "@/lib/admin-request"
import { createSupabaseAdmin } from "@/lib/supabase-admin"

const redeemSchema = z.object({
  code: z.string().trim().min(4).max(40),
})

export async function POST(request: Request) {
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

  const parsed = redeemSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      { ok: false, message: "Enter a valid prize code." },
      { status: 400 }
    )
  }

  const code = parsed.data.code.toUpperCase()
  const supabase = createSupabaseAdmin()

  const { data: session, error } = await supabase
    .from("spin_sessions")
    .select(
      "id,prize_code,redeemed_at,status,participant:participants(name,phone),prize:prizes(label,key)"
    )
    .eq("prize_code", code)
    .maybeSingle()

  if (error) {
    console.error("Prize lookup failed", error)

    return Response.json(
      { ok: false, message: "Could not verify this prize." },
      { status: 500 }
    )
  }

  if (!session || session.status !== "completed") {
    return Response.json(
      { ok: false, message: "Prize code not found." },
      { status: 404 }
    )
  }

  if (session.redeemed_at) {
    return Response.json(
      {
        ok: false,
        code: "already_redeemed",
        message: "This prize has already been redeemed.",
        redeemed_at: session.redeemed_at,
      },
      { status: 409 }
    )
  }

  const redeemedAt = new Date().toISOString()

  const { data: updated, error: updateError } = await supabase
    .from("spin_sessions")
    .update({ redeemed_at: redeemedAt })
    .eq("id", session.id)
    .is("redeemed_at", null)
    .select("redeemed_at")
    .maybeSingle()

  if (updateError) {
    console.error("Prize redemption failed", updateError)

    return Response.json(
      { ok: false, message: "Could not redeem this prize." },
      { status: 500 }
    )
  }

  if (!updated) {
    return Response.json(
      {
        ok: false,
        code: "already_redeemed",
        message: "This prize has already been redeemed.",
      },
      { status: 409 }
    )
  }

  const participant = Array.isArray(session.participant)
    ? session.participant[0]
    : session.participant
  const prize = Array.isArray(session.prize) ? session.prize[0] : session.prize

  return Response.json({
    ok: true,
    message: "Prize redeemed successfully.",
    prize_code: session.prize_code,
    redeemed_at: updated.redeemed_at,
    name: participant?.name ?? "",
    phone: participant?.phone ?? "",
    prize_label: prize?.label ?? "",
  })
}

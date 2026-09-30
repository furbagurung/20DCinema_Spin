import { isAdminRequest } from "@/lib/admin-request"
import { createSupabaseAdmin } from "@/lib/supabase-admin"

type RelatedParticipant = {
  name: string
  phone: string
}

type RelatedPrize = {
  key: string
  label: string
}

type SessionRow = {
  id: string
  status: string
  attempts: number
  final_prize_id: number | null
  prize_code: string | null
  redeemed_at: string | null
  created_at: string
  completed_at: string | null
  participant: RelatedParticipant | RelatedParticipant[] | null
  prize: RelatedPrize | RelatedPrize[] | null
}

function firstRelation<T>(value: T | T[] | null) {
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

function kathmanduDayRange() {
  const offsetMs = (5 * 60 + 45) * 60 * 1000
  const now = new Date()
  const kathmanduNow = new Date(now.getTime() + offsetMs)

  const year = kathmanduNow.getUTCFullYear()
  const month = kathmanduNow.getUTCMonth()
  const day = kathmanduNow.getUTCDate()

  const start = new Date(Date.UTC(year, month, day) - offsetMs)
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  }
}

export async function GET(request: Request) {
  if (!(await isAdminRequest())) {
    return Response.json(
      { ok: false, message: "Unauthorized." },
      { status: 401 }
    )
  }

  const url = new URL(request.url)
  const search = (url.searchParams.get("search") ?? "").trim().toLowerCase()
  const supabase = createSupabaseAdmin()
  const dayRange = kathmanduDayRange()

  const [
    participantsResult,
    completedResult,
    redeemedResult,
    unredeemedResult,
    todayResult,
    prizesResult,
    entriesResult,
  ] = await Promise.all([
    supabase.from("participants").select("id", { count: "exact", head: true }),
    supabase
      .from("spin_sessions")
      .select("id", { count: "exact", head: true })
      .eq("status", "completed"),
    supabase
      .from("spin_sessions")
      .select("id", { count: "exact", head: true })
      .not("redeemed_at", "is", null),
    supabase
      .from("spin_sessions")
      .select("id", { count: "exact", head: true })
      .eq("status", "completed")
      .is("redeemed_at", null),
    supabase
      .from("spin_sessions")
      .select("id", { count: "exact", head: true })
      .eq("status", "completed")
      .gte("completed_at", dayRange.start)
      .lt("completed_at", dayRange.end),
    supabase
      .from("prizes")
      .select(
        "id,key,label,weight,daily_limit,is_active,is_spin_again,sort_order"
      )
      .order("sort_order", { ascending: true }),
    supabase
      .from("spin_sessions")
      .select(
        "id,status,attempts,final_prize_id,prize_code,redeemed_at,created_at,completed_at,participant:participants(name,phone),prize:prizes(key,label)"
      )
      .order("created_at", { ascending: false })
      .limit(500),
  ])

  const errors = [
    participantsResult.error,
    completedResult.error,
    redeemedResult.error,
    unredeemedResult.error,
    todayResult.error,
    prizesResult.error,
    entriesResult.error,
  ].filter(Boolean)

  if (errors.length > 0) {
    console.error("Admin dashboard query failed", errors)

    return Response.json(
      { ok: false, message: "Could not load dashboard data." },
      { status: 500 }
    )
  }

  const prizeRows = prizesResult.data ?? []

  const prizes = await Promise.all(
    prizeRows.map(async (prize) => {
      const [wonResult, prizeRedeemedResult] = await Promise.all([
        supabase
          .from("spin_sessions")
          .select("id", { count: "exact", head: true })
          .eq("status", "completed")
          .eq("final_prize_id", prize.id),
        supabase
          .from("spin_sessions")
          .select("id", { count: "exact", head: true })
          .eq("status", "completed")
          .eq("final_prize_id", prize.id)
          .not("redeemed_at", "is", null),
      ])

      return {
        key: prize.key,
        label: prize.label,
        weight: prize.weight,
        daily_limit: prize.daily_limit,
        is_active: prize.is_active,
        is_spin_again: prize.is_spin_again,
        sort_order: prize.sort_order,
        won: wonResult.count ?? 0,
        redeemed: prizeRedeemedResult.count ?? 0,
      }
    })
  )

  const rows = (entriesResult.data ?? []) as unknown as SessionRow[]

  const entries = rows
    .map((row) => {
      const participant = firstRelation(row.participant)
      const prize = firstRelation(row.prize)

      return {
        session_id: row.id,
        name: participant?.name ?? "Unknown",
        phone: participant?.phone ?? "",
        status: row.status,
        attempts: row.attempts,
        prize_label: prize?.label ?? null,
        prize_key: prize?.key ?? null,
        prize_code: row.prize_code,
        created_at: row.created_at,
        completed_at: row.completed_at,
        redeemed_at: row.redeemed_at,
      }
    })
    .filter((row) => {
      if (!search) return true

      return [
        row.name,
        row.phone,
        row.prize_label ?? "",
        row.prize_code ?? "",
      ].some((value) => value.toLowerCase().includes(search))
    })
    .slice(0, 100)

  return Response.json(
    {
      ok: true,
      metrics: {
        participants: participantsResult.count ?? 0,
        completed_spins: completedResult.count ?? 0,
        redeemed: redeemedResult.count ?? 0,
        unredeemed: unredeemedResult.count ?? 0,
        today_spins: todayResult.count ?? 0,
      },
      prizes,
      entries,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  )
}

import { cookies } from "next/headers"
import { z } from "zod"

import {
  ADMIN_COOKIE_NAME,
  adminAuthConfigured,
  createAdminSessionValue,
  verifyAdminPassword,
} from "@/lib/admin-auth"

const loginSchema = z.object({
  password: z.string().min(1).max(200),
})

export async function POST(request: Request) {
  if (!adminAuthConfigured()) {
    return Response.json(
      {
        ok: false,
        message: "Admin access is not configured yet.",
      },
      { status: 503 }
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

  const parsed = loginSchema.safeParse(body)

  if (!parsed.success || !verifyAdminPassword(parsed.data.password)) {
    await new Promise((resolve) => setTimeout(resolve, 450))

    return Response.json(
      { ok: false, message: "Incorrect password." },
      { status: 401 }
    )
  }

  const cookieStore = await cookies()

  cookieStore.set({
    name: ADMIN_COOKIE_NAME,
    value: createAdminSessionValue(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 12 * 60 * 60,
  })

  return Response.json({ ok: true })
}

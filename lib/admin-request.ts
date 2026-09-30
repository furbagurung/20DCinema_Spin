import { cookies } from "next/headers"

import {
  ADMIN_COOKIE_NAME,
  verifyAdminSessionValue,
} from "@/lib/admin-auth"

export async function isAdminRequest() {
  const cookieStore = await cookies()
  const value = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  return verifyAdminSessionValue(value)
}

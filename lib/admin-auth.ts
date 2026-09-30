import { createHmac, timingSafeEqual } from "node:crypto"

export const ADMIN_COOKIE_NAME = "20d_admin_session"

const SESSION_DURATION_MS = 12 * 60 * 60 * 1000

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) return false

  return timingSafeEqual(leftBuffer, rightBuffer)
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? ""
}

function signatureFor(expiresAt: string) {
  const secret = getSessionSecret()

  if (secret.length < 24) return ""

  return createHmac("sha256", secret)
    .update(`20d-admin:${expiresAt}`)
    .digest("hex")
}

export function adminAuthConfigured() {
  return Boolean(
    process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_PASSWORD.length >= 10 &&
      getSessionSecret().length >= 24
  )
}

export function verifyAdminPassword(candidate: string) {
  const password = process.env.ADMIN_PASSWORD ?? ""

  if (!adminAuthConfigured()) return false

  return safeEqual(candidate, password)
}

export function createAdminSessionValue() {
  const expiresAt = String(Date.now() + SESSION_DURATION_MS)
  const signature = signatureFor(expiresAt)

  return `${expiresAt}.${signature}`
}

export function verifyAdminSessionValue(value?: string) {
  if (!value || !adminAuthConfigured()) return false

  const [expiresAt, signature] = value.split(".")

  if (!expiresAt || !signature) return false

  const expiresAtNumber = Number(expiresAt)

  if (!Number.isFinite(expiresAtNumber) || expiresAtNumber <= Date.now()) {
    return false
  }

  const expected = signatureFor(expiresAt)

  return Boolean(expected) && safeEqual(signature, expected)
}

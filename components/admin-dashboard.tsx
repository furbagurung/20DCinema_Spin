"use client"

import Image from "next/image"
import {
  BarChart3,
  CheckCircle2,
  Gift,
  LoaderCircle,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  TicketCheck,
  TrendingUp,
  Users,
} from "lucide-react"
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"

import { AdminSidebar } from "@/components/admin-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"

type Metrics = {
  participants: number
  completed_spins: number
  redeemed: number
  unredeemed: number
  today_spins: number
}

type Prize = {
  key: string
  label: string
  weight: number
  daily_limit: number | null
  is_active: boolean
  is_spin_again: boolean
  won: number
  redeemed: number
}

type Entry = {
  session_id: string
  name: string
  phone: string
  status: string
  prize_label: string | null
  prize_code: string | null
  created_at: string
  completed_at: string | null
  redeemed_at: string | null
}

type Data = {
  ok: true
  metrics: Metrics
  prizes: Prize[]
  entries: Entry[]
}

const moneyish = (value: number) => value.toLocaleString("en-IN")

const date = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-NP", {
        timeZone: "Asia/Kathmandu",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(value))
    : "—"

export function AdminDashboard() {
  const [ready, setReady] = useState(false)
  const [login, setLogin] = useState(false)
  const [password, setPassword] = useState("")
  const [data, setData] = useState<Data | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState("")
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")

  const load = useCallback(async (query = "") => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        "/api/admin/dashboard?search=" + encodeURIComponent(query),
        { cache: "no-store" },
      )

      if (response.status === 401) {
        setLogin(true)
        setData(null)
        setReady(true)
        return
      }

      const result = await response.json()

      if (!response.ok || !result.ok) {
        setError(result.message || "Could not load dashboard.")
        setReady(true)
        return
      }

      setData(result)
      setLogin(false)
      setReady(true)
    } catch {
      setError("Connection problem.")
      setReady(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function signIn(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const result = await response.json()

      if (!response.ok || !result.ok) {
        setError(result.message || "Incorrect password.")
        return
      }

      setPassword("")
      await load()
    } catch {
      setError("Connection problem.")
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" })
    setData(null)
    setLogin(true)
    setReady(false)
  }

  async function redeem(value = code) {
    const prizeCode = value.trim().toUpperCase()

    if (!prizeCode) {
      setError("Enter a prize code.")
      return
    }

    setLoading(true)
    setError("")
    setNotice("")

    try {
      const response = await fetch("/api/admin/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: prizeCode }),
      })

      const result = await response.json()

      if (!response.ok || !result.ok) {
        setError(result.message || "Could not redeem.")
        return
      }

      setCode("")
      setNotice(
        result.name && result.prize_label
          ? `Redeemed: ${result.name} · ${result.prize_label}`
          : "Prize redeemed successfully.",
      )

      await load(search)
    } catch {
      setError("Connection problem.")
    } finally {
      setLoading(false)
    }
  }

  const totalWeight = useMemo(
    () =>
      data?.prizes
        .filter((prize) => prize.is_active)
        .reduce((total, prize) => total + prize.weight, 0) || 0,
    [data],
  )

  if (!ready || login) {
    return (
      <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-5 text-foreground">
        <div className="absolute right-5 top-5">
          <ThemeToggle />
        </div>
        <div className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

        {login ? (
          <form
            onSubmit={signIn}
            className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl"
          >
            <div className="mx-auto w-fit rounded-2xl bg-[#100A0C] px-5 py-2">
              <Image
                src="/logo/White Reversed 20D Cinema Secondary Logo.png"
                alt="20D Cinema"
                width={220}
                height={90}
                className="h-auto w-32"
              />
            </div>

            <div className="mt-7 text-center">
              <ShieldCheck className="mx-auto size-6 text-muted-foreground" />
              <h1 className="mt-3 font-heading text-xl font-semibold uppercase tracking-[0.08em]">
                Spin Admin
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Secure campaign dashboard
              </p>
            </div>

            <Input
              autoFocus
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin password"
              className="mt-7 h-12 border-input bg-surface text-foreground placeholder:text-muted-foreground"
            />

            <p className="mt-2 min-h-4 text-xs text-destructive">{error}</p>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-xl bg-[#D6003C] text-white hover:bg-[#BE0036]"
            >
              {loading ? <LoaderCircle className="animate-spin" /> : <ShieldCheck />}
              Sign in
            </Button>
          </form>
        ) : (
          <LoaderCircle className="relative size-5 animate-spin text-muted-foreground" />
        )}
      </main>
    )
  }

  if (!data) return null

  const redemptionTotal = data.metrics.redeemed + data.metrics.unredeemed
  const redemptionRate =
    redemptionTotal > 0
      ? Math.round((data.metrics.redeemed / redemptionTotal) * 100)
      : 0

  const kpis = [
    {
      label: "Participants",
      value: data.metrics.participants,
      icon: Users,
      detail: "Total entries",
    },
    {
      label: "Spins today",
      value: data.metrics.today_spins,
      icon: Gift,
      detail: "Today's activity",
    },
    {
      label: "Total spins",
      value: data.metrics.completed_spins,
      icon: TicketCheck,
      detail: "Completed spins",
    },
    {
      label: "Pending",
      value: data.metrics.unredeemed,
      icon: TrendingUp,
      detail: "Awaiting redemption",
    },
    {
      label: "Redeemed",
      value: data.metrics.redeemed,
      icon: CheckCircle2,
      detail: "Rewards collected",
    },
  ] as const

  return (
    <SidebarProvider defaultOpen>
      <AdminSidebar onLogout={logout} />

      <SidebarInset>
        <div className="min-h-svh">
          <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-xl">
            <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
              <SidebarTrigger />

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  20D Cinema
                </p>
                <h1 className="truncate text-sm font-semibold sm:text-base">
                  Spin & Win Dashboard
                </h1>
              </div>

              <div className="ml-auto flex items-center gap-1.5">
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    void load(search)
                  }}
                  className="hidden w-64 md:block lg:w-80"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search name, phone or code"
                      className="h-9 border-input bg-surface pl-9 text-sm"
                    />
                  </div>
                </form>

                <ThemeToggle />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => void load(search)}
                  disabled={loading}
                  aria-label="Refresh dashboard"
                  title="Refresh"
                >
                  <RefreshCw className={loading ? "animate-spin" : ""} />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => void logout()}
                  aria-label="Log out"
                  title="Log out"
                  className="hidden sm:inline-flex"
                >
                  <LogOut />
                </Button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] space-y-8 p-4 sm:p-6 lg:p-8">
            {(error || notice) && (
              <div className="space-y-2">
                {error ? (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                ) : null}
                {notice ? (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700">
                    {notice}
                  </div>
                ) : null}
              </div>
            )}

            <section id="overview" className="scroll-mt-24 space-y-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-xl font-semibold tracking-tight">
                      Overview
                    </h2>
                    <Badge variant="success">Live</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Monitor campaign activity, rewards and redemptions.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {data.entries.length} latest records loaded
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {kpis.map((kpi) => (
                  <Card key={kpi.label}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <kpi.icon className="size-4" />
                        </span>
                        <BarChart3 className="size-4 text-muted-foreground/40" />
                      </div>
                      <p className="mt-5 font-heading text-2xl font-semibold tabular-nums">
                        {moneyish(kpi.value)}
                      </p>
                      <p className="mt-1 text-xs font-medium">{kpi.label}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {kpi.detail}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Redemption overview</CardTitle>
                    <CardDescription>
                      Current reward collection progress across completed spins.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="font-heading text-4xl font-semibold tabular-nums">
                          {redemptionRate}%
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {moneyish(data.metrics.redeemed)} of{" "}
                          {moneyish(redemptionTotal)} rewards redeemed
                        </p>
                      </div>
                      <Badge variant={redemptionRate >= 50 ? "success" : "warning"}>
                        {data.metrics.unredeemed} pending
                      </Badge>
                    </div>
                    <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${redemptionRate}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prize performance</CardTitle>
                    <CardDescription>Wins by prize type.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.prizes.slice(0, 5).map((prize) => {
                      const maxWon = Math.max(
                        1,
                        ...data.prizes.map((item) => item.won),
                      )
                      const width = Math.max(4, (prize.won / maxWon) * 100)

                      return (
                        <div key={prize.key}>
                          <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                            <span className="truncate font-medium">{prize.label}</span>
                            <span className="shrink-0 tabular-nums text-muted-foreground">
                              {prize.won}
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary/75"
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>Quick redeem</CardTitle>
                      <CardDescription>
                        Verify a winner's prize code at the counter.
                      </CardDescription>
                    </div>
                    <Badge variant="outline">Counter action</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={code}
                      onChange={(event) =>
                        setCode(event.target.value.toUpperCase())
                      }
                      placeholder="20D-XXXXXXXX"
                      className="h-11 border-input bg-surface font-heading uppercase"
                    />
                    <Button
                      onClick={() => void redeem()}
                      disabled={loading}
                      className="h-11 rounded-xl bg-[#D6003C] px-5 text-white hover:bg-[#BE0036]"
                    >
                      {loading ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <TicketCheck />
                      )}
                      Redeem prize
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="participants" className="scroll-mt-24">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <CardTitle>Participants & winners</CardTitle>
                      <CardDescription>
                        Latest 100 matching records from the campaign.
                      </CardDescription>
                    </div>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault()
                        void load(search)
                      }}
                      className="flex w-full gap-2 lg:max-w-md"
                    >
                      <div className="relative flex-1 md:hidden">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={search}
                          onChange={(event) => setSearch(event.target.value)}
                          placeholder="Name, phone or code"
                          className="h-10 border-input bg-surface pl-9"
                        />
                      </div>
                      <Button type="submit" className="h-10">
                        Search
                      </Button>
                    </form>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-sm">
                      <thead>
                        <tr className="border-y border-border bg-muted/40 text-left text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                          <th className="px-5 py-3 font-semibold">Participant</th>
                          <th className="px-5 py-3 font-semibold">Prize</th>
                          <th className="px-5 py-3 font-semibold">Code</th>
                          <th className="px-5 py-3 font-semibold">Status</th>
                          <th className="px-5 py-3 text-right font-semibold">Time</th>
                          <th className="px-5 py-3 text-right font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.entries.map((entry) => (
                          <tr
                            key={entry.session_id}
                            className="border-b border-border last:border-0 hover:bg-muted/30"
                          >
                            <td className="px-5 py-4">
                              <p className="font-semibold">{entry.name}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {entry.phone}
                              </p>
                            </td>
                            <td className="px-5 py-4 text-xs">
                              {entry.prize_label || "Waiting for re-spin"}
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-heading text-xs tracking-wide text-muted-foreground">
                                {entry.prize_code || "—"}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              {entry.redeemed_at ? (
                                <Badge variant="success">Redeemed</Badge>
                              ) : entry.prize_code ? (
                                <Badge variant="warning">Pending</Badge>
                              ) : (
                                <Badge variant="secondary">Re-spin</Badge>
                              )}
                            </td>
                            <td className="px-5 py-4 text-right text-xs text-muted-foreground">
                              {date(entry.completed_at || entry.created_at)}
                            </td>
                            <td className="px-5 py-4 text-right">
                              {entry.redeemed_at ? (
                                <CheckCircle2 className="ml-auto size-4 text-emerald-500" />
                              ) : entry.prize_code ? (
                                <Button
                                  onClick={() => void redeem(entry.prize_code!)}
                                  disabled={loading}
                                  className="h-8 rounded-lg bg-[#D6003C] px-3 text-xs text-white hover:bg-[#BE0036]"
                                >
                                  Redeem
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {!data.entries.length ? (
                    <div className="p-12 text-center text-sm text-muted-foreground">
                      No matching records.
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </section>

            <section id="prizes" className="scroll-mt-24 space-y-4">
              <div>
                <h2 className="font-heading text-xl font-semibold tracking-tight">
                  Prize settings
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Adjust relative chance, daily limits and availability.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {data.prizes.map((prize) => (
                  <PrizeRow
                    key={prize.key}
                    prize={prize}
                    totalWeight={totalWeight}
                    onSaved={() => load(search)}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function PrizeRow({
  prize,
  totalWeight,
  onSaved,
}: {
  prize: Prize
  totalWeight: number
  onSaved: () => void
}) {
  const [weight, setWeight] = useState(String(prize.weight))
  const [limit, setLimit] = useState(
    prize.daily_limit == null ? "" : String(prize.daily_limit),
  )
  const [active, setActive] = useState(prize.is_active)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setWeight(String(prize.weight))
    setLimit(prize.daily_limit == null ? "" : String(prize.daily_limit))
    setActive(prize.is_active)
  }, [prize])

  const chance =
    active && totalWeight ? ((Number(weight) || 0) / totalWeight) * 100 : 0

  async function save() {
    setSaving(true)

    try {
      const response = await fetch("/api/admin/prizes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: prize.key,
          weight: Number(weight),
          daily_limit: limit === "" ? null : Number(limit),
          is_active: active,
        }),
      })

      if (!response.ok) return

      await onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-semibold">{prize.label}</p>
              {active ? (
                <Badge variant="success">Active</Badge>
              ) : (
                <Badge variant="secondary">Paused</Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {chance.toFixed(1)}% relative chance · {prize.won} won ·{" "}
              {prize.redeemed} redeemed
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActive((value) => !value)}
            aria-label={active ? "Disable prize" : "Enable prize"}
            className={`relative h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${
              active ? "bg-[#D6003C]" : "bg-muted"
            }`}
          >
            <span
              className={`block size-5 rounded-full bg-white shadow-sm transition-transform ${
                active ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Weight
            </label>
            <Input
              type="number"
              min={1}
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              className="h-9 border-input bg-surface"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Daily limit
            </label>
            <Input
              type="number"
              min={1}
              value={limit}
              onChange={(event) => setLimit(event.target.value)}
              placeholder="Unlimited"
              className="h-9 border-input bg-surface"
            />
          </div>
        </div>

        <Button
          onClick={() => void save()}
          disabled={saving}
          className="mt-4 h-9 w-full bg-foreground text-background hover:bg-foreground/90"
        >
          {saving ? <LoaderCircle className="animate-spin" /> : null}
          Save settings
        </Button>
      </CardContent>
    </Card>
  )
}

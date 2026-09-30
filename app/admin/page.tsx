import type { Metadata } from "next"

import { AdminDashboard } from "@/components/admin-dashboard"

export const metadata: Metadata = {
  title: "20D Cinema | Spin Admin",
  description: "20D Cinema Spin & Win campaign dashboard",
}

export default function AdminPage() {
  return <AdminDashboard />
}

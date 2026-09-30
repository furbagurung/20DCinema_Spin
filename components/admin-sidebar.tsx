"use client"

import Image from "next/image"
import { useState } from "react"
import {
  BarChart3,
  CheckCircle2,
  Gift,
  LogOut,
  Settings2,
  Sparkles,
  Users,
} from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"

type AdminSidebarProps = {
  onLogout: () => void | Promise<void>
}

const navigation = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "participants", label: "Participants", icon: Users },
  { id: "prizes", label: "Prize Settings", icon: Gift },
]

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const { setMobileOpen } = useSidebar()
  const [active, setActive] = useState("overview")

  function goTo(id: string) {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
    setMobileOpen(false)
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-2.5">
          <div className="shrink-0 rounded-xl bg-[#100A0C] px-2.5 py-1.5">
            <Image
              src="/logo/White Reversed 20D Cinema Secondary Logo.png"
              alt="20D Cinema"
              width={180}
              height={70}
              priority
              className="h-auto w-24"
            />
          </div>

          <div className="min-w-0 group-data-[sidebar-open=false]/sidebar-wrapper:hidden">
            <p className="truncate text-xs font-semibold">Spin & Win</p>
            <p className="truncate text-[10px] text-sidebar-foreground/45">
              Admin workspace
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Campaign</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    active={active === item.id}
                    onClick={() => goTo(item.id)}
                    title={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  active={active === "prizes"}
                  onClick={() => goTo("prizes")}
                  title="Campaign settings"
                >
                  <Settings2 />
                  <span>Campaign Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mx-2 mt-3 rounded-2xl border border-primary/15 bg-primary/5 p-3 group-data-[sidebar-open=false]/sidebar-wrapper:hidden">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-semibold">Campaign active</span>
          </div>
          <p className="mt-2 text-[10px] leading-4 text-sidebar-foreground/50">
            Spin & Win entries and prize redemptions are being tracked live.
          </p>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>

          <div className="min-w-0 flex-1 group-data-[sidebar-open=false]/sidebar-wrapper:hidden">
            <p className="truncate text-xs font-semibold">20D Cinema</p>
            <p className="truncate text-[10px] text-sidebar-foreground/45">
              KL Tower · Kathmandu
            </p>
          </div>

          <div className="flex items-center gap-0.5 group-data-[sidebar-open=false]/sidebar-wrapper:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => void onLogout()}
              className="flex size-8 items-center justify-center rounded-lg text-sidebar-foreground/55 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 group-data-[sidebar-open=false]/sidebar-wrapper:hidden">
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          <span className="text-[10px] text-sidebar-foreground/45">
            System operational
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

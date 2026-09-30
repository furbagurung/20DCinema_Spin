"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Menu, PanelLeft, X } from "lucide-react"

import { Button } from "@/components/ui/button"

type SidebarContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) throw new Error("useSidebar must be used within SidebarProvider")
  return context
}

export function SidebarProvider({
  defaultOpen = true,
  children,
  className,
}: React.ComponentProps<"div"> & { defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(() => {
    const saved = window.localStorage.getItem("20d-admin-sidebar")
    if (saved === "closed") setOpen(false)
  }, [])

  React.useEffect(() => {
    window.localStorage.setItem("20d-admin-sidebar", open ? "open" : "closed")
  }, [open])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const value = React.useMemo(
    () => ({
      open,
      setOpen,
      toggleSidebar: () => setOpen((value) => !value),
      mobileOpen,
      setMobileOpen,
    }),
    [open, mobileOpen],
  )

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-sidebar-wrapper
        data-sidebar-open={open}
        className={cn("flex min-h-svh w-full bg-background", className)}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function Sidebar({
  children,
  className,
}: React.ComponentProps<"aside">) {
  const { open, mobileOpen, setMobileOpen } = useSidebar()

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <aside
        data-sidebar
        data-sidebar-open={open}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm transition-transform duration-200 ease-out md:z-30 md:translate-x-0 md:transition-[width]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:flex md:shrink-0",
          open ? "md:w-64" : "md:w-[4.25rem]",
          className,
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <button
          type="button"
          className="absolute -right-3 top-6 hidden size-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm md:flex"
          onClick={() => useSidebar().toggleSidebar()}
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="size-3.5" />
        </button>
      </aside>
      {mobileOpen ? (
        <Button
          variant="ghost"
          size="icon"
          className="fixed right-4 top-4 z-[60] md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        >
          <X />
        </Button>
      ) : null}
    </>
  )
}

export function SidebarHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 p-3", className)} {...props} />
}

export function SidebarContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-2", className)}
      {...props}
    />
  )
}

export function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("border-t border-sidebar-border p-3", className)} {...props} />
}

export function SidebarGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("mb-5", className)} {...props} />
}

export function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/45",
        "group-data-[sidebar-open=false]/sidebar-wrapper:hidden",
        className,
      )}
      {...props}
    />
  )
}

export function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("space-y-1", className)} {...props} />
}

export function SidebarMenu({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return <ul className={cn("flex w-full flex-col gap-1", className)} {...props} />
}

export function SidebarMenuItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return <li className={cn("relative", className)} {...props} />
}

const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active: "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm",
      },
      size: {
        default: "min-h-10",
        sm: "min-h-9 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export function SidebarMenuButton({
  className,
  active = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof sidebarMenuButtonVariants> & {
    active?: boolean
  }) {
  return (
    <button
      type="button"
      data-active={active}
      className={cn(
        sidebarMenuButtonVariants({
          variant: active ? "active" : "default",
          className,
        }),
        "[&>svg]:size-4 [&>svg]:shrink-0",
        "md:group-data-[sidebar-open=false]/sidebar-wrapper:justify-center md:group-data-[sidebar-open=false]/sidebar-wrapper:px-0",
        "md:group-data-[sidebar-open=false]/sidebar-wrapper:[&>span]:hidden",
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("my-3 h-px bg-sidebar-border", className)} {...props} />
}

export function SidebarInset({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      className={cn(
        "min-w-0 flex-1 bg-background",
        "md:group-data-[sidebar-open=true]/sidebar-wrapper:ml-0",
        className,
      )}
      {...props}
    />
  )
}

export function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, setMobileOpen } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("md:hidden", className)}
      onClick={() => setMobileOpen(true)}
      aria-label="Open navigation"
      {...props}
    >
      <Menu />
    </Button>
  )
}

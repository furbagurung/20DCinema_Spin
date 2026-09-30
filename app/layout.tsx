import type { Metadata } from "next"
import { Manrope, Orbitron } from "next/font/google"

import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title: "20D Cinema | Spin & Win",
  description: "20D Cinema Spin & Win campaign",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${orbitron.variable}`}>
      <body>{children}</body>
    </html>
  )
}

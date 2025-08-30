"use client"
import DashboardNav from "@/components/DashboardNav"
import MobileDashBoardNav from "@/components/MobileDashBoardNav"
import { Toaster } from "@/components/ui/toaster"
import { useState } from "react"
import type React from "react"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [showNav, setShowNav] = useState(true)

  const handleNavToggle = (navState: boolean) => {
    setShowNav(navState)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      <DashboardNav onNavToggle={handleNavToggle} />
      <MobileDashBoardNav />
      <main
        className={`flex-grow transition-all duration-300 ease-in-out ${
          showNav
            ? "ml-24 md:ml-24" // 6rem = 96px = ml-24, consistent with original CSS
            : "ml-12 md:ml-12" // 3rem = 48px = ml-12, expanded state
        } max-md:ml-0`} // No margin on mobile (max-width: 768px)
      >
        {children}
      </main>
      <Toaster />
    </div>
  )
}

export default DashboardLayout

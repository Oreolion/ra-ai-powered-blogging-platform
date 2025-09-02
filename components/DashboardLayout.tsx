'use client';
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import type React from "react";
import DashboardNav from "./DashboardNav";
import MobileDashBoardNav from "./MobileDashBoardNav";
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [showNav, setShowNav] = useState(true);
  const handleNavToggle = (navState: boolean) => {
    setShowNav(navState);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      <DashboardNav onNavToggle={handleNavToggle} />
      <MobileDashBoardNav />
      <main
        className={`flex-grow transition-all duration-300 ease-in-out ${
          showNav
            ? "md:ml-[15rem]"
            : "md:ml-24"
        } max-md:ml-0`}
      >
        {children}
      </main>
      <Toaster />
    </div>
  );
};
export default DashboardLayout;
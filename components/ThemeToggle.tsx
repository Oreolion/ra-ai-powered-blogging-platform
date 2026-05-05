"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-slate-800/50 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  const Icon = theme === "system" ? Monitor : isDark ? Moon : Sun;
  const label = theme === "system" ? "System" : isDark ? "Dark" : "Light";

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
      title={`Theme: ${label}`}
      aria-label={`Current theme: ${label}. Click to cycle.`}
    >
      <Icon className="w-5 h-5" />
      <span className="sr-only">{label} mode</span>
    </button>
  );
}

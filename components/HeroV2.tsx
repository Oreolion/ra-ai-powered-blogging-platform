"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { ArrowRight, Sparkles, PenTool, Users } from "lucide-react";

export default function HeroV2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />

      {/* Floating orbs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Blogging Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
            >
              Curious to learn?{" "}
              <span className="text-orange-400">
                <TypeAnimation
                  sequence={[
                    "READ ALONG...",
                    1500,
                    "READ ANYTHING...",
                    1500,
                    "READ ANYTIME...",
                    1500,
                    "REACH ANYONE...",
                    1500,
                  ]}
                  speed={28}
                  repeat={Infinity}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-300 max-w-lg"
            >
              Unleash the Power of Words. Connect with like-minded readers and
              writers. Discover stories, thinking, and expertise from writers on
              any topic.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/25"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all duration-300 hover:scale-105"
              >
                Explore Feeds
              </Link>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-8 pt-4"
            >
              {[
                { icon: <PenTool className="w-5 h-5" />, label: "AI Writing", desc: "GPT-4 Powered" },
                { icon: <Users className="w-5 h-5" />, label: "Community", desc: "Global Readers" },
                { icon: <Sparkles className="w-5 h-5" />, label: "Thumbnails", desc: "DALL-E 3" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800/50 text-orange-400">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.label}</p>
                    <p className="text-slate-400 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Floating cards */}
          <div className="relative hidden lg:block h-[500px]">
            <motion.div
              style={{
                x: mousePosition.x,
                y: mousePosition.y,
              }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="absolute top-0 right-0 w-80 h-56 rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10 border border-slate-700/50"
            >
              <Image
                src="/images/pexels-kaboompics-com-6469.jpg"
                alt="Blogging"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold text-lg">AI-Generated Content</p>
                <p className="text-slate-300 text-sm">Write smarter, not harder</p>
              </div>
            </motion.div>

            <motion.div
              style={{
                x: mousePosition.x * -0.5,
                y: mousePosition.y * -0.5,
              }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="absolute top-32 left-0 w-72 h-48 rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">AI Summary</p>
                  <p className="text-slate-400 text-xs">Generated just now</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                &ldquo;This article explores the intersection of AI and creative writing,
                demonstrating how language models can enhance storytelling...&rdquo;
              </p>
            </motion.div>

            <motion.div
              style={{
                x: mousePosition.x * 0.3,
                y: mousePosition.y * 0.3,
              }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="absolute bottom-0 right-12 w-64 h-40 rounded-2xl bg-gradient-to-br from-orange-500/20 to-purple-500/20 backdrop-blur-xl border border-orange-500/20 p-5 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-800"
                    />
                  ))}
                </div>
                <span className="text-slate-300 text-sm">+1.2k readers</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-slate-700/50 rounded-full w-full" />
                <div className="h-2 bg-orange-500/40 rounded-full w-3/4" />
                <div className="h-2 bg-slate-700/50 rounded-full w-1/2" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#333] to-transparent" />
    </section>
  );
}

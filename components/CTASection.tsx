"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="relative p-10 sm:p-16 rounded-3xl bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 overflow-hidden text-center">
          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-orange-500/50 via-purple-500/50 to-orange-500/50 opacity-50" />
          <div className="absolute inset-[1px] rounded-3xl bg-slate-900/90" />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Start Creating Today
            </motion.div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Ready to Amplify Your{" "}
              <span className="text-orange-400">Voice</span>?
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
              Join thousands of writers using AI to create better content, faster.
              Your next great post is just one prompt away.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
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
                Explore as Guest
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

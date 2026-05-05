"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Sparkles,
  PenTool,
  ImageIcon,
  Share2,
  BookOpen,
  BarChart3,
  MessageSquare,
  Palette,
} from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "AI Post Generation",
    description:
      "Generate complete blog posts with GPT-4. Just provide a prompt and watch the magic happen.",
    color: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-400",
  },
  {
    icon: <ImageIcon className="w-8 h-8" />,
    title: "AI Thumbnails",
    description:
      "Create stunning featured images with DALL-E 3. Every post deserves eye-catching visuals.",
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: <PenTool className="w-8 h-8" />,
    title: "Tone Rewriter",
    description:
      "Switch between Professional, Casual, Witty, Academic, or Storytelling tones instantly.",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Reading Experience",
    description:
      "Table of contents, reading progress bar, code syntax highlighting, and estimated reading time.",
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400",
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Community Engagement",
    description:
      "Threaded comments with emoji reactions, Medium-style claps, and follow your favorite authors.",
    color: "from-yellow-500/20 to-orange-500/20",
    iconColor: "text-yellow-400",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Creator Analytics",
    description:
      "Track views, claps, and audience growth. Understand what content resonates with readers.",
    color: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: <Share2 className="w-8 h-8" />,
    title: "Social Sharing",
    description:
      "Share posts across platforms with AI-generated summaries. Export as images or markdown.",
    color: "from-indigo-500/20 to-violet-500/20",
    iconColor: "text-indigo-400",
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Light & Dark Mode",
    description:
      "Seamlessly switch between light, dark, and system themes. Beautiful in every mode.",
    color: "from-teal-500/20 to-cyan-500/20",
    iconColor: "text-teal-400",
  },
];

export default function FeaturesShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-800/30 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything You Need to{" "}
            <span className="text-orange-400">Create</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From AI-powered writing to community engagement, RA has all the tools
            modern creators need.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative p-6 rounded-2xl bg-slate-800/20 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-slate-800/50 ${feature.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

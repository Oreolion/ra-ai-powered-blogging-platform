"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Mail, Heart } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Create Post", href: "/create-post" },
    { label: "Bookmarks", href: "/bookmarks" },
  ],
  Community: [
    { label: "Trending", href: "/dashboard" },
    { label: "Writers", href: "/dashboard" },
    { label: "Categories", href: "/dashboard" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

export default function FooterV2() {
  return (
    <footer className="relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logo.webp"
                alt="RA Logo"
                width={100}
                height={30}
                className="object-contain"
              />
            </Link>
            <p className="text-slate-400 text-sm max-w-xs mb-6">
              AI-powered blogging platform for modern creators. Write smarter,
              engage deeper, grow faster.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Twitter className="w-4 h-4" />, href: "#" },
                { icon: <Github className="w-4 h-4" />, href: "#" },
                { icon: <Mail className="w-4 h-4" />, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="p-2.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold text-sm mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-orange-400 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} RA. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> and AI
          </p>
        </div>
      </div>
    </footer>
  );
}

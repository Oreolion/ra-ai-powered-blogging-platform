"use client";
import Link from "next/link";
import { useCallback, useState } from "react";
import { SignedIn, useUser, useClerk } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import type { postCategory } from "@/types";
import Image from "next/image";
import slugify from "slugify";
import { LogOut, LogOutIcon } from "lucide-react";
const DashboardNav = ({
  onNavToggle,
}: {
  onNavToggle: (showNav: boolean) => void;
}) => {
  const [showNav, setShowNav] = useState(true);
  const [dropDown, setDropDown] = useState(true);
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const postCategories: postCategory[] = [
    "Technology",
    "Metaphysics & Esoterics",
    "Science",
    "World News",
    "Africa",
    "Programming",
    "Politics",
    "Machine Learning",
    "Artificial Intelligence",
    "Economics & Finance",
    "Self Development",
    "Others",
  ];
  const createSlug = (category: string) => {
    return slugify(category, { lower: true, strict: true });
  };
  const isLinkActive = (href: string) => {
    return pathname === href || pathname.startsWith(href);
  };
  const handleShowNavbar = useCallback(() => {
    const newShowNav = !showNav;
    setShowNav(newShowNav);
    onNavToggle(newShowNav);
  }, [showNav, onNavToggle]);
  const toggleDropDown = () => {
    setDropDown(!dropDown);
  };
  return (
    <div className="fixed top-0 left-0 h-full z-50 max-md:hidden">
      <nav
        className={`h-full bg-slate-900/95 backdrop-blur-sm border-r border-slate-700 transition-all duration-300 ${
          showNav ? "w-64" : "w-24"
        }`}
      >
        {!showNav && (
          <div className="flex flex-col h-full mt-[6rem]">
            {/* Logo section when collapsed */}

            {/* Main navigation icons */}
            <div className="flex-1 py-4">
              <div className="flex flex-col items-center gap-2 mb-6">
                <Link
                  href="/dashboard"
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                    isLinkActive("/dashboard")
                      ? "bg-orange-500/20 text-orange-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                  title="Homefeeds"
                >
                  <svg
                    className="w-5 h-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                  >
                    <path d="M211.2 96a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM32 256c0 17.7 14.3 32 32 32h85.6c10.1-39.4 38.6-71.5 75.8-86.6c-9.7-6-21.2-9.4-33.4-9.4H96c-35.3 0-64 28.7-64 64zm461.6 32H576c17.7 0 32-14.3 32-32c0-35.3-28.7-64-64-64H448c-11.7 0-22.7 3.1-32.1 8.6c38.1 14.8 67.4 47.3 77.7 87.4zM391.2 226.4c-6.9-1.6-14.2-2.4-21.6-2.4h-96c-8.5 0-16.7 1.1-24.5 3.1c-30.8 8.1-55.6 31.1-66.1 60.9c-3.5 10-5.5 20.8-5.5 32c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32c0-11.2-1.9-22-5.5-32c-10.8-30.7-36.8-54.2-68.9-61.6zM563.2 96a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM321.6 192a80 80 0 1 0 0-160 80 80 0 1 0 0 160zM32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32H608c17.7 0 32-14.3 32-32s-14.3-32-32-32H32z" />
                  </svg>
                </Link>
                <Link
                  href="/create-post"
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                    isLinkActive("/create-post")
                      ? "bg-orange-500/20 text-orange-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                  title="Create Post"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="w-5 h-5 fill-current"
                  >
                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                  </svg>
                </Link>
                <Link
                  href="/bookmarks"
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                    isLinkActive("/bookmarks")
                      ? "bg-orange-500/20 text-orange-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                  title="Bookmarks"
                >
                  <svg
                    className="w-5 h-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
                  </svg>
                </Link>
              </div>
              {/* Divider */}
              <div className="w-8 h-px bg-slate-700 mx-auto mb-6"></div>
              {/* Personal section icons */}
              <div className="flex flex-col items-center gap-2">
                <Link
                  href={`/profile/${user?.id}`}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="My Profile"
                >
                  <svg
                    className="w-5 h-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                  </svg>
                </Link>
                <button
                  type="button"
                  onClick={() => signOut(() => router.push("/sign-in"))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900 transition-colors"
                  title="Sign Out"
                >
                  <LogOutIcon size={15} className="" />
                  {/* <svg
                    className="w-5 h-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#ff0000"
                      d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                    />
                  </svg> */}
                </button>
              </div>
            </div>
            {/* Toggle button when collapsed */}
            <div className="p-3 border-t border-slate-700 flex justify-center mb-20">
              <button
                type="button"
                onClick={handleShowNavbar}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Expand Navigation"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                </svg>
              </button>
            </div>
          </div>
        )}
        {showNav && (
          <>
            <div className="p-4 border-b border-slate-700">
              <Link href="/dashboard" className="block">
                <Image
                  src="/images/logo.webp"
                  alt="logo"
                  height={10}
                  width={100}
                />
              </Link>
            </div>
            <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
              <div>
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Overview
                </h5>
                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isLinkActive("/dashboard")
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                    >
                      <title>HomeFeeds</title>
                      <path d="M211.2 96a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM32 256c0 17.7 14.3 32 32 32h85.6c10.1-39.4 38.6-71.5 75.8-86.6c-9.7-6-21.2-9.4-33.4-9.4H96c-35.3 0-64 28.7-64 64zm461.6 32H576c17.7 0 32-14.3 32-32c0-35.3-28.7-64-64-64H448c-11.7 0-22.7 3.1-32.1 8.6c38.1 14.8 67.4 47.3 77.7 87.4zM391.2 226.4c-6.9-1.6-14.2-2.4-21.6-2.4h-96c-8.5 0-16.7 1.1-24.5 3.1c-30.8 8.1-55.6 31.1-66.1 60.9c-3.5 10-5.5 20.8-5.5 32c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32c0-11.2-1.9-22-5.5-32c-10.8-30.7-36.8-54.2-68.9-61.6zM563.2 96a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM321.6 192a80 80 0 1 0 0-160 80 80 0 1 0 0 160zM32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32H608c17.7 0 32-14.3 32-32s-14.3-32-32-32H32z" />
                    </svg>
                    <span>Homefeeds</span>
                  </Link>
                  <Link
                    href="/create-post"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isLinkActive("/create-post")
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="w-5 h-5 fill-current"
                    >
                      <title>Create Post</title>
                      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                    </svg>
                    <span>Create Post</span>
                  </Link>
                  <Link
                    href="/bookmarks"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isLinkActive("/bookmarks")
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                    >
                      <title>Bookmarks</title>
                      <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
                    </svg>
                    <span>Bookmarks</span>
                  </Link>
                </div>
              </div>
              <div>
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Personal
                </h5>
                <div className="space-y-1">
                  <Link
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    href={`/profile/${user?.id}`}
                  >
                    <svg
                      className="w-5 h-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                    </svg>
                    <span>My Profile</span>
                  </Link>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer">
                    <svg
                      className="w-5 h-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                    </svg>
                    <SignedIn>
                      <span
                        onClick={() => signOut(() => router.push("/sign-in"))}
                      >
                        Log Out
                      </span>
                    </SignedIn>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Trending Tags
                  </h5>
                  <svg
                    className={`w-4 h-4 fill-current text-slate-400 cursor-pointer transition-transform ${
                      dropDown ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    onClick={toggleDropDown}
                  >
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                  </svg>
                </div>
                {dropDown && (
                  <div className="space-y-1">
                    {postCategories.map((category) => {
                      const slug = createSlug(category);
                      return (
                        <Link
                          key={category}
                          href={`/filter-posts/${slug}`}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isLinkActive(`/filter-posts/${slug}`)
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                              : "text-slate-300 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          {category}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {/* Toggle button inside expanded nav */}
            <div className="absolute top-4 right-4 z-50">
              <button
                type="button"
                onClick={handleShowNavbar}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Collapse Navigation"
              >
                <svg
                  className="w-6 h-6 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                </svg>
              </button>
            </div>
          </>
        )}
      </nav>
    </div>
  );
};
export default DashboardNav;

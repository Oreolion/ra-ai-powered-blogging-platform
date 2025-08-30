"use client";
// import Image from "next/image";
import Link from "next/link";
import { SignedIn, UserButton, useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { postCategory } from "@/types";
import { navbarLinks } from "@/constants";
import SVGIcon from "@/components/SVGIcon";
import slugify from "slugify";
import Image from "next/image";

const MobileDashBoardNav = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [dropDownList, setDropDownList] = useState(true);

  const { signOut } = useClerk();
  const { user } = useUser();
  const pathname = usePathname();
  const myRef = useRef(null);

  const router = useRouter();
  function toggleMenu() {
    setToggle(!toggle);
  }
  function toggleDropDownList() {
    setDropDownList(!dropDownList);
  }

  useEffect(() => {
    const handleScroll = () => {
      // @ts-ignore
      myRef?.current?.classList.remove("active");
      setToggle(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
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

  const toggleDropDown = () => {
    setDropDown(!dropDown);
  };

  return (
    <>
      {/*  mobile dashboard navbar  */}
      {toggle && (
        <>
          <nav
            className="fixed top-0 left-0 h-full w-64 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700 z-50 md:hidden"
            ref={myRef}
          >
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
                  {navbarLinks.map((item) => {
                    return (
                      <Link
                        key={item.label}
                        href={item.route}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isLinkActive(`${item.route}`)
                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                            : "text-slate-300 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        <SVGIcon svgString={item.svg} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
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
                    className={`w-4 h-4 fill-current text-slate-400 cursor-pointer transition-transform ${dropDownList ? "rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    onClick={toggleDropDownList}
                  >
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                  </svg>
                </div>

                {dropDownList && (
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
          </nav>
        </>
      )}

      <main className="md:fixed md:top-0 md:left-0 md:right-0">
        {/*  header  */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-4 md:px-10">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="block md:ml-12">
              <Image
                src="/images/logo.webp"
                alt="logo"
                height={10}
                width={90}
              />
            </Link>

            <div className="flex items-center">
              <div className="flex items-center gap-2">
                {!toggle ? (
                  <svg
                    onClick={toggleMenu}
                    className="w-6 h-6 fill-current text-slate-400 hover:text-white cursor-pointer transition-colors md:hidden"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 fill-current text-slate-400 hover:text-white cursor-pointer transition-colors md:hidden"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    onClick={toggleMenu}
                  >
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                  </svg>
                )}
              </div>
              <svg
                className="w-8 h-8 fill-current text-slate-400 hover:text-white cursor-pointer transition-colors md:mr-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                onClick={toggleDropDown}
              >
                <title>Notifications</title>
                <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
              </svg>

              <div className="w-10 h-10 items-center md:mt-8 md:w-16 md:h-16">
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>

            {dropDown && (
              <div className="absolute top-full right-4 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg">
                <div className="text-slate-300">
                  You currently have no Notification.
                </div>
              </div>
            )}
          </div>
        </header>
      </main>
    </>
  );
};

export default MobileDashBoardNav;

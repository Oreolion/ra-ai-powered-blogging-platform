"use client";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import styles from "@/styles/dashboardnav.module.css";
import { SignedIn, useUser, useClerk } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { postCategory } from "@/types";
import { navbarLinks } from "@/constants";
import SVGIcon from "@/components/SVGIcon";
import Image from "next/image";

const DashboardNav = ({
  onNavToggle,
}: {
  onNavToggle: (showNav: boolean) => void;
}) => {
  const [showNav, setShowNav] = useState(true);
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
    "Machine Learning",
    "Artificial Intelligence",
  ];

  const isLinkActive = (href: string) => {
    return pathname === href || pathname.startsWith(href);
  };

  const handleShowNavbar = useCallback(() => {
    const newShowNav = !showNav;
    setShowNav(newShowNav);
    onNavToggle(newShowNav);
  }, [showNav, onNavToggle]);

  return (
    <div className={styles.dashboard__navcontainer}>
      <nav className={showNav ? styles.dashboard__nav : styles.collapseblock}>
        {!showNav && (
          <div className={styles.collapse__svg}>
            {navbarLinks.map((item) => {
              return (
                <Link key={item.label} href={item.route}>
                  <SVGIcon svgString={item.svg} />
                </Link>
              );
            })}

            <div className="flex flex-col gap-[2.5rem]">
              <Link className={styles.link} href={`/profile/${user?.id}`}>
                <svg
                  className={styles.svg}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <title>My Profile</title>

                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>
              </Link>
              {/* <Link className={styles.link} href="/dashboard/nocontent">
                <svg
                  className={styles.svg}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <title>Notifications</title>

                  <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
                </svg>
              </Link> */}
              <svg
                className={styles.svg}
                onClick={() => signOut(() => router.push("/sign-in"))}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <title>Sign Out</title>
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                <SignedIn></SignedIn>
              </svg>
            </div>
          </div>
        )}
        <div className={`${styles.logo} ${styles.link}`}>
          <Link href="/">
            <h3 className={styles.h3}>
              THE <span className={styles.span}>RA</span> APP
            </h3>
            <p className={styles.p}>
              The <span className={styles.span}>Read Along</span> APP
            </p>
          </Link>
        </div>
        {/* <div className={styles.user}>
          <div className={styles.user__info}></div>
        </div> */}

        <ul className={styles.dashboard__navlists}>
          <h5 className={styles.h5}>Overview</h5>

          <li className={styles.li} key="Homefeeds">
            <Link
              href="/dashboard"
              className={`${styles.link} ${isLinkActive("/dashboard") ? styles.active_link : ""}`}
            >
              <p className={styles.linktext}>Homefeeds</p>
            </Link>
          </li>
          <li className={styles.li} key="Create Post">
            <Link
              href="/create-post"
              className={`${styles.link} ${isLinkActive("/create-post") ? styles.active_link : ""}`}
            >
              <Image src='/public/icons/discover.svg' alt='i' height={20} width={20}></Image>

              <p className={styles.linktext}>Create Post</p>
            </Link>
          </li>
          <li className={styles.li} key="Bookmarks">
            <Link
              href="/bookmarks"
              className={`${styles.link} ${isLinkActive("/bookmarks") ? styles.active_link : ""}`}
            >
              <Image
                src="/public/icons/discover.svg"
                alt="i"
                height={20}
                width={20}
              ></Image>
              <p className={styles.linktext}>Bookmarks</p>
            </Link>
          </li>

          <span className={styles.spanheader}>
            <h5 className={styles.h5}>Trending Tags</h5>
            <svg
              className={styles.svg}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </svg>
          </span>
          {postCategories.map((category) => {
            return (
              <li className={styles.li} key={category}>
                <Link
                  href={`/filter-posts/${category}`}
                  className={`${styles.link} ${isLinkActive(`/filter-posts/${category}`) ? styles.active_link : ""}`}
                >
                  {category}
                </Link>
              </li>
            );
          })}

          <h5 className={styles.h5}>Personal</h5>

          <li className={styles.li}>
            <Link className={styles.link} href={`/profile/${user?.id}`}>
              <svg
                className={styles.svg}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
              </svg>
              <p className={styles.p}>My Profile</p>
            </Link>
          </li>
          {/* <li className={styles.li}>
            <Link className={styles.link} href="/dashboard/nocontent">
              <svg
                className={styles.svg}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
              </svg>
              Notifications
            </Link>
          </li> */}
          <li>
            <div className={`${styles.link}  ${styles.hide}`}>
              <svg
                className={`${styles.svg}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
              </svg>
              <SignedIn>
                <p
                  className={`${styles.p}`}
                  onClick={() => signOut(() => router.push("/sign-in"))}
                >
                  Log Out
                </p>
              </SignedIn>
            </div>
          </li>
        </ul>
      </nav>

      {!showNav && (
        <Link href="/">
          <div className={`${styles.otherlogo} ${styles.link}`}>
            <h3 className={styles.h3}>
              THE <span className={styles.span}>RA</span> APP
            </h3>
            <p className={styles.p}>
              The <span className={styles.span}>Read Along</span> APP
            </p>
          </div>
        </Link>
      )}

      <div className={styles.show_nav}>
        {!showNav ? (
          <button
            type="button"
            onClick={handleShowNavbar}
            className={showNav ? styles.close_btn : styles.onclose_btn}
          >
            {showNav ? "<" : ">"}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleShowNavbar}
              className={showNav ? styles.close_btn : styles.onclose_btn}
            >
              &lt;
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardNav;

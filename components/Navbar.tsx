"use client";
import Link from "next/link";
import React, { useState } from "react";
import styles from "../styles/navbar.module.css";

const Navbar = () => {
  const [toggleNavbar, setToggleNavbar] = useState<boolean>(false);

  const toggleMenu = () => {
    return setToggleNavbar(!toggleNavbar);
  };

  return (
    <header className={styles.header}>
      <div className={`${styles.logo} ${styles.link}`}>
        <Link href="/">
          <h3 className={styles.h3}>
            THE <span>RA</span> BLOG
          </h3>
          <p className={`${styles.p} text-[#e67e22]`}>
            The <span className={styles.span}>Read Along</span> Blog
          </p>
        </Link>
      </div>

      <nav className={styles.right__nav}>
        <div className={styles.nav__icons}>
          <div className={styles.search}>
            <svg
              className={styles.svg}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </div>

          {toggleNavbar ? (
            <svg
              className={styles.svg}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              onClick={toggleMenu}
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          ) : (
            <div onClick={toggleMenu} className={styles.menu_bar}>
              <svg
                className={styles.svg}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
              </svg>
            </div>
          )}
        </div>
        <div className={styles.search_form}>
          <input type="search" placeholder="search here..." />
          <label>
            <svg
              className={`${styles.svg} {styles.search}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
        </div>
        <ul className={styles.navlist}>
          <li>
            <Link className={styles.li} href="/">
              Home
            </Link>
          </li>
          <li>
            <Link className={styles.li} href="/login">
              Write
            </Link>
          </li>
          <li>
            <Link className={styles.li} href="/login">
              Sign in
            </Link>
          </li>
          <li>
            <Link className={styles.li} href="/signup">
              <button type="button">Get Started</button>
            </Link>
          </li>
        </ul>
      </nav>
      {/*  Mobile Nav */}
      {toggleNavbar && (
        <nav className={styles.mobile__nav}>
          <ul className={styles.mobile_navlist}>
            <li>
              <Link className={styles.li} href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className={styles.li} href="/login">
                Write
              </Link>
            </li>
            <li>
              <Link className={styles.li} href="/login">
                Sign in
              </Link>
            </li>
            <li>
              <Link className={styles.li} href="/signup">
                <button>Get Started</button>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;

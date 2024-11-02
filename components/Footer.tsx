import React from "react";
import styles from "../styles/footer.module.css";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner_footer}>
        <div className={`${styles.logo} ${styles.link}`}>
          <Link href="/">
            <Image src="/images/logo.webp" alt="logo" height={30} width={100} />
          </Link>
        </div>
        <div className={styles.box1}>
          <h5 className={styles.h5}>Explore</h5>
          <ul>
            <li className={styles.li}>
              <Link href="/">Community</Link>
            </li>
            <li className={styles.li}>
              <Link href="/">Trending Blogs</Link>
            </li>
            <li className={styles.li}>
              <Link href="/">Read Along for teams</Link>
            </li>
          </ul>
        </div>
        <div className={styles.box1}>
          <h5 className={styles.h5}>
            <Link href="/">Support</Link>
          </h5>
          <ul>
            <li className={styles.li}>
              <Link href="/">Support Docs</Link>
            </li>
            <li className={styles.li}>
              <Link href="/">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
      <p className={styles.p1}>Term of Service | Security | the RA APP 2024</p>
    </footer>
  );
};

export default Footer;

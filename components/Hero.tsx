import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "../styles/hero.module.css";




const Hero = () => {
  return (
    <section className={styles.section}>
      <div className={styles.inner__herosection}>
        <div className={styles.left__herosection}>
          <h1 className={styles.h1}>Curious to learn new things? okay! READ ALONG...</h1>
          <h3 className={styles.h3}>
            Unleash the Power of Words, Connect with Like-minded Readers and
            Writers, Discover stories, thinking, and expertise from writers on
            any topic.
          </h3>
          <button type="button" className={styles.hero_btn}>
            <Link className={styles.li} href="/sign-up">
              Get Started
            </Link>
          </button>
        </div>
        <div className={styles.right__herosection}>
          <div className={styles.imgbox}>
            <Image
            className={styles.img}
              src="/images/andrew-neel-cckf4TsHAuw-unsplash.jpg"
              alt="backgroundimage"
              width={600}
              height={600}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

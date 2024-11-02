"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "../styles/hero.module.css";
import { TypeAnimation } from "react-type-animation";


// ... existing imports ...
import { useEffect, useState } from "react";

const Hero = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating((prev) => !prev);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.inner__herosection}>
        {/* ... left hero section ... */}
        <div className={styles.left__herosection}>
          <h1 className={styles.h1}>
            Curious to learn new things? okay! {' '}
             <TypeAnimation
            //   preRenderFirstString={true}
              sequence={[
                500,
                "READ ALONG...",

                1000,
                "READ ANYTHING...",

                1000,
                "READ ANYTIME...",

                1000,
                "REACH ANYONE...",

                1000,
               
              
              ]}
              speed={28}
              className={styles.h1}
              repeat={Infinity}
            />
          </h1>
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
          <div
            className={`${styles.imgbox} ${isAnimating ? styles.animate : ""}`}
          >
            <Image
              className={styles.img}
              src="/images/pexels-kaboompics-com-6469.jpg"
              alt="backgroundimage"
              width={570}
              height={350}
            />
          </div>
          <div
            className={`${styles.box2} ${isAnimating ? styles.animate : ""}`}
          >
            <Image
              src="/images/andrew-neel-cckf4TsHAuw-unsplash.jpg"
              className={styles.img}
              alt="second background image"
              width={570}
              height={350}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

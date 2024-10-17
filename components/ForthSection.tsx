"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../styles/forthsection.module.css";
import Link from "next/link";

const ForthSection = () => {
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef(null);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        },
        { threshold: 0.1 }
      );
  
      if (ref.current) {
        observer.observe(ref.current);
      }
  
      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [hasAnimated]);
  
    const variants = {
      hidden: { x: "-100%", opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" },
      },
    };
  return (
    <section className={styles.section} ref={ref}>
      <motion.div className={styles.inner_container}
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      variants={variants}>
        <div className={styles.leftbox}>
          <div className={styles.imgbox}>
            <Image
              className={styles.img}
              src="/images/pexels-justin-shaifer-1222271.jpg"
              alt="img"
              width={85}
              height={85}
            />
          </div>
          <div className={styles.imgbox}>
            <Image
              className={styles.img}
              src="/images/pexels-andrea-piacquadio-762020.jpg"
              alt="img"
              width={85}
              height={85}
            />
          </div>
          <div className={styles.imgbox}>
            <Image
              className={styles.img}
              src="/images/pexels-daniel-xavier-1239291.jpg"
              alt="img"
              width={85}
              height={85}
            />
          </div>
        </div>
        <div className={styles.rightbox}>
          <h1 className={styles.h1}>
            Write, read and connect with great minds on Read Along
          </h1>
          <p className={styles.p}>
            Share people your great ideas, and also read write-ups based on your
            interests. connect with people of same interests and goals
          </p>
          <button className={styles.button} type="button">
            <Link href='/sign-up'>
            Get Started
            </Link>
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default ForthSection;

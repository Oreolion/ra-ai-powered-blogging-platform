'use client'
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "@/styles/about.module.css";


const About = () => {
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
    <section ref={ref} className={styles.section}>
      <motion.div
        className={styles.inner__box}
        initial="hidden"
        animate={hasAnimated ? "visible" : "hidden"}
        variants={variants}
      >
        <div className={styles.leftbox}>
          <h1 className={styles.h1}>About The Read Along Blog...</h1>
          <p className={styles.p}>
            The Read Along Blog is a multi-functional platform where authors and
            readers can have access to their own content. It aims to be a
            traditional bookworm&apos;s heaven and a blog to get access to more text
            based content. Our vision is to foster an inclusive and vibrant
            community where diversity is celebrated. We encourage
            open-mindedness and respect for all individuals, regardless of their
            backgrounds or beliefs. By promoting dialogue and understanding, we
            strive to encourage learning and sharing of Knowledge and Ideas
            using our platform.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
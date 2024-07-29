import Image from "next/image";
import React from "react";
import styles from "../styles/forthsection.module.css";

const ForthSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.inner_container}>
        <div className={styles.leftbox}>
          <div className={styles.imgbox}>
            <Image
              className={styles.img}
              src="/images/pexels-justin-shaifer-1222271.jpg"
              alt="img"
              width={80}
              height={80}
            />
          </div>
          <div className={styles.imgbox}>
            <Image
              className={styles.img}
              src="/images/pexels-andrea-piacquadio-762020.jpg"
              alt="img"
              width={80}
              height={80}
            />
          </div>
          <div className={styles.imgbox}>
            <Image
              className={styles.img}
              src="/images/pexels-daniel-xavier-1239291.jpg"
              alt="img"
              width={80}
              height={80}
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
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default ForthSection;

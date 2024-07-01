import React from 'react'
import styles from '@/styles/about.module.css';

const About = () => {
  return (
    <section className={styles.section}>
    <div className={styles.inner__box}>
      <div className={styles.leftbox}>
        <h1 className={styles.h1}>About The Read Along Blog...</h1>
        <p className={styles.p}>
          The Read Along Blog is a multi-functional platform where authors and
          readers can have access to their own content. It aims to be a
          traditional bookworm’s heaven and a blog to get access to more text
          based content. Our vision is to foster an inclusive and vibrant
          community where diversity is celebrated. We encourage open-mindedness
          and respect for all individuals, regardless of their backgrounds or
          beliefs. By promoting dialogue and understanding, we strive
        </p>
      </div>
    </div>
  </section>  )
}

export default About
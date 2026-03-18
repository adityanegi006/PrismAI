import React from 'react'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <div className={styles.hero}>
      <h1 className={styles.heading}>
        Transform Video<br />
        Into <span className={styles.accent}>Content.</span>
      </h1>
      <p className={styles.sub}>
         Drop any YouTube URL and watch PrismAI dissect the transcript, extract key insights, and forge ready-to-publish content across every major platform — in seconds.
      </p>
    </div>
  )
}

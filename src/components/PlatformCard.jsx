import React from 'react'
import { PLATFORMS } from '../utils/constants'
import styles from './PlatformCard.module.css'

const LOADING_MESSAGES = [
  'Sending to webhook...',
  'Extracting video ID...',
  'Fetching metadata...',
  'Getting transcript...',
  'Generating content...',
]

export default function PlatformCard({
  selectedPlatforms,
  onToggle,
  onSubmit,
  isLoading,
}) {
  const [msgIdx, setMsgIdx] = React.useState(0)
  const intervalRef = React.useRef(null)

  React.useEffect(() => {
    if (isLoading) {
      setMsgIdx(0)
      intervalRef.current = setInterval(() => {
        setMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length)
      }, 1800)
    } else {
      clearInterval(intervalRef.current)
      setMsgIdx(0)
    }
    return () => clearInterval(intervalRef.current)
  }, [isLoading])

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Output Platforms</span>
      </div>

      <div className={styles.cardBody}>
        <label className={styles.label}>SELECT CONTENT TYPES TO GENERATE</label>
        <div className={styles.platforms}>
          {PLATFORMS.map((p) => {
            const active = selectedPlatforms.includes(p.value)
            return (
              <button
                key={p.value}
                type="button"
                className={`${styles.platformBtn} ${active ? styles.active : ''}`}
                onClick={() => onToggle(p.value)}
              >
                <span className={styles.platformIcon}>{p.icon}</span>
                {p.label}
                {active && <span className={styles.check}>✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.cardFooter}>
        <button
          className={`${styles.submitBtn} ${isLoading ? styles.loading : ''}`}
          onClick={onSubmit}
          disabled={isLoading}
          type="button"
        >
          {isLoading ? (
            <div className={styles.loadingContent}>
              <span className={styles.spinner} />
              <span
                key={msgIdx}
                className={styles.loadingMsg}
              >
                {LOADING_MESSAGES[msgIdx]}
              </span>
            </div>
          ) : (
            <>
              <span>Run Pipeline</span>
              <span className={styles.arrow}>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
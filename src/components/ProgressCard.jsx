import React from 'react'
import styles from './ProgressCard.module.css'

export default function ProgressCard({ steps, visible }) {
  if (!visible) return null

  const doneCount = steps.filter(s => s.status === 'done').length
  const total = steps.length
  const progress = Math.round((doneCount / total) * 100)

  return (
    <div className={styles.card}>
      {/* Header with progress bar */}
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>PIPELINE RUNNING</div>
        <div className={styles.progressBadge}>{progress}%</div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className={styles.steps}>
        {steps.map((step) => (
          <div key={step.id} className={`${styles.step} ${step.status === 'running' ? styles.stepActive : ''}`}>
            <div
              className={`${styles.indicator} ${
                step.status === 'done'
                  ? styles.done
                  : step.status === 'running'
                  ? styles.running
                  : ''
              }`}
            >
              {step.status === 'done'
                ? '✓'
                : step.status === 'running'
                ? <span className={styles.dot} />
                : String(step.id + 1).padStart(2, '0')}
            </div>

            <div className={styles.stepInfo}>
              <div className={styles.stepName}>{step.name}</div>
              <div className={styles.stepSub}>{step.sub}</div>
            </div>

            <div className={styles.stepTime}>
              {step.status === 'running' && (
                <div className={styles.pulseBar}>
                  <span /><span /><span />
                </div>
              )}
              {step.status === 'done' && (
                <span className={styles.elapsed}>{step.elapsed ?? ''}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

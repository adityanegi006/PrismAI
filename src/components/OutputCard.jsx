import React, { useState, useEffect } from 'react'
import { formatLabel, copyToClipboard } from '../utils/helpers'
import styles from './OutputCard.module.css'

export default function OutputCard({ results, onReset }) {
  const [activeTab, setActiveTab] = useState(null)
  const [copiedKey, setCopiedKey] = useState(null)
  const [copiedAll, setCopiedAll] = useState(false)

  // Keys to exclude from tabs (shown separately)
  const EXCLUDED_FROM_TABS = ['key_topics', 'summary', 'key_insights' , '_id' , 'id' ,'youtube_url']

  const keys = results
    ? Object.keys(results).filter((k) => {
        if (EXCLUDED_FROM_TABS.includes(k)) return false
        const v = results[k]
        if (Array.isArray(v)) return v.length > 0
        if (typeof v === 'string') return v.trim().length > 0
        return false
      })
    : []

  useEffect(() => {
    if (keys.length > 0) setActiveTab(keys[0])
  }, [results])

  if (!results) return null

  const getValue = (key) => {
    const val = results[key]
    if (Array.isArray(val)) {
      return val.map((item) => {
        if (typeof item === 'string') return item
        return JSON.stringify(item)
      }).join('\n\n')
    }
    return val
  }

  const handleCopy = (key) => {
    copyToClipboard(getValue(key)).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    })
  }

  const handleCopyAll = () => {
    const text = keys.map((k) => `--- ${formatLabel(k)} ---\n${getValue(k)}`).join('\n\n')
    copyToClipboard(text).then(() => {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    })
  }

  const keyTopics = results?.key_topics
  const summary = results?.summary
  const keyInsights = results?.key_insights

  return (
    <div>
      {/* ── Key Info Strip ───────────────────────────────── */}
      {(summary || keyTopics || keyInsights) && (
        <div className={styles.infoStrip}>

          {/* Summary */}
          {summary && (
            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>SUMMARY</div>
              <p className={styles.infoText}>{summary}</p>
            </div>
          )}

          {/* Key Topics */}
          {keyTopics && keyTopics.length > 0 && (
            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>KEY TOPICS</div>
              <div className={styles.topicPills}>
                {keyTopics.map((topic, i) => (
                  <span key={i} className={styles.topicPill}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Insights */}
          {keyInsights && keyInsights.length > 0 && (
            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>KEY INSIGHTS</div>
              <ul className={styles.insightList}>
                {keyInsights.map((insight, i) => (
                  <li key={i} className={styles.insightItem}>
                    <span className={styles.insightDot}>→</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

      {/* ── Tabbed Content ───────────────────────────────── */}
      {keys.length > 0 && (
        <div className={styles.card}>
          <div className={styles.outputHeader}>
            <div className={styles.tabs}>
              {keys.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`${styles.tab} ${activeTab === k ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(k)}
                >
                  {formatLabel(k)}
                </button>
              ))}
            </div>
            <div className={styles.actions}>
              <button className={styles.actionBtn} type="button" onClick={handleCopyAll}>
                {copiedAll ? '✓ Copied!' : '⎘ Copy All'}
              </button>
              <button className={styles.actionBtn} type="button" onClick={onReset}>
                ↺ New
              </button>
            </div>
          </div>

          <div className={styles.outputContent}>
            {keys.map((k) => (
              <div
                key={k}
                className={`${styles.panel} ${activeTab === k ? styles.panelActive : ''}`}
              >
                <div className={styles.contentBlock}>
                  <div className={styles.blockLabel}>{formatLabel(k)}</div>
                  <pre className={styles.contentText}>{getValue(k)}</pre>
                  <button
                    className={styles.copyBlock}
                    type="button"
                    onClick={() => handleCopy(k)}
                  >
                    {copiedKey === k ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

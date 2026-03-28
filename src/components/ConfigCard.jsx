import React from 'react'
import styles from './ConfigCard.module.css'

export default function ConfigCard({
  webhookUrl,
  onWebhookChange,
  videoUrl,
  onVideoChange,
  error,
  onErrorDismiss,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Configuration</span>
        <span className={styles.cardBadge}>n8n Webhook</span>
      </div>

      <div className={styles.cardBody}>
        {/* Webhook URL - Static Display */}
        <div className={styles.field}>
          <label className={styles.label}>WEBHOOK URL</label>
          <div className={styles.input} style={{ opacity: 0.6, cursor: 'default', userSelect: 'none' }}>
            {webhookUrl}
          </div>
        </div>

        <hr className={styles.divider} />

        {/* YouTube URL */}
        <div className={styles.field}>
          <label className={styles.label}>YOUTUBE VIDEO URL</label>
          <div className={styles.urlWrapper}>
            <span className={styles.urlPrefix}>youtube.com/</span>
            <input
              className={styles.urlInput}
              type="text"
              value={videoUrl}
              onChange={(e) => onVideoChange(e.target.value)}
              placeholder="watch?v=dQw4w9WgXcQ  or full URL"
              spellCheck={false}
            />
            {videoUrl && (
              <button
                className={styles.urlClear}
                onClick={() => onVideoChange('')}
                title="Clear"
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className={styles.errorMsg} onClick={onErrorDismiss}>
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

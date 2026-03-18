import React, { useState, useRef, useEffect } from 'react'
import styles from './CreatorPage.module.css'

const LOADING_MESSAGES = [
  'Extracting topics...',
  'Searching Tavily web...',
  'Combining research...',
  'Analyzing strategies...',
  'Building your action plan...',
]

export default function CreatorPage({
  webhookUrl, updateWebhookUrl,
  videoUrl, setVideoUrl,
  topics, topicInput, setTopicInput, addTopic, removeTopic,
  isLoading, error, setError, results, resetResults,
  submit,
}) {

  const [msgIdx, setMsgIdx] = useState(0)
  const intervalRef = useRef(null)
  const resultsRef = useRef(null)

  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [results])

  useEffect(() => {
    if (isLoading) {
      setMsgIdx(0)
      intervalRef.current = setInterval(() => {
        setMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length)
      }, 2500)
    } else {
      clearInterval(intervalRef.current)
      setMsgIdx(0)
    }
    return () => clearInterval(intervalRef.current)
  }, [isLoading])

  const handleTopicKeyDown = (e) => {
    if (e.key === 'Enter') addTopic(topicInput)
  }

  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        <h1 className={styles.heading}>
          Analyze. Strategize.<br />
          <span className={styles.accent}>Create.</span>
        </h1>
        <p className={styles.sub}>
           Feed in your niche topics and let PrismAI scour YouTube, Twitter, and Reddit to surface what's winning — then reverse-engineer the strategy so you can build something better.
        </p>
      </div>

      {/* Config Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Configuration</span>
          <span className={styles.cardBadge}>Creator Webhook</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.field}>
            <label className={styles.label}>CREATOR MODE WEBHOOK URL</label>
            <input
              className={styles.input}
              type="url"
              value={webhookUrl}
              onChange={(e) => updateWebhookUrl(e.target.value)}
              placeholder="https://your-n8n.app.n8n.cloud/webhook/creator-mode"
              spellCheck={false}
            />
          </div>

          <hr className={styles.divider} />
        </div>
      </div>

      {/* Topics Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Key Topics</span>
          <span className={styles.cardBadge}>Manual or Auto</span>
        </div>
        <div className={styles.cardBody}>
          <label className={styles.label}>ADD TOPICS TO RESEARCH</label>
          <div className={styles.topicInputRow}>
            <input
              className={styles.topicInput}
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={handleTopicKeyDown}
              placeholder="e.g. AI agents, prompt engineering..."
              spellCheck={false}
            />
            <button
              className={styles.addBtn}
              onClick={() => addTopic(topicInput)}
              type="button"
              disabled={!topicInput.trim()}
            >
              + Add
            </button>
          </div>

          {topics.length > 0 && (
            <div className={styles.topicPills}>
              {topics.map((t) => (
                <span key={t} className={styles.topicPill}>
                  {t}
                  <button
                    className={styles.pillRemove}
                    onClick={() => removeTopic(t)}
                    type="button"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}

         
        </div>

        {/* Resource Types */}
        <div className={styles.cardBody} style={{ paddingTop: 0 }}>
          <label className={styles.label}>SEARCHING ACROSS</label>
          <div className={styles.resourceTypes}>
            <div className={styles.resourceChip}>▶ YouTube Videos</div>
            <div className={styles.resourceChip}>𝕏 Twitter Threads</div>
            <div className={styles.resourceChip}>◈ Reddit Posts</div>
          </div>
        </div>

        {error && (
          <div className={styles.cardBody} style={{ paddingTop: 0 }}>
            <div className={styles.errorMsg} onClick={() => setError(null)}>
              <span>⚠</span><span>{error}</span>
            </div>
          </div>
        )}

        <div className={styles.cardFooter}>
          <button
            className={`${styles.submitBtn} ${isLoading ? styles.loading : ''}`}
            onClick={submit}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? (
              <div className={styles.loadingContent}>
                <span className={styles.spinner} />
                <span key={msgIdx} className={styles.loadingMsg}>
                  {LOADING_MESSAGES[msgIdx]}
                </span>
              </div>
            ) : (
              <><span>Analyze & Strategize</span><span className={styles.arrow}>→</span></>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div ref={resultsRef}>
          <CreatorResults results={results} onReset={resetResults} />
        </div>
      )}
    </div>
  )
}

function CreatorResults({ results, onReset }) {
  const resources     = results?.resources     || []
  const strategies    = results?.strategies    || []
  const opportunities = results?.opportunities || []
  const topics        = results?.topics        || []

  return (
    <div className={styles.resultsSection}>

      {topics.length > 0 && (
        <div className={styles.resultCard}>
          <div className={styles.resultLabel}>TOPICS ANALYZED</div>
          <div className={styles.topicPills}>
            {topics.map((t, i) => (
              <span key={i} className={styles.topicPill}>{t}</span>
            ))}
          </div>
        </div>
      )}

      {resources.length > 0 && (
        <div className={styles.resultCard}>
          <div className={styles.resultLabel}>TOP RESOURCES FOUND</div>
          <div className={styles.resourceList}>
            {resources.map((r, i) => (
              <div key={i} className={styles.resourceItem}>
                <div className={styles.resourceMeta}>
                  <span className={styles.resourceType}>{r.type}</span>
                  <span className={styles.resourceEngagement}>{r.engagement}</span>
                </div>
                <div className={styles.resourceTitle}>{r.title}</div>
                <div className={styles.resourceDesc}>{r.description}</div>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
                    View Resource →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {strategies.length > 0 && (
        <div className={styles.resultCard}>
          <div className={styles.resultLabel}>STRATEGY BREAKDOWN</div>
          <div className={styles.strategyList}>
            {strategies.map((s, i) => (
              <div key={i} className={styles.strategyItem}>
                <div className={styles.strategyTitle}>
                  <span className={styles.strategyNum}>{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </div>
                <div className={styles.strategyDesc}>{s.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {opportunities.length > 0 && (
        <div className={styles.resultCard}>
          <div className={styles.resultLabel}>HOW TO LEVERAGE & CREATE YOUR OWN</div>
          <div className={styles.opportunityList}>
            {opportunities.map((o, i) => (
              <div key={i} className={styles.opportunityItem}>
                <div className={styles.opportunityTitle}>
                  <span className={styles.opportunityIcon}>✦</span>
                  {o.title}
                </div>
                <div className={styles.opportunityDesc}>{o.description}</div>
                {o.action && (
                  <div className={styles.opportunityAction}>
                    <span className={styles.actionLabel}>YOUR MOVE →</span>
                    {o.action}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button className={styles.resetBtn} onClick={onReset} type="button">
        ↺ Start New Research
      </button>
    </div>
  )
}
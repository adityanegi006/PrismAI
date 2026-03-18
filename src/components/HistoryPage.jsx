import React, { useState, useEffect, useCallback } from 'react'
import styles from './HistoryPage.module.css'

const LS_WEBHOOK_SUMMARY  = 'prism_webhook'
const LS_WEBHOOK_CREATOR  = 'prism_creator_webhook'
const LS_WEBHOOK_ACADEMIA = 'prism_academia_webhook'

const TABS = [
  { id: 'summary',  label: 'PrismAI',   icon: '✦', color: '#ff4d6d' },
  { id: 'creator',  label: 'Creator',   icon: '◈', color: '#ff4d6d' },
  { id: 'academia', label: 'Academia',  icon: '⊛', color: '#ff4d6d' },
]
function deriveHistoryUrl(webhookUrl, type) {
  if (!webhookUrl) return null
  try {
    const url = new URL(webhookUrl)
    const base = `${url.protocol}//${url.host}`
    const pathMap = {
      summary:  'history-youtube-summary',
      creator:  'history-creator',
      academia: 'history-academia',
    }
    const isTest = url.pathname.includes('webhook-test')
      ? 'webhook-test'
      : 'webhook'
    return `${base}/${isTest}/${pathMap[type]}`
  } catch {
    return null
  }
}

function SummaryCard({ item, onLoad }) {
  return (
    <div className={styles.card} onClick={() => onLoad('summary', item)}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}>✦</span>
        <span className={styles.cardType}>PrismAI Summary</span>
        <span className={styles.cardId}>#{item._id?.slice(-6)}</span>
      </div>
      <p className={styles.cardUrl}>{item.youtube_url || 'No URL saved'}</p>
      <p className={styles.cardPreview}>
        {item.summary?.slice(0, 120) || 'No summary available'}...
      </p>
      <div className={styles.cardFooter}>
        {item.twitter_thread && <span className={styles.tag}>𝕏 Thread</span>}
        {item.linkedin_post  && <span className={styles.tag}>in Post</span>}
      </div>
    </div>
  )
}

function CreatorCard({ item, onLoad }) {
  return (
    <div className={styles.card} onClick={() => onLoad('creator', item)} style={{ '--card-accent': '#0ea5e9' }}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon} style={{ color: '#0ea5e9' }}>◈</span>
        <span className={styles.cardType}>Creator Mode</span>
        <span className={styles.cardId}>#{item._id?.slice(-6)}</span>
      </div>
      <p className={styles.cardUrl}>
        {item.youtube_url && item.youtube_url.trim() !== ''
          ? item.youtube_url
          : `Topic search: ${item.topics?.join(', ') || 'No topics'}`}
      </p>
      <div className={styles.cardFooter}>
        {item.topics?.slice(0, 3).map((t, i) => (
          <span key={i} className={styles.tag} style={{ borderColor: '#0ea5e955', color: '#0ea5e9' }}>
            {t}
          </span>
        ))}
        {item.resources?.length > 0 && (
          <span className={styles.tag} style={{ borderColor: '#0ea5e955', color: '#0ea5e9' }}>
            {item.resources.length} resources
          </span>
        )}
      </div>
    </div>
  )
}

function AcademiaCard({ item, onLoad }) {
  return (
    <div className={styles.card} onClick={() => onLoad('academia', item)} style={{ '--card-accent': '#c0c0c0' }}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon} style={{ color: '#c0c0c0' }}>⊛</span>
        <span className={styles.cardType}>Academia</span>
        <span className={styles.cardId}>#{item._id?.slice(-6)}</span>
      </div>
      <p className={styles.cardUrl}>{item.youtube_url || 'No URL saved'}</p>
      <p className={styles.cardPreview}>
        {item.summary?.slice(0, 120) || 'No summary available'}...
      </p>
      <div className={styles.cardFooter}>
        {item.flashcards?.length > 0 && (
          <span className={styles.tag} style={{ borderColor: '#c0c0c044', color: '#c0c0c0' }}>
            {item.flashcards.length} flashcards
          </span>
        )}
        {item.key_notes?.length > 0 && (
          <span className={styles.tag} style={{ borderColor: '#c0c0c044', color: '#c0c0c0' }}>
            {item.key_notes.length} notes
          </span>
        )}
      </div>
    </div>
  )
}

export default function HistoryPage({ onLoad }) {
  const [activeTab, setActiveTab] = useState('summary')
  const [data, setData]           = useState({ summary: [], creator: [], academia: [] })
  const [loading, setLoading]     = useState({ summary: false, creator: false, academia: false })
  const [error, setError]         = useState({ summary: null, creator: null, academia: null })

  const fetchHistory = useCallback(async (type) => {
    const webhookMap = {
      summary:  localStorage.getItem(LS_WEBHOOK_SUMMARY),
      creator:  localStorage.getItem(LS_WEBHOOK_CREATOR),
      academia: localStorage.getItem(LS_WEBHOOK_ACADEMIA),
    }

    const historyUrl = deriveHistoryUrl(webhookMap[type], type)

    if (!historyUrl) {
      setError(prev => ({ ...prev, [type]: 'No webhook URL configured. Please set it in the respective mode first.' }))
      return
    }

    setLoading(prev => ({ ...prev, [type]: true }))
    setError(prev => ({ ...prev, [type]: null }))

    try {
      const res = await fetch(historyUrl)
      if (!res.ok) throw new Error(`Server responded with ${res.status}`)
      const text = await res.text()
      if (!text || text.trim() === '') {
        setData(prev => ({ ...prev, [type]: [] }))
        return
      }
      const json = JSON.parse(text)
      const items = Array.isArray(json) ? json : [json]
      setData(prev => ({ ...prev, [type]: items }))
    } catch (err) {
      setError(prev => ({ ...prev, [type]: `Failed to load: ${err.message}` }))
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }))
    }
  }, [])

  useEffect(() => {
    fetchHistory(activeTab)
  }, [activeTab])

  const tab = TABS.find(t => t.id === activeTab)
  const items = data[activeTab]
  const isLoading = loading[activeTab]
  const err = error[activeTab]

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Generation History</h1>
        <p className={styles.subtitle}> Every generation, preserved. Revisit past analyses, reload results instantly, and pick up exactly where you left off — your entire research history, one click away.</p>
      </div>

      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
            style={activeTab === t.id ? { color: t.color, borderColor: t.color + '55', background: t.color + '11' } : {}}
            onClick={() => setActiveTab(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
        <button
          className={styles.refreshBtn}
          onClick={() => fetchHistory(activeTab)}
          disabled={isLoading}
        >
          {isLoading ? '...' : '↻ Refresh'}
        </button>
      </div>

      {isLoading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading history...</p>
        </div>
      )}

      {err && !isLoading && (
        <div className={styles.errorState}>
          <p>⚠ {err}</p>
        </div>
      )}

      {!isLoading && !err && items.length === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>{tab.icon}</p>
          <p>No {tab.label} generations yet.</p>
          <p className={styles.emptyHint}>Run a workflow to see results here.</p>
        </div>
      )}

      {!isLoading && !err && items.length > 0 && (
        <div className={styles.grid}>
          {items.map((item, i) => (
            activeTab === 'summary'  ? <SummaryCard  key={i} item={item} onLoad={onLoad} /> :
            activeTab === 'creator'  ? <CreatorCard  key={i} item={item} onLoad={onLoad} /> :
                                       <AcademiaCard key={i} item={item} onLoad={onLoad} />
          ))}
        </div>
      )}
    </div>
  )
}
import React from 'react'
import styles from './Header.module.css'

const MODES = [
  { id: 'creator', label: 'Creator',  icon: '◈' },
  { id: 'academia',label: 'Academia', icon: '⊛' },
  { id: 'prism',   label: 'PrismAI',  icon: '✦' },
  { id: 'history', label: 'History',  icon: '◷' },
]

const MODE_COLORS = {
  prism:    { accent: '#00e87a', bg: '#00e87a14', border: '#00e87a40' },
  creator:  { accent: '#0ea5e9', bg: '#0ea5e914', border: '#0ea5e940' },
  academia: { accent: '#c0c0c0', bg: '#c0c0c010', border: '#c0c0c038' },
  history:  { accent: '#ff4d6d', bg: '#ff4d6d12', border: '#ff4d6d40' },
}

export default function Header({ mode, onToggle, transitioning }) {
  const color = MODE_COLORS[mode]

  return (
    <header className={styles.header}>

      {/* Logo */}
      <div className={styles.logo}>
        <div
          className={styles.logoMark}
          style={{ background: 'transparent', borderRadius: 0, overflow: 'visible' }}
        >
          <svg width="48" height="42" viewBox="0 0 48 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={color.accent} stopOpacity="0.3"  />
                <stop offset="50%"  stopColor={color.accent} stopOpacity="0.08" />
                <stop offset="100%" stopColor={color.accent} stopOpacity="0.0"  />
              </linearGradient>
            </defs>

            {/* Bar backgrounds */}
            <rect x="2"  y="12" width="5" height="18" rx="2.5" fill="url(#barGrad)" />
            <rect x="13" y="6"  width="5" height="30" rx="2.5" fill="url(#barGrad)" />
            <rect x="24" y="1"  width="5" height="40" rx="2.5" fill="url(#barGrad)" />

            {/* Bar outlines */}
            <rect x="2"  y="12" width="5" height="18" rx="2.5" fill="none" stroke={color.accent} strokeWidth="0.6" strokeOpacity="0.3" />
            <rect x="13" y="6"  width="5" height="30" rx="2.5" fill="none" stroke={color.accent} strokeWidth="0.6" strokeOpacity="0.3" />
            <rect x="24" y="1"  width="5" height="40" rx="2.5" fill="none" stroke={color.accent} strokeWidth="0.6" strokeOpacity="0.3" />

            {/* Glowing sine wave */}
            <path
              d="M0 21 Q5 10 10 21 Q15 32 20 21 Q25 10 30 21 Q35 32 40 21 Q44 14 48 18"
              stroke={color.accent}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              filter="url(#glow)"
              opacity="0.9"
            />

            {/* Second wave layer for extra glow depth */}
            <path
              d="M0 21 Q5 10 10 21 Q15 32 20 21 Q25 10 30 21 Q35 32 40 21 Q44 14 48 18"
              stroke={color.accent}
              strokeWidth="0.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
            />
          </svg>
        </div>

        <span className={styles.logoText}>
          Prism
          <span style={{ color: color.accent, transition: 'color 0.5s ease' }}>AI</span>
        </span>
      </div>

      {/* Right side */}
      <div className={styles.headerRight}>

        {/* Toggle */}
        <div
          className={styles.modeToggle}
          style={{
            borderColor: 'var(--border2)',
            background: 'var(--surface2)',
            transition: 'all 0.4s ease',
            opacity: transitioning ? 0.6 : 1,
          }}
        >
          <div className={styles.toggleTrack}>
            {MODES.map((m) => (
              <button
                key={m.id}
                className={styles.toggleOption}
                style={{
                  color:      mode === m.id ? color.accent            : 'var(--muted)',
                  background: mode === m.id ? color.bg                : 'transparent',
                  border:     mode === m.id ? `1px solid ${color.border}` : '1px solid transparent',
                  borderRadius: '100px',
                  transition: 'all 0.3s ease',
                  cursor: transitioning ? 'not-allowed' : 'pointer',
                }}
                onClick={() => !transitioning && onToggle(m.id)}
                type="button"
                disabled={transitioning}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status pill */}
        <div
          className={styles.statusPill}
          style={{
            background:  color.bg,
            borderColor: color.border,
            color:       color.accent,
            transition:  'all 0.5s ease',
          }}
        >
          <span
            className={styles.statusDot}
            style={{ background: color.accent, transition: 'background 0.5s ease' }}
          />
          {mode === 'prism'
            ? 'PIPELINE READY'
            : mode === 'creator'
            ? 'CREATOR MODE'
            : mode === 'academia'
            ? 'ACADEMIA MODE'
            : 'HISTORY'}
        </div>

      </div>
    </header>
  )
}
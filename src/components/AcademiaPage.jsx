import React, { useRef, useEffect, useState } from 'react'
import styles from './AcademiaPage.module.css'

export default function AcademiaPage({
  webhookUrl, updateWebhookUrl,
  videoUrl, setVideoUrl,
  isLoading, loadingMsg, loadingMessages,
  error, setError, results, resetResults,
  activeFeature, setActiveFeature,
  teachInput, setTeachInput,
  teachFeedback, teachLoading,
  submitTeachBack,
  submit,
}) {

  const resultsRef = useRef(null)

  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [results])

  const FEATURES = [
    { id: 'notes',     label: 'Key Notes',         icon: '✦' },
    { id: 'flashcards',label: 'Flashcards',         icon: '⊞' },
    { id: 'mindmap',   label: 'Mind Map',           icon: '◎' },
    { id: 'teach',     label: 'Teach Me Back',      icon: '◈' },
    { id: 'prereq',    label: 'Pre-Req Radar',      icon: '⊛' },
    { id: 'confusion', label: 'Confusion Detector', icon: '⚡' },
  ]

  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        <h1 className={styles.heading}>
          Extract.<br />
          Understand.<br />
          <span className={styles.accent}>Master.</span>
        </h1>
        <p className={styles.sub}>
          Your YouTube history is full of videos you barely remember. PrismAI extracts everything worth knowing — notes, flashcards, mind maps, and comprehension checks — from any educational video, instantly. Learn it once. Remember it forever.
        </p>
      </div>

      {/* Config Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Configuration</span>
          <span className={styles.cardBadge}>Academia Webhook</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.field}>
            <label className={styles.label}>ACADEMIA WEBHOOK URL</label>
            <input
              className={styles.input}
              type="url"
              value={webhookUrl}
              onChange={(e) => updateWebhookUrl(e.target.value)}
              placeholder="https://your-n8n.app.n8n.cloud/webhook/academia"
              spellCheck={false}
            />
          </div>
          <hr className={styles.divider} />
          <div className={styles.field}>
            <label className={styles.label}>YOUTUBE VIDEO URL</label>
            <div className={styles.urlWrapper}>
              <span className={styles.urlPrefix}>youtube.com/</span>
              <input
                className={styles.urlInput}
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && submit()}
                placeholder="watch?v=... paste any educational video"
                spellCheck={false}
              />
              {videoUrl && (
                <button className={styles.urlClear} onClick={() => setVideoUrl('')} type="button">✕</button>
              )}
            </div>
          </div>
          {error && (
            <div className={styles.errorMsg} onClick={() => setError(null)}>
              <span>⚠</span><span>{error}</span>
            </div>
          )}
        </div>
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
                <span key={loadingMsg} className={styles.loadingMsg}>
                  {loadingMessages[loadingMsg]}
                </span>
              </div>
            ) : (
              <><span>Generate Study Materials</span><span className={styles.arrow}>→</span></>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div ref={resultsRef}>
          {/* Summary strip */}
          {results.summary && (
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>VIDEO SUMMARY</div>
              <p className={styles.summaryText}>{results.summary}</p>
              <button className={styles.resetBtn} onClick={resetResults} type="button">↺ New Video</button>
            </div>
          )}

          {/* Feature tabs */}
          <div className={styles.featureTabs}>
            {FEATURES.map(f => (
              <button
                key={f.id}
                className={`${styles.featureTab} ${activeFeature === f.id ? styles.featureTabActive : ''}`}
                onClick={() => setActiveFeature(f.id)}
                type="button"
              >
                <span className={styles.featureIcon}>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          {/* Feature panels */}
          <div className={styles.featurePanel}>

            {/* Key Notes */}
            {activeFeature === 'notes' && results.key_notes && (
              <div className={styles.notesGrid}>
                {results.key_notes.map((note, i) => (
                  <div key={i} className={`${styles.noteCard} ${styles[`importance_${note.importance}`]}`}>
                    <div className={styles.noteHeader}>
                      <span className={styles.noteTopic}>{note.topic}</span>
                      <span className={`${styles.importanceBadge} ${styles[`badge_${note.importance}`]}`}>
                        {note.importance}
                      </span>
                    </div>
                    <p className={styles.noteText}>{note.note}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Flashcards */}
            {activeFeature === 'flashcards' && results.flashcards && (
              <FlashcardDeck cards={results.flashcards} styles={styles} />
            )}

            {/* Mind Map */}
            {activeFeature === 'mindmap' && results.mind_map && (
              <div className={styles.mindMap}>
                <div className={styles.mindMapCenter}>
                  {results.mind_map.central_topic}
                </div>
                <div className={styles.mindMapBranches}>
                  {results.mind_map.branches?.map((branch, i) => (
                    <div key={i} className={styles.mindMapBranch}>
                      <div className={styles.branchName}>{branch.name}</div>
                      <div className={styles.subtopics}>
                        {branch.subtopics?.map((sub, j) => (
                          <span key={j} className={styles.subtopic}>{sub}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teach Me Back */}
            {activeFeature === 'teach' && results.teach_me_back && (
              <div className={styles.teachSection}>
                <div className={styles.teachPromptCard}>
                  <div className={styles.teachLabel}>YOUR CHALLENGE</div>
                  <p className={styles.teachPrompt}>{results.teach_me_back.prompt}</p>
                  <div className={styles.teachHints}>
                    <div className={styles.teachHintLabel}>KEY POINTS TO COVER</div>
                    <div className={styles.teachHintList}>
                      {results.teach_me_back.key_points_to_cover?.map((p, i) => (
                        <span key={i} className={styles.teachHintPill}>{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.teachInputSection}>
                  <label className={styles.label}>YOUR EXPLANATION</label>
                  <textarea
                    className={styles.teachTextarea}
                    value={teachInput}
                    onChange={(e) => setTeachInput(e.target.value)}
                    placeholder="Explain the concept in your own words..."
                    rows={6}
                  />
                  <button
                    className={styles.teachSubmitBtn}
                    onClick={() => submitTeachBack(results.teach_me_back.key_points_to_cover)}
                    disabled={teachLoading || !teachInput.trim()}
                    type="button"
                  >
                    {teachLoading ? 'Evaluating...' : 'Submit for Grading →'}
                  </button>
                </div>
                {teachFeedback && (
                  <div className={styles.teachFeedback}>
                    <div className={styles.teachScore}>
                      <span className={styles.scoreNum}>{teachFeedback.score}</span>
                      <span className={styles.scoreGrade}>{teachFeedback.grade}</span>
                    </div>
                    <p className={styles.feedbackText}>{teachFeedback.feedback}</p>
                    {teachFeedback.missed?.length > 0 && (
                      <div className={styles.missedSection}>
                        <div className={styles.missedLabel}>POINTS TO REVIEW</div>
                        {teachFeedback.missed.map((m, i) => (
                          <div key={i} className={styles.missedItem}>→ {m}</div>
                        ))}
                      </div>
                    )}
                    <div className={styles.suggestionBox}>
                      <span className={styles.suggestionLabel}>IMPROVE →</span>
                      {teachFeedback.suggestion}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pre-Req Radar */}
            {activeFeature === 'prereq' && results.prereq_radar && (
              <div className={styles.prereqSection}>
                <div className={styles.prereqList}>
                  {results.prereq_radar.prerequisites?.map((p, i) => (
                    <div key={i} className={styles.prereqItem}>
                      <div className={styles.prereqHeader}>
                        <span className={styles.prereqTopic}>{p.topic}</span>
                        <span className={`${styles.diffBadge} ${styles[`diff_${p.difficulty}`]}`}>
                          {p.difficulty}
                        </span>
                      </div>
                      <p className={styles.prereqReason}>{p.reason}</p>
                    </div>
                  ))}
                </div>
                {results.prereq_radar.recommended_order && (
                  <div className={styles.learningPath}>
                    <div className={styles.pathLabel}>RECOMMENDED LEARNING PATH</div>
                    <div className={styles.pathSteps}>
                      {results.prereq_radar.recommended_order.map((step, i) => (
                        <div key={i} className={styles.pathStep}>
                          <span className={styles.pathNum}>{String(i + 1).padStart(2, '0')}</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confusion Detector */}
            {activeFeature === 'confusion' && results.confusion_detector && (
              <div className={styles.confusionList}>
                {results.confusion_detector.map((c, i) => (
                  <div key={i} className={styles.confusionItem}>
                    <div className={styles.confusionHeader}>
                      <span className={styles.confusionNum}>⚡ {String(i + 1).padStart(2, '0')}</span>
                      <span className={styles.confusionTimestamp}>{c.timestamp_hint}</span>
                    </div>
                    <div className={styles.confusionConcept}>{c.confusing_concept}</div>
                    <div className={styles.confusionWhy}>
                      <span className={styles.confusionWhyLabel}>WHY IT'S CONFUSING</span>
                      <p>{c.why_confusing}</p>
                    </div>
                    <div className={styles.confusionClearer}>
                      <span className={styles.confusionClearerLabel}>CLEARER EXPLANATION</span>
                      <p>{c.clearer_explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function FlashcardDeck({ cards, styles }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState([])
  const [review, setReview] = useState([])

  const card = cards[currentIdx]

  const next = (status) => {
    if (status === 'known') setKnown(prev => [...prev, currentIdx])
    else setReview(prev => [...prev, currentIdx])
    setFlipped(false)
    setTimeout(() => {
      if (currentIdx < cards.length - 1) setCurrentIdx(prev => prev + 1)
    }, 200)
  }

  const reset = () => {
    setCurrentIdx(0)
    setFlipped(false)
    setKnown([])
    setReview([])
  }

  if (currentIdx >= cards.length) {
    return (
      <div className={styles.flashcardDone}>
        <div className={styles.doneScore}>
          <span className={styles.doneNum}>{known.length}</span>
          <span className={styles.doneLabel}>Known</span>
        </div>
        <div className={styles.doneDivider}>vs</div>
        <div className={styles.doneScore}>
          <span className={styles.doneNum}>{review.length}</span>
          <span className={styles.doneLabel}>Review</span>
        </div>
        <button className={styles.resetDeckBtn} onClick={reset} type="button">
          ↺ Restart Deck
        </button>
      </div>
    )
  }

  return (
    <div className={styles.flashcardSection}>
      <div className={styles.flashcardProgress}>
        <span className={styles.progressText}>{currentIdx + 1} / {cards.length}</span>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${((currentIdx) / cards.length) * 100}%` }} />
        </div>
        <span className={`${styles.diffChip} ${styles[`diff_${card.difficulty}`]}`}>{card.difficulty}</span>
      </div>

      <div
        className={`${styles.flashcard} ${flipped ? styles.flipped : ''}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className={styles.flashcardInner}>
          <div className={styles.flashcardFront}>
            <div className={styles.flashcardSide}>Q</div>
            <p className={styles.flashcardText}>{card.question}</p>
            <div className={styles.tapHint}>tap to reveal answer</div>
          </div>
          <div className={styles.flashcardBack}>
            <div className={styles.flashcardSide}>A</div>
            <p className={styles.flashcardText}>{card.answer}</p>
          </div>
        </div>
      </div>

      {flipped && (
        <div className={styles.flashcardActions}>
          <button className={styles.reviewBtn} onClick={() => next('review')} type="button">
            ↺ Need Review
          </button>
          <button className={styles.knownBtn} onClick={() => next('known')} type="button">
            ✓ Got It
          </button>
        </div>
      )}
    </div>
  )
}
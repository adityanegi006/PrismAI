import React, { useEffect, useRef, useState } from 'react'
import { usePipeline } from './hooks/usePipeline'
import { useCreator } from './hooks/useCreator'
import { useAcademia } from './hooks/useAcademia'
import Header from './components/Header'
import Hero from './components/Hero'
import PipelineVisualizer from './components/PipelineVisualizer'
import ConfigCard from './components/ConfigCard'
import PlatformCard from './components/PlatformCard'
import ProgressCard from './components/ProgressCard'
import OutputCard from './components/OutputCard'
import CreatorPage from './components/CreatorPage'
import AcademiaPage from './components/AcademiaPage'
import HistoryPage from './components/HistoryPage'
import styles from './App.module.css'

export default function App() {
  const [mode, setMode] = useState('creator')
  const [displayMode, setDisplayMode] = useState('creator')
  const [transitioning, setTransitioning] = useState(false)

  const pipeline = usePipeline()
  const creator = useCreator()
  const academia = useAcademia()

  const {
    webhookUrl, updateWebhookUrl,
    videoUrl, setVideoUrl,
    selectedPlatforms, togglePlatform,
    isLoading, activeNode, steps, showProgress, error, setError, results,
    submit, resetResults,
  } = pipeline

  const outputRef = useRef(null)
  const pageRef = useRef(null)

  useEffect(() => {
    if (results && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [results])

  const handleVideoKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) submit()
  }

  const handleToggle = (nextMode) => {
    if (nextMode === mode) return
    if (pageRef.current) {
      pageRef.current.style.opacity = '0'
      pageRef.current.style.transform = 'translateY(8px)'
    }
    setTimeout(() => {
      setMode(nextMode)
      setDisplayMode(nextMode)
      window.scrollTo({ top: 0, behavior: 'instant' })
      if (pageRef.current) {
        pageRef.current.style.opacity = '1'
        pageRef.current.style.transform = 'translateY(0)'
      }
    }, 200)
  }

  const handleLoadFromHistory = (type, item) => {
  if (type === 'creator') {
    creator.loadFromHistory(item)
    handleToggle('creator')
  } else if (type === 'academia') {
    academia.loadFromHistory(item)
    handleToggle('academia')
  } else if (type === 'summary') {
    pipeline.loadFromHistory(item)
    handleToggle('prism')
  }
}

  return (
    <div className={styles.container}>
      <Header mode={mode} onToggle={handleToggle} transitioning={transitioning} />

      <div
        ref={pageRef}
        style={{
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          opacity: 1,
          transform: 'translateX(0)',
        }}
      >
        {displayMode === 'prism' && (
          <>
            <Hero />
            <PipelineVisualizer activeNode={activeNode} />
            <ConfigCard
              webhookUrl={webhookUrl}
              onWebhookChange={updateWebhookUrl}
              videoUrl={videoUrl}
              onVideoChange={setVideoUrl}
              onVideoKeyDown={handleVideoKeyDown}
              error={error}
              onErrorDismiss={() => setError(null)}
            />
            <PlatformCard
              selectedPlatforms={selectedPlatforms}
              onToggle={togglePlatform}
              onSubmit={submit}
              isLoading={isLoading}
            />
            <ProgressCard steps={steps} visible={showProgress} />
            <div ref={outputRef}>
              <OutputCard results={results} onReset={resetResults} />
            </div>
          </>
        )}

        {displayMode === 'creator' && <CreatorPage {...creator} />}
        {displayMode === 'academia' && <AcademiaPage {...academia} />}
        {displayMode === 'history' && <HistoryPage onLoad={handleLoadFromHistory} />}
      </div>
    </div>
  )
}

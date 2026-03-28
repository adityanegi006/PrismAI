import { useState, useCallback, useRef } from 'react'
import { PLATFORMS, PIPELINE_STEPS } from '../utils/constants'
import { normalizeYouTubeUrl, fakeElapsed } from '../utils/helpers'

const LS_WEBHOOK_KEY = 'prism_webhook'

/**
 * Status values for a single pipeline step:
 *   'idle' | 'running' | 'done'
 */
function makeStepStates() {
  return PIPELINE_STEPS.map((s) => ({ ...s, status: 'idle', elapsed: null }))
}

export function usePipeline() {
  // ── Inputs ─────────────────────────────────────────────
  const [webhookUrl, setWebhookUrl] = useState(
    () => localStorage.getItem(LS_WEBHOOK_KEY) ?? ''
  )
  const [videoUrl, setVideoUrl] = useState('')

  // ── Platform selection ──────────────────────────────────
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    () => PLATFORMS.filter((p) => p.defaultOn).map((p) => p.value)
  )

  // ── Pipeline state ──────────────────────────────────────
  const [isLoading, setIsLoading]   = useState(false)
  const [activeNode, setActiveNode] = useState(null)   // pipeline visualizer
  const [steps, setSteps]           = useState(makeStepStates)
  const [showProgress, setShowProgress] = useState(false)
  const [error, setError]           = useState(null)
  const [results, setResults]       = useState(null)   // parsed JSON from webhook

  const abortRef = useRef(null)

  // ── Helpers ─────────────────────────────────────────────
  const updateWebhookUrl = useCallback((val) => {
    setWebhookUrl(val)
    localStorage.setItem(LS_WEBHOOK_KEY, val)
  }, [])

  const togglePlatform = useCallback((value) => {
    setSelectedPlatforms((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }, [])

  const resetResults = useCallback(() => {
    setResults(null)
    setVideoUrl('')
  }, [])

  // ── Run step animation helper ───────────────────────────
  function scheduleSteps() {
    PIPELINE_STEPS.forEach((step, idx) => {
      // Mark current step as running
      setTimeout(() => {
        setActiveNode(idx)
        setSteps((prev) =>
          prev.map((s) =>
            s.id === idx
              ? { ...s, status: 'running' }
              : s.id === idx - 1
              ? { ...s, status: 'done', elapsed: fakeElapsed() }
              : s
          )
        )
      }, step.delay)
    })
  }

  function finishAllSteps() {
    setActiveNode(null)
    setSteps((prev) =>
      prev.map((s) => ({
        ...s,
        status: 'done',
        elapsed: s.elapsed ?? fakeElapsed(0.5, 1.5),
      }))
    )
  }

  // ── Submit ──────────────────────────────────────────────
  const submit = useCallback(async () => {
    // Validation
    if (!webhookUrl.trim()) { setError('Please enter your n8n webhook URL.'); return }
    if (!videoUrl.trim())   { setError('Please enter a YouTube video URL.');  return }
    if (selectedPlatforms.length === 0) { setError('Select at least one output platform.'); return }

    setError(null)
    setResults(null)
    setIsLoading(true)
    setShowProgress(true)
    setSteps(makeStepStates())
    setActiveNode(0)

    // Kick off the cosmetic step animation
    scheduleSteps()

    const ANIMATION_TOTAL = 9000 // ms — must be > last step delay
    const animationPromise = new Promise((res) => setTimeout(res, ANIMATION_TOTAL))

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const fetchPromise = fetch(webhookUrl.trim(), {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtube_url: normalizeYouTubeUrl(videoUrl),
          platforms: selectedPlatforms,
        }),
      })

      // Await BOTH so the UI always shows the full progress animation
      const [response] = await Promise.all([fetchPromise, animationPromise])

      finishAllSteps()

      if (!response.ok) throw new Error(`Server responded with ${response.status}`)

      const text = await response.text()
      if (!text || text.trim() === '') {
        throw new Error('n8n returned an empty response. Check that your Respond to Webhook node has a Response Body set and the workflow is active.')
      }

      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(`n8n returned invalid JSON. Raw response: ${text.slice(0, 200)}`)
      }

      // n8n sometimes wraps the response in an array
      if (Array.isArray(data)) data = data[0]

      setTimeout(() => {
        setShowProgress(false)
        setResults(data)
      }, 600)
    } catch (err) {
      if (err.name === 'AbortError') return
      await animationPromise
      finishAllSteps()
      setTimeout(() => {
        setShowProgress(false)
        setError(`Pipeline error: ${err.message}`)
      }, 400)
    } finally {
      setIsLoading(false)
    }
  }, [webhookUrl, videoUrl, selectedPlatforms])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
    setShowProgress(false)
    setSteps(makeStepStates())
    setActiveNode(null)
  }, [])

  const loadFromHistory = useCallback((item) => {
  setResults(item)
}, [])

  return {
    // inputs
    webhookUrl, updateWebhookUrl,
    videoUrl,   setVideoUrl,
    // platforms
    selectedPlatforms, togglePlatform,
    // state
    isLoading, activeNode, steps, showProgress, error, setError, results,
    // actions
    submit, cancel, resetResults,loadFromHistory
  }
}

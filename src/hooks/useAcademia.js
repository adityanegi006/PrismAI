import { useState, useCallback, useRef } from 'react'

const LS_ACADEMIA_WEBHOOK = 'prism_academia_webhook'
const DEFAULT_ACADEMIA_WEBHOOK = 'https://kakarot006.app.n8n.cloud/webhook/creator-mode'

const LOADING_MESSAGES = [
  'Extracting video ID...',
  'Fetching metadata...',
  'Getting transcript...',
  'Preparing content...',
  'Generating study materials...',
  'Building flashcards...',
  'Detecting confusion points...',
  'Mapping prerequisites...',
]

export function useAcademia() {
  const [webhookUrl, setWebhookUrl] = useState(
    () => localStorage.getItem(LS_ACADEMIA_WEBHOOK) ?? DEFAULT_ACADEMIA_WEBHOOK
  )
  const [videoUrl, setVideoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState(0)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)
  const [activeFeature, setActiveFeature] = useState('notes')

  const [teachInput, setTeachInput] = useState('')
  const [teachFeedback, setTeachFeedback] = useState(null)
  const [teachLoading, setTeachLoading] = useState(false)

  const abortRef = useRef(null)
  const intervalRef = useRef(null)

  const updateWebhookUrl = useCallback((val) => {
    setWebhookUrl(val)
    localStorage.setItem(LS_ACADEMIA_WEBHOOK, val)
  }, [])

  const resetResults = useCallback(() => {
    setResults(null)
    setVideoUrl('')
    setTeachInput('')
    setTeachFeedback(null)
    setActiveFeature('notes')
  }, [])

  const loadFromHistory = useCallback((item) => {
    setResults(item)
    setVideoUrl(item.youtube_url || '')
    setActiveFeature('notes')
    setTeachInput('')
    setTeachFeedback(null)
  }, [])

  const submit = useCallback(async () => {
    if (!webhookUrl.trim()) { setError('Please enter your Academia webhook URL.'); return }
    if (!videoUrl.trim()) { setError('Please enter a YouTube video URL.'); return }

    setError(null)
    setResults(null)
    setIsLoading(true)
    setLoadingMsg(0)

    intervalRef.current = setInterval(() => {
      setLoadingMsg(prev => (prev + 1) % LOADING_MESSAGES.length)
    }, 2200)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch(webhookUrl.trim(), {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtube_url: videoUrl.trim().startsWith('http')
            ? videoUrl.trim()
            : `https://www.youtube.com/${videoUrl.trim()}`,
          mode: 'full',
        }),
      })

      if (!response.ok) throw new Error(`Server responded with ${response.status}`)

      const text = await response.text()
      if (!text || text.trim() === '') throw new Error('Empty response from workflow.')

      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      let data = JSON.parse(cleaned)

      if (data.text && typeof data.text === 'string') {
        try { data = JSON.parse(data.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()) }
        catch { /* use as-is */ }
      }

      setResults(data)
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(`Error: ${err.message}`)
    } finally {
      setIsLoading(false)
      clearInterval(intervalRef.current)
      setLoadingMsg(0)
    }
  }, [webhookUrl, videoUrl])

  const submitTeachBack = useCallback(async (keyPoints) => {
    if (!teachInput.trim()) return
    setTeachLoading(true)
    setTeachFeedback(null)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are an academic tutor evaluating a student's explanation.

Key points that should be covered: ${JSON.stringify(keyPoints)}

Student's explanation: "${teachInput}"

Evaluate and return ONLY a JSON object:
{
  "score": 85,
  "grade": "B+",
  "covered": ["point they covered well"],
  "missed": ["point they missed"],
  "feedback": "encouraging 2-3 sentence feedback",
  "suggestion": "one specific thing to improve"
}

Return raw JSON only.`
          }]
        })
      })
      const data = await response.json()
      const raw = data.content?.[0]?.text || ''
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      setTeachFeedback(JSON.parse(cleaned))
    } catch (err) {
      setError(`Teach Me Back error: ${err.message}`)
    } finally {
      setTeachLoading(false)
    }
  }, [teachInput])

  return {
    webhookUrl, updateWebhookUrl,
    videoUrl, setVideoUrl,
    isLoading, loadingMsg, loadingMessages: LOADING_MESSAGES,
    error, setError, results, resetResults,
    activeFeature, setActiveFeature,
    teachInput, setTeachInput,
    teachFeedback, teachLoading,
    submitTeachBack,
    loadFromHistory,
    submit,
  }
}

import { useState, useCallback, useRef } from 'react'

const LS_CREATOR_WEBHOOK = 'prism_creator_webhook'
const DEFAULT_CREATOR_WEBHOOK = '/webhook/creator-mode'

export function useCreator() {
  const [webhookUrl, setWebhookUrl] = useState(
    () => localStorage.getItem(LS_CREATOR_WEBHOOK) ?? DEFAULT_CREATOR_WEBHOOK
  )
  const [videoUrl, setVideoUrl] = useState('')
  const [topics, setTopics] = useState([])
  const [topicInput, setTopicInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  const abortRef = useRef(null)

  const updateWebhookUrl = useCallback((val) => {
    setWebhookUrl(val)
    localStorage.setItem(LS_CREATOR_WEBHOOK, val)
  }, [])

  const addTopic = useCallback((topic) => {
    const trimmed = topic.trim()
    if (!trimmed || topics.includes(trimmed)) return
    setTopics((prev) => [...prev, trimmed])
    setTopicInput('')
  }, [topics])

  const removeTopic = useCallback((topic) => {
    setTopics((prev) => prev.filter((t) => t !== topic))
  }, [])

  const resetResults = useCallback(() => {
    setResults(null)
    setVideoUrl('')
    setTopics([])
  }, [])

  const loadFromHistory = useCallback((item) => {
    setResults(item)
    setVideoUrl(item.youtube_url || '')
    setTopics(item.topics || [])
  }, [])

  const submit = useCallback(async () => {
    if (!webhookUrl.trim()) { setError('Please enter your Creator Mode webhook URL.'); return }
    if (!videoUrl.trim() && topics.length === 0) {
      setError('Enter a YouTube URL or add at least one topic.'); return
    }

    setError(null)
    setResults(null)
    setIsLoading(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch(webhookUrl.trim(), {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtube_url: videoUrl.trim(),
          topics: topics,
          resource_types: ['youtube', 'twitter', 'reddit'],
        }),
      })

      if (!response.ok) throw new Error(`Server responded with ${response.status}`)

      const text = await response.text()
      if (!text || text.trim() === '') throw new Error('Empty response from workflow.')

      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      let data
      try {
        data = JSON.parse(cleaned)
      } catch {
        throw new Error(`Could not parse response: "${cleaned.slice(0, 150)}"`)
      }

      if (data.text && typeof data.text === 'string') {
        try {
          data = JSON.parse(data.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
        } catch { /* use as-is */ }
      }

      setResults(data)
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(`Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }, [webhookUrl, videoUrl, topics])

  return {
    webhookUrl, updateWebhookUrl,
    videoUrl, setVideoUrl,
    topics, topicInput, setTopicInput, addTopic, removeTopic,
    isLoading, error, setError, results, resetResults,
    loadFromHistory,
    submit,
  }
}
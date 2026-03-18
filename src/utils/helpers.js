/**
 * Normalize a YouTube URL or partial path into a full URL.
 */
export function normalizeYouTubeUrl(input) {
  const trimmed = input.trim()
  if (trimmed.startsWith('http')) return trimmed
  return `https://www.youtube.com/${trimmed}`
}

/**
 * Convert a snake_case key into a Title Case label.
 */
export function formatLabel(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Generate a fake elapsed time string for progress display.
 */
export function fakeElapsed(min = 0.3, max = 1.1) {
  return (Math.random() * (max - min) + min).toFixed(2) + 's'
}

/**
 * Copy text to clipboard. Returns a promise.
 */
export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
}

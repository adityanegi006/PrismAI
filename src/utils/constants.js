export const PIPELINE_NODES = [
  { id: 0, icon: '⚡', label: 'Webhook' },
  { id: 1, icon: '{}', label: 'Extract ID' },
  { id: 2, icon: '🌐', label: 'YT Metadata' },
  { id: 3, icon: '{}', label: 'Clean Meta' },
  { id: 4, icon: '📝', label: 'Transcript' },
  { id: 5, icon: '{}', label: 'Combine' },
  { id: 6, icon: '✦', label: 'AI Generate' },
]

export const PIPELINE_STEPS = [
  { id: 0, name: 'Sending to Webhook',        sub: 'POST → n8n trigger',              delay: 100  },
  { id: 1, name: 'Extracting Video ID',        sub: 'Parsing URL parameters',          delay: 900  },
  { id: 2, name: 'Fetching YouTube Metadata',  sub: 'Google Data API v3',              delay: 1800 },
  { id: 3, name: 'Getting Transcript',         sub: 'Extracting & combining segments', delay: 3200 },
  { id: 4, name: 'Generating Content',         sub: 'GPT-4o processing transcript',    delay: 5000 },
]

export const PLATFORMS = [
  { value: 'twitter_thread',        label: 'Twitter Thread',      icon: '𝕏',  defaultOn: true  },
  { value: 'linkedin_post',         label: 'LinkedIn Post',        icon: 'in', defaultOn: true  },
  { value: 'instagram_caption',     label: 'Instagram Caption',    icon: '◎',  defaultOn: false },
  { value: 'instagram_reel_script', label: 'Instagram Reel',       icon: '🎬', defaultOn: false },
  { value: 'youtube_shorts_script', label: 'YouTube Shorts',       icon: '▶',  defaultOn: false },
  { value: 'blog_summary',          label: 'Blog Summary',         icon: '✍',  defaultOn: false },
  { value: 'newsletter_blurb',      label: 'Newsletter Blurb',     icon: '✉',  defaultOn: false },
]

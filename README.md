# PrismAI — Content Engine

A React frontend for the PrismAI n8n automation pipeline.  
Paste a YouTube URL → pipeline extracts transcript → GPT-4o generates multi-platform marketing assets.

## Stack

- **React 18** + **Vite**
- **CSS Modules** for scoped styling
- **Outfit** / **Instrument Serif** / **Fira Code** fonts (Google Fonts)

## Project Structure

```
src/
├── components/
│   ├── Header.jsx / .module.css       ← Logo + status pill
│   ├── Hero.jsx / .module.css         ← Headline + subtitle
│   ├── PipelineVisualizer.jsx / .css  ← Animated node graph
│   ├── ConfigCard.jsx / .module.css   ← Webhook URL + YouTube URL inputs
│   ├── PlatformCard.jsx / .module.css ← Platform toggles + submit button
│   ├── ProgressCard.jsx / .module.css ← Animated step-by-step progress
│   └── OutputCard.jsx / .module.css   ← Tabbed results display
├── hooks/
│   └── usePipeline.js                 ← All pipeline state & fetch logic
├── utils/
│   ├── constants.js                   ← Platform list, pipeline node/step defs
│   └── helpers.js                     ← URL normalizer, formatLabel, clipboard
├── styles/
│   └── global.css                     ← CSS variables, resets, keyframes
├── App.jsx / App.module.css           ← Root composition
└── main.jsx                           ← ReactDOM entry point
```

## Getting Started

```bash
npm install
npm run dev
```

## Webhook Contract

The frontend sends a `POST` to your n8n webhook URL with:

```json
{
  "youtube_url": "https://www.youtube.com/watch?v=...",
  "platforms": ["twitter_thread", "linkedin_post"]
}
```

Your n8n workflow should return a JSON object where each key is a platform name:

```json
{
  "twitter_thread": "1/ Here's what I learned from...",
  "linkedin_post": "Watched an incredible video on..."
}
```

The frontend auto-generates a tab for each key in the response.

## Available Platforms

| Value                | Label              |
|---------------------|--------------------|
| `twitter_thread`    | Twitter Thread     |
| `linkedin_post`     | LinkedIn Post      |
| `instagram_caption` | Instagram Caption  |
| `blog_summary`      | Blog Summary       |
| `newsletter_blurb`  | Newsletter Blurb   |
| `youtube_description` | YT Description   |

## Notes

- The webhook URL is persisted in `localStorage` so you don't have to re-enter it
- The pipeline step animation runs for ~6 seconds regardless of response time, so the UX always shows the full flow
- Tabs are generated dynamically from response keys — no hardcoding needed

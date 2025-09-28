// Crypto Fortune Cookies — Full project scaffold (Vite + React + Tailwind)
// File layout (each file is provided below as a separate code block):
// 
// package.json
// vite.config.js
// tailwind.config.cjs
// postcss.config.cjs
// index.html
// src/main.jsx
// src/App.jsx
// src/components/CryptoFortune.jsx
// src/data/fortunes.json
// src/styles/index.css
// README.md

---

// package.json
{
  "name": "crypto-fortune-cookies",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .js,.jsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "clsx": "^1.2.1"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "tailwindcss": "^3.5.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.0.0",
    "eslint-plugin-react": "^7.0.0"
  }
}

---

// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})

---

// tailwind.config.cjs
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

---

// postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

---

// index.html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Crypto Fortune Cookies</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

---

// src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

---

// src/styles/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
body { @apply bg-slate-50 text-slate-900; }

---

// src/data/fortunes.json
[
  "HODL tight — a surprise is coming.",
  "Switching to the long-term mindset will pay dividends.",
  "Don't fear volatility; learn from it.",
  "Your next trade will teach you more than any chart.",
  "A little research will unlock a big opportunity.",
  "Take profits when you don't need them anymore.",
  "Diversify — even cookies like different fillings.",
  "The best time to plant a tree was years ago; the second best is now.",
  "Follow the tech, not the hype.",
  "Small consistent wins beat occasional heroics."
]

---

// src/components/CryptoFortune.jsx
import React, { useEffect, useState } from 'react'
import fortunes from '../data/fortunes.json'
import clsx from 'clsx'

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price'
const SUPPORTED = [
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'solana', symbol: 'SOL' },
  { id: 'cardano', symbol: 'ADA' },
  { id: 'dogecoin', symbol: 'DOGE' }
]

export default function CryptoFortune() {
  const [selected, setSelected] = useState(SUPPORTED[0].id)
  const [price, setPrice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fortune, setFortune] = useState('Click "Open Cookie" to reveal your crypto fortune!')
  const [shake, setShake] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPrice(selected)
  }, [selected])

  async function fetchPrice(coinId) {
    setLoading(true)
    setError(null)
    try {
      const q = `${COINGECKO_API}?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`
      const res = await fetch(q)
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setPrice(data[coinId])
    } catch (e) {
      setError('Failed to fetch price — try again later.')
      setPrice(null)
    } finally {
      setLoading(false)
    }
  }

  function openCookie() {
    setShake(true)
    setTimeout(() => setShake(false), 800)
    const pick = fortunes[Math.floor(Math.random() * fortunes.length)]
    setFortune(pick)
  }

  function shareText() {
    const coin = SUPPORTED.find(c => c.id === selected)
    const priceStr = price ? `$${price.usd.toLocaleString()} (${price.usd_24h_change?.toFixed(2)}% 24h)` : 'price unknown'
    return `🔮 Crypto Fortune for ${coin.symbol}: ${fortune} — Current: ${priceStr}`
  }

  async function tryShare() {
    const text = shareText()
    if (navigator.share) {
      try { await navigator.share({ text }) } catch (e) { /* ignore */ }
    } else {
      await navigator.clipboard.writeText(text)
      alert('Copied fortune to clipboard!')
    }
  }

  return (
    <div className="max-w-xl w-full bg-white shadow-2xl rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-2">Crypto Fortune Cookie</h2>
      <p className="text-sm text-slate-500 mb-4">Pick a coin and open a fortune cookie — powered by CoinGecko.</p>

      <div className="flex gap-2 mb-4">
        <select
          aria-label="Select coin"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="flex-1 p-2 border rounded"
        >
          {SUPPORTED.map(c => (
            <option key={c.id} value={c.id}>{c.symbol}</option>
          ))}
        </select>
        <button
          onClick={() => fetchPrice(selected)}
          className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200"
        >Refresh</button>
      </div>

      <div className="mb-4">
        <div className="text-sm text-slate-500">Current price</div>
        <div className="mt-1">
          {loading ? (
            <div className="italic">Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : price ? (
            <div className="text-lg font-mono">${price.usd.toLocaleString()} <span className={clsx('ml-3 text-sm', price.usd_24h_change >= 0 ? 'text-green-600' : 'text-red-600')}>{price.usd_24h_change?.toFixed(2)}%</span></div>
          ) : (
            <div className="text-sm text-slate-400">No data</div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className={clsx('p-4 rounded-xl border', shake ? 'animate-[shake_0.8s]' : '')}>
          <div className="text-slate-600">{fortune}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={openCookie} className="flex-1 py-2 rounded bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium shadow">Open Cookie</button>
        <button onClick={tryShare} className="px-4 py-2 rounded border">Share</button>
      </div>

      <style>{`@keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }`}</style>
    </div>
  )
}

---

// src/App.jsx
import React from 'react'
import CryptoFortune from './components/CryptoFortune'

export default function App() {
  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <h1 className="text-4xl font-extrabold mb-4">Crypto Fortune Cookies</h1>
          <p className="text-slate-600 mb-6">A tiny playful app that mixes real-time crypto prices with motivational crypto "fortunes" — perfect for demos, README screenshots, and GitHub Pages deployments.</p>
          <ul className="list-disc pl-5 text-slate-700">
            <li>Fetches price data from CoinGecko</li>
            <li>Random fortunes stored locally</li>
            <li>Share or copy fortunes</li>
          </ul>
        </div>

        <div className="flex items-center justify-center">
          <CryptoFortune />
        </div>
      </div>
    </div>
  )
}

---

// README.md
# Crypto Fortune Cookies

A small React + Vite + Tailwind demo app that combines CoinGecko price lookups with random "crypto fortunes." Great for a fun GitHub project, screenshots, and quick deploys.

## Features
- Choose a coin and fetch live USD price (CoinGecko public API).
- Open a random fortune (local JSON file).
- Share or copy the fortune.

## Run locally
1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

Open http://localhost:5173

## Deploy
- Build: `npm run build`
- Deploy to Vercel, Netlify, or GitHub Pages. Static site output in `dist/`.

## Notes
- CoinGecko's API is used only client-side; if you need rate-limits or API key control, add a small backend proxy.
- Feel free to expand fortunes in `src/data/fortunes.json` and add more coins.

---

// End of scaffold

// If you'd like, I can also generate a ready-to-upload ZIP or a GitHub repo template. 
// Open the created canvas item to copy files and push to your GitHub.

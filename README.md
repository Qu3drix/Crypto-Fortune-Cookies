[README.md](https://github.com/user-attachments/files/22585293/README.md)
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

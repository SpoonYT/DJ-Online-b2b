# B2B LIVE — Remote DJ Sessions

A browser-based app for two DJs to run a live B2B session remotely using Rekordbox.
Each DJ shares their Rekordbox window, audio routes through WebRTC, and a crossfader controls the master mix.

---

## How it works

- **WebRTC (PeerJS)** — direct peer-to-peer audio+video between the two DJs. Low latency.
- **Screen share** — each DJ shares their Rekordbox window via `getDisplayMedia`. The crop tool lets you isolate just the waveform strip.
- **Web Audio API** — both streams are routed through a browser mixer with gain nodes. The crossfader controls blend ratio in real time.
- **Hand-off** — clicking "Hand Off" sends a request to the partner. On accept, the crossfader smoothly animates from one deck to the other.

---

## Running locally

```bash
npm install
node server.js
```

Open http://localhost:3000 in two Chrome windows (or share via ngrok).

For remote access locally:
```bash
npx ngrok http 3000
```
Share the ngrok URL with your partner.

---

## Deploying to Railway (recommended — free tier available)

1. Push this folder to a GitHub repo
2. Go to railway.app → New Project → Deploy from GitHub
3. Select your repo — Railway auto-detects Node.js and runs `npm start`
4. Railway gives you a public URL like `https://b2b-live.up.railway.app`
5. Share that URL with your partner

**Important**: Set the `PORT` environment variable if your host requires it (Railway does this automatically).

---

## Deploying to Render

1. Push to GitHub
2. render.com → New → Web Service
3. Build command: `npm install`
4. Start command: `node server.js`
5. Free tier works fine for two-person sessions

---

## Deploying to Fly.io

```bash
fly launch
fly deploy
```

---

## Requirements

- **Chrome or Edge** (Firefox does not support screen audio capture via getDisplayMedia)
- Rekordbox open on your machine
- A stable internet connection (the video stream is bandwidth-heavy — 5+ Mbps recommended)

---

## How to use

1. **DJ Host**: Enter your name → Create Session → share the room code
2. **DJ Guest**: Enter your name → paste room code → Join Session
3. Both DJs click **Share Window** and select their Rekordbox window
4. Use the **Crop** button to drag a selection over just the waveform/now-playing area
5. The **Crossfader** blends audio between Deck A (host) and Deck B (guest)
6. When ready to hand off, click **⇄ Hand Off** — the partner accepts, and the crossfader animates automatically

---

## Audio routing note

`getDisplayMedia` with `audio: true` captures your **system audio output** on Chrome/Edge.
Make sure Rekordbox is outputting to your default system audio device, or configure it as needed.
On macOS you may need a virtual audio driver (e.g. BlackHole or Loopback) to route Rekordbox audio to the browser capture.

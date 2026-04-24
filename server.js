/**
 * B2B LIVE — Server
 *
 * Serves the static frontend AND runs the PeerJS signaling server
 * on the same port. Deploy this anywhere Node.js runs.
 *
 * Hosting options:
 *   - Railway:  railway up
 *   - Render:   push to git, create Web Service, set start command to: node server.js
 *   - Fly.io:   fly launch
 *   - VPS:      node server.js  (use PM2 for persistence)
 *   - Local:    node server.js  (then share via ngrok for remote access)
 */

const express = require('express');
const { PeerServer } = require('peer');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 3000;

const app = express();

// Serve static files (index.html etc.)
app.use(express.static(path.join(__dirname)));

// Health check (used by Railway/Render to confirm app is up)
app.get('/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

// Catch-all: serve index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Create HTTP server
const server = http.createServer(app);

// Mount PeerJS signaling on /peerjs
const peerServer = PeerServer({
  port: PORT,
  path: '/peerjs',
  server,          // share the same HTTP server
  allow_discovery: false,
  proxied: true,
});

peerServer.on('connection', client => {
  console.log(`[peer] connected: ${client.getId()}`);
});

peerServer.on('disconnect', client => {
  console.log(`[peer] disconnected: ${client.getId()}`);
});

server.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║        B2B LIVE — Server running      ║
  ╠═══════════════════════════════════════╣
  ║  App:      http://localhost:${PORT}       ║
  ║  PeerJS:   http://localhost:${PORT}/peerjs║
  ║  Health:   http://localhost:${PORT}/health║
  ╚═══════════════════════════════════════╝
  `);
});

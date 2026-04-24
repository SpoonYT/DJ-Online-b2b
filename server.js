/**
 * B2B LIVE — Server
 * peer v9 compatible — uses ExpressPeerServer
 */

const express = require('express');
const { ExpressPeerServer } = require('peer');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
  path: '/',
  allow_discovery: false,
});

app.use('/peerjs', peerServer);

peerServer.on('connection', client => console.log(`[peer] connected: ${client.getId()}`));
peerServer.on('disconnect', client => console.log(`[peer] disconnected: ${client.getId()}`));

server.listen(PORT, () => {
  console.log(`B2B LIVE running on http://localhost:${PORT}`);
  console.log(`PeerJS signaling at http://localhost:${PORT}/peerjs`);
});

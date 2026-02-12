const express = require('express');
const path = require('path');

// Use global fetch when available (Node 18+), otherwise fall back to dynamic import of node-fetch
const fetch = global.fetch || ((...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)));

const app = express();
const PORT = 4000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Proxy endpoint to reach the ingestion service from the frontend container.
// Use environment variable INGESTION_API_URL (e.g. http://ingestion:8080) when running in Docker.
const INGESTION_API_URL = process.env.INGESTION_API_URL || 'http://localhost:8080';

app.get('/api/processed/latest', async (req, res) => {
  try {
    const upstream = `${INGESTION_API_URL}/processed/latest`;
    const r = await fetch(upstream);
    const text = await r.text();
    res.status(r.status).set('Content-Type', r.headers.get('content-type') || 'application/json').send(text);
  } catch (err) {
    res.status(502).json({ error: 'failed to proxy to ingestion API', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

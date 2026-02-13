require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env')
});

const express = require('express');
const path = require('path');

// Use global fetch when available (Node 18+), otherwise fall back to dynamic import of node-fetch
const fetch = global.fetch || ((...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)));

const app = express();
const PORT = process.env.PORT || 4000;

const ORS_API_KEY = process.env.ORS_API_KEY;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env')
});

const express = require('express');
const path = require('path');

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 4000;

const ORS_API_KEY = process.env.ORS_API_KEY;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api-key', (req, res) => {
  res.json({ apiKey: ORS_API_KEY });
});

app.get('/route', async (req, res) => {
  const { startLng, startLat, endLng, endLat } = req.query;

  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${startLng},${startLat}&end=${endLng},${endLat}`;

  console.log("ORS URL:", url);

  try {
    const response = await fetch(url);

    const text = await response.text();

    console.log("ORS STATUS:", response.status);
    console.log("ORS RAW RESPONSE:", text);

    if (!response.ok) {
      return res.status(response.status).send(text);
    }

    res.send(text);

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

// Route principale
app.get("/", (req, res) => {
  res.send("<h1>CityFlow Frontend Dashboard</h1><p>Temps réel à venir...</p>");
});

app.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
});

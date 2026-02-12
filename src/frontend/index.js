require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env')
});

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// --- Route de test simple ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- Lancer le serveur seulement si exécuté directement ---
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// --- Export pour les tests ---
module.exports = app;

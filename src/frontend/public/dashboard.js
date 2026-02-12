const map = L.map("map");

// --- Carte ---
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// --- Intersections ---
const intersections = [
  { id: "C1", name: "Ecole-IT", lat: 47.847131, lng: 1.914037 },
  { id: "C2", name: "Parking Tao Flexo", lat: 47.846318, lng: 1.916160 },
  { id: "C3", name: "Maison des Sports (MDS)", lat: 47.846097, lng: 1.917004 },
  { id: "C4", name: "Parc relais Les Aulnaies", lat: 47.846244, lng: 1.917344 },
  { id: "S1", name: "Les Aulnaies", lat: 47.846713, lng: 1.916717 },
  { id: "R1", name: "Rond-point de la Juine", lat: 47.849052, lng: 1.915603 },
  { id: "R2", name: "Rond-point Ligue Centre-Val de Loire de Rugby", lat: 47.851791, lng: 1.913284 },
  { id: "R3", name: "Rond-point MacDonalds", lat: 47.845342, lng: 1.916557 },
  { id: "R4", name: "Résidence le Dhuy", lat: 47.845313, lng: 1.920707 }
];

// --- Ajout des markers ---
intersections.forEach(i => {
  i.marker = L.circleMarker([i.lat, i.lng], {
    radius: 17,
    color: "gray",
    fillColor: "gray",
    fillOpacity: 0.8
  }).addTo(map);

  i.marker.bindPopup(`<b>${i.name}</b>`);
});

// Centrage automatique
const group = L.featureGroup(intersections.map(i => i.marker));
map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 17 });

// --- Routes ---
const routes = [
  { from: "C3", to: "C4", name: "C3 → C4", coords: [[47.846111,1.917106],[47.846244,1.917344]] },
  { from: "C1", to: "C2", name: "Ecole-IT → Parking Tao Flexo", coords: [[47.847079,1.914020],[47.846572,1.915059],[47.846292,1.916141]] },
  { from: "C2", to: "C1", name: "Parking Tao Flexo → Ecole-IT", coords: [[47.846318,1.916160],[47.846608,1.915079],[47.847131,1.914037]] },
  { from: "S1", to: "C2", name: "Les Aulnaies → Parking Tao Flexo", coords: [[47.846713,1.916717],[47.846662,1.916349],[47.846318,1.916160]] },
  { from: "C2", to: "C3", name: "Parking Tao Flexo → Maison des Sports (MDS)", coords: [[47.846292,1.916141],[47.846079,1.916982]] },
  { from: "C3", to: "C2", name: "Maison des Sports (MDS) → Parking Tao Flexo", coords: [[47.846120,1.917031],[47.846318,1.916160]] },
  { from: "C3", to: "C4", name: "Maison des Sports (MDS) → Parc relais Les Aulnaies", coords: [[47.846111,1.917106],[47.846244,1.917344]] },
  { from: "C3", to: "R3", name: "Maison des Sports (MDS) → Rond-point MacDonalds", coords: [[47.846079,1.916982],[47.845535,1.916645]] },
  { from: "R3", to: "C3", name: "Rond-point MacDonalds → Maison des Sports (MDS)", coords: [[47.845492,1.916809],[47.846047,1.917072]] },
  { from: "C3", to: "R4", name: "Maison des Sports (MDS) → Résidence le Dhuy", coords: [[47.846047,1.917072],[47.845253,1.920536]] },
  { from: "R4", to: "C4", name: "Résidence le Dhuy → Parc relais Les Aulnaies", coords: [[47.845388,1.920535],[47.846000,1.917760],[47.846244,1.917344]] },
  { from: "C4", to: "S1", name: "Parc relais Les Aulnaies → Les Aulnaies", coords: [[47.846244,1.917344],[47.846713,1.916717]] },
  { from: "S1", to: "R1", name: "Les Aulnaies → Rond-point de la Juine", coords: [[47.846713,1.916717],[47.847145,1.916337],[47.849042,1.915712]] },
  { from: "R1", to: "C2", name: "Rond-point de la Juine → Parking Tao Flexo", coords: [[47.848926,1.915529],[47.846718,1.916309],[47.846348,1.916105]] },
  { from: "C1", to: "R1", name: "Ecole-IT → Rond-point de la Juine", coords: [[47.847116,1.914134],[47.848925,1.915155],[47.848942,1.915505]] },
  { from: "R1", to: "C1", name: "Rond-point de la Juine → Ecole-IT", coords: [[47.849081,1.915419],[47.848969,1.915024],[47.847206,1.913961]] },
  { from: "R1", to: "R2", name: "Rond-point de la Juine → Rond-point Ligue Rugby", coords: [[47.849042,1.915712],[47.850425,1.914983],[47.851770,1.913445]] },
  { from: "R2", to: "R1", name: "Rond-point Ligue Rugby → Rond-point de la Juine", coords: [[47.851659,1.913332],[47.850312,1.914796],[47.849101,1.915453]] },
  { from: "C1", to: "R2", name: "Ecole-IT → Rond-point Ligue Rugby", coords: [[47.847209,1.913924],[47.847836,1.913091],[47.848958,1.912749],[47.851497,1.913057],[47.851644,1.913184]] },
  { from: "R2", to: "C1", name: "Rond-point Ligue Rugby → Ecole-IT", coords: [[47.851766,1.913017],[47.851411,1.912900],[47.848741,1.912563],[47.847661,1.913050],[47.847117,1.913944]] }
];

// --- Initialisation du trafic ---
routes.forEach(r => r.value = Math.floor(Math.random() * 101)); // 0 à 100

// --- Couleur selon trafic ---
function trafficToColor(value) {
  if (value <= 50) {
    const ratio = value / 50;
    const r = Math.round(0 + 255 * ratio);
    const g = 255;
    return `rgb(${r},${g},0)`;
  } else {
    const ratio = (value - 50) / 50;
    const r = 255;
    const g = Math.round(255 * (1 - ratio));
    return `rgb(${r},${g},0)`;
  }
}

// --- Poids d’une route = trafic uniquement ---
function routeWeight(r) {
  return r.value;
}

// --- Variables pour polylines dynamiques ---
let polylines = [];
let currentRoutePolyline = null;
const panel = document.getElementById("dashboardPanel");

// --- Création dashboard ---
routes.forEach(r => {
  const container = document.createElement("div");
  container.className = "gaugeContainer";
  const gaugeId = r.name.replace(/\s|→/g, '');
  container.innerHTML = `
    <div class="gaugeLabel">${r.name}</div>
    <div class="gaugeBar">
      <div id="gauge-${gaugeId}" class="gaugeFill" style="background:${trafficToColor(r.value)}"></div>
      <div class="gaugeText" id="gaugeText-${gaugeId}">${r.value}%</div>
    </div>
  `;
  panel.appendChild(container);
});

// --- Fonction pour afficher les routes et dashboard ---
function updateRoutes() {
  polylines.forEach(p => map.removeLayer(p));
  polylines = [];

  routes.forEach(r => {
    const color = trafficToColor(r.value);
    const polyline = L.polyline(r.coords, { color, weight: 6, opacity: 0.8 }).addTo(map);
    polyline.bindPopup(`<b>Route:</b> ${r.name}<br/>Trafic: ${r.value}`);
    polylines.push(polyline);

    const gaugeId = r.name.replace(/\s|→/g, '');
    const fill = document.getElementById(`gauge-${gaugeId}`);
    const text = document.getElementById(`gaugeText-${gaugeId}`);
    if (fill && text) {
      fill.style.width = r.value + "%";
      fill.style.background = color;
      text.innerText = r.value + "%";
    }
  });
}

// --- Graphe pour Dijkstra ---
function buildGraph() {
  const graph = {};
  intersections.forEach(i => graph[i.id] = []);
  routes.forEach(r => graph[r.from].push({ to: r.to, route: r, weight: routeWeight(r) }));
  return graph;
}

// --- Dijkstra ---
function dijkstra(graph, startId, endId) {
  const dist = {}, prev = {};
  const pq = new Set(Object.keys(graph));
  Object.keys(graph).forEach(k => dist[k] = Infinity);
  dist[startId] = 0;

  while (pq.size > 0) {
    let u = null;
    pq.forEach(node => { if (u === null || dist[node] < dist[u]) u = node; });
    if (u === endId) break;
    pq.delete(u);
    graph[u].forEach(n => {
      const alt = dist[u] + n.weight;
      if (alt < dist[n.to]) {
        dist[n.to] = alt;
        prev[n.to] = u;
      }
    });
  }

  const path = [];
  let u = endId;
  while (u) { path.unshift(u); u = prev[u]; }
  return path;
}

// --- Sélections départ / arrivée ---
const startSelect = document.getElementById("startSelect");
const endSelect = document.getElementById("endSelect");

intersections.forEach(i => {
  const o1 = document.createElement("option"); o1.value = i.id; o1.text = i.name;
  const o2 = document.createElement("option"); o2.value = i.id; o2.text = i.name;
  startSelect.appendChild(o1);
  endSelect.appendChild(o2);
});

// --- Fonction centrale pour calculer et afficher le meilleur chemin ---
function updateOptimalRoute() {
  const start = startSelect.value;
  const end = endSelect.value;
  if (!start || !end) return;

  const graph = buildGraph();
  const path = dijkstra(graph, start, end);
  if (!path || path.length < 2) return;

  const coords = [];
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i], to = path[i + 1];
    const route = routes.find(r => r.from === from && r.to === to);
    if (route) coords.push(...route.coords);
  }

  if (currentRoutePolyline) map.removeLayer(currentRoutePolyline);
  currentRoutePolyline = L.polyline(coords, { color: "blue", weight: 8, opacity: 0.9, dashArray: "5,10" }).addTo(map);
  currentRoutePolyline.bringToFront();
  map.fitBounds(currentRoutePolyline.getBounds(), { padding: [50,50] });
}

// --- Bouton calcul manuel ---
document.getElementById("calculateRouteBtn").addEventListener("click", updateOptimalRoute);

// --- Intervalle 5s pour mettre à jour le trafic et recalcul automatique ---
setInterval(() => {
  routes.forEach(r => r.value = Math.floor(Math.random() * 101));
  updateRoutes();
  updateOptimalRoute();
}, 5000);

// --- Initial update ---
updateRoutes();
updateOptimalRoute();

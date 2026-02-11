const map = L.map("map");

// --- Carte ---
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// --- Intersections ---
const intersections = [
  { id: "C1", lat: 47.847131, lng: 1.914037 },
  { id: "C2", lat: 47.846318, lng: 1.916160 },
  { id: "C3", lat: 47.846097, lng: 1.917004 },
  { id: "C4", lat: 47.846244, lng: 1.917344 },
  { id: "S1", lat: 47.846713, lng: 1.916717 },
  { id: "R1", lat: 47.849052, lng: 1.915603 },
  { id: "R2", lat: 47.851791, lng: 1.913284 },
  { id: "R3", lat: 47.845342, lng: 1.916557 },
  { id: "R4", lat: 47.845313, lng: 1.920707 }
];

// --- Ajout des markers ---
intersections.forEach(i => {
  i.marker = L.circleMarker([i.lat, i.lng], {
    radius: 17,
    color: "gray",
    fillColor: "gray",
    fillOpacity: 0.8
  }).addTo(map);

  i.marker.bindPopup(`<b>${i.id}</b>`);
});

// Centrage automatique
const group = L.featureGroup(intersections.map(i => i.marker));
map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 17 });

// --- Routes ---
const routes = [
  { from: "C1", to: "C2", name: "C1 → C2", coords: [[47.847079,1.914020],[47.846572,1.915059],[47.846292,1.916141]] },
  { from: "C2", to: "C1", name: "C2 → C1", coords: [[47.846318,1.916160],[47.846608,1.915079],[47.847131,1.914037]] },
  { from: "S1", to: "C2", name: "S1 → C2", coords: [[47.846713,1.916717],[47.846662,1.916349],[47.846318,1.916160]] },
  { from: "C2", to: "C3", name: "C2 → C3", coords: [[47.846292,1.916141],[47.846079,1.916982]] },
  { from: "C3", to: "C2", name: "C3 → C2", coords: [[47.846120,1.917031],[47.846318,1.916160]] },
  { from: "C3", to: "C4", name: "C3 → C4", coords: [[47.846111,1.917106],[47.846244,1.917344]] },
  { from: "C3", to: "R3", name: "C3 → R3", coords: [[47.846079,1.916982],[47.845535,1.916645]] },
  { from: "R3", to: "C3", name: "R3 → C3", coords: [[47.845492,1.916809],[47.846047,1.917072]] },
  { from: "C3", to: "R4", name: "C3 → R4", coords: [[47.846047,1.917072],[47.845253,1.920536]] },
  { from: "R4", to: "C4", name: "R4 → C4", coords: [[47.845388,1.920535],[47.846000,1.917760],[47.846244,1.917344]] },
  { from: "C4", to: "S1", name: "C4 → S1", coords: [[47.846244,1.917344],[47.846713,1.916717]] },
  { from: "S1", to: "R1", name: "S1 → R1", coords: [[47.846713,1.916717],[47.847145,1.916337],[47.849042,1.915712]] },
  { from: "R1", to: "C2", name: "R1 → C2", coords: [[47.848926,1.915529],[47.846718,1.916309],[47.846348,1.916105]] },
  { from: "C1", to: "R1", name: "C1 → R1", coords: [[47.847116,1.914134],[47.848925,1.915155],[47.848942,1.915505]] },
  { from: "R1", to: "C1", name: "R1 → C1", coords: [[47.849081,1.915419],[47.848969,1.915024],[47.847206,1.913961]] },
  { from: "R1", to: "R2", name: "R1 → R2", coords: [[47.849042,1.915712],[47.850425,1.914983],[47.851770,1.913445]] },
  { from: "R2", to: "R1", name: "R2 → R1", coords: [[47.851659,1.913332],[47.850312,1.914796],[47.849101,1.915453]] },
  { from: "C1", to: "R2", name: "C1 → R2", coords: [[47.847209,1.913924],[47.847836,1.913091],[47.848958,1.912749],[47.851497,1.913057],[47.851644,1.913184]] },
  { from: "R2", to: "C1", name: "R2 → C1", coords: [[47.851766,1.913017],[47.851411,1.912900],[47.848741,1.912563],[47.847661,1.913050],[47.847117,1.913944]] }
];

// --- Attributs dynamiques (trafic uniquement) ---
routes.forEach(r => {
  r.value = Math.floor(Math.random() * 101); // 0 à 100
});

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

// --- Poids d’une route = trafic seulement ---
function routeWeight(r) {
  return r.value; // plus le trafic est élevé, plus le poids est lourd
}

// --- Variables pour polylines dynamiques ---
let polylines = [];
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

// --- Fonction pour afficher routes sur carte et dashboard ---
function updateRoutes() {
  // Supprime anciennes polylines
  polylines.forEach(p => map.removeLayer(p));
  polylines = [];

  routes.forEach(r => {
    const color = trafficToColor(r.value);
    const polyline = L.polyline(r.coords, { color, weight: 6, opacity: 0.8 }).addTo(map);
    polyline.bindPopup(`<b>Route:</b> ${r.name}<br/>Trafic: ${r.value}`);
    polylines.push(polyline);

    // dashboard
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

// --- Intervalle mise à jour du trafic toutes les 5s ---
// --- Intervalle mise à jour du trafic toutes les 5s ---
setInterval(() => {
  // Mise à jour des valeurs de trafic
  routes.forEach(r => r.value = Math.floor(Math.random() * 101));
  updateRoutes();

  // Recalcul automatique du meilleur chemin si start/end sélectionnés
  const start = startSelect.value;
  const end = endSelect.value;
  if (start && end) {
    const graph = buildGraph();
    const path = dijkstra(graph, start, end);
    if (path && path.length > 1) {
      const coords = [];
      for (let i = 0; i < path.length - 1; i++) {
        const from = path[i], to = path[i + 1];
        const route = routes.find(r => r.from === from && r.to === to);
        if (route) coords.push(...route.coords);
      }
      if (currentRoutePolyline) map.removeLayer(currentRoutePolyline);
      currentRoutePolyline = L.polyline(coords, { color: "blue", weight: 8, opacity: 0.9, dashArray: "5,10" }).addTo(map);
    }
  }
}, 5000);

updateRoutes();

// --- Fonction pour reconstruire le graphe dynamique ---
function buildGraph() {
  const graph = {};
  intersections.forEach(i => graph[i.id] = []);
  routes.forEach(r => {
    graph[r.from].push({ to: r.to, route: r, weight: routeWeight(r) });
  });
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

// --- Sélection départ/arrivée ---
let currentRoutePolyline = null;
const startSelect = document.getElementById("startSelect");
const endSelect = document.getElementById("endSelect");
intersections.forEach(i => {
  const o1 = document.createElement("option"); o1.value = i.id; o1.text = i.id; startSelect.appendChild(o1);
  const o2 = document.createElement("option"); o2.value = i.id; o2.text = i.id; endSelect.appendChild(o2);
});

// --- Calcul du meilleur chemin selon trafic ---
document.getElementById("calculateRouteBtn").addEventListener("click", () => {
  const start = startSelect.value;
  const end = endSelect.value;
  if (!start || !end) return;

  const graph = buildGraph(); // Graphe dynamique avec poids actuels
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
  map.fitBounds(currentRoutePolyline.getBounds(), { padding: [50, 50] });
});

const map = L.map('map');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const intersections = [
  // C for "Croisement", R for "Roundabout"
  { id: "C1", name: "Croisement Rue de Beuvron / Rue de la Bergeresse", lat: 47.847131, lng: 1.914037 },
  { id: "C2", name: "Croisement Rue de la Juine / Rue de la Bergeresse", lat: 47.846318, lng: 1.916160 },
  {id: "C3", name: "Croisement Rue de la Bergeresse / Allée des Mauves", lat: 47.846097, lng: 1.917004 },

  { id: "R1", name: "Rond-point Rue de la Juine / Rue de Beuvron", lat: 47.849052, lng: 1.915603 },
  { id: "R2", name: "Rond-point Rue de la Juine / Rue de la Bergeresse", lat: 47.851791, lng: 1.913284 },
  { id: "R3", name: "Rond-point Rue de Bourges / Allée des Mauves", lat: 47.845342, lng: 1.916557 },
  { id: "R4", name: "Rond-point Rue de l'Ardoux / Rue de la Bergeresse", lat: 47.845313, lng: 1.920707 },
  
];

function getTraffic() {
  return Math.floor(Math.random() * 100);
}

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

// Création des markers
intersections.forEach(i => {
  i.traffic = getTraffic();
  i.marker = L.circleMarker([i.lat, i.lng], {
    radius: 15,
    color: trafficToColor(i.traffic)
  }).addTo(map);
});

const group = L.featureGroup(intersections.map(i => i.marker));
map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 17, animate: true, duration: 1 });

// Définition des routes
const routes = [
  { from: "C1", to: "R1", coords: [[47.847131, 1.914037], [47.848929, 1.915078], [47.849052, 1.915603]] },
  { from: "C1", to: "C2", coords: [[47.847131, 1.914037], [47.846608, 1.915079], [47.846318, 1.916160]] },
  { from: "C2", to: "C3", coords: [[47.846318, 1.916160], [47.846097, 1.917004]] },
  { from: "C3", to: "R1", coords: [[47.846097, 1.917004], [47.846244, 1.917356], [47.846866, 1.916501], [47.849052, 1.915603]] },
  {from: "C3", to: "R4", coords: [[47.846097, 1.917004], [47.845220, 1.920707]] },

  { from: "R1", to: "R2", coords: [[47.849052, 1.915603], [47.850000, 1.915000], [47.851000, 1.914200], [47.851791, 1.913284]] },
  { from: "R1", to: "C2", coords: [[47.849052, 1.915603], [47.846734, 1.916355], [47.846318, 1.916160]] },
  { from: "R2", to: "C1", coords: [[47.851791, 1.913284], [47.851573, 1.913011], [47.848833, 1.912645], [47.847805, 1.913032], [47.847131, 1.914037]] },
  { from: "R3", to: "C3", coords: [[47.845342, 1.916557], [47.846097, 1.917004]] },
  { from: "R4", to: "R1", coords: [[47.845313, 1.920707], [47.845990, 1.917719], [47.846244, 1.917356]] }
];

var polylines = [];

function updateRoutes() {
  polylines.forEach(p => map.removeLayer(p));
  polylines = [];
  routes.forEach(r => {
    const from = intersections.find(i => i.id === r.from);
    const to = intersections.find(i => i.id === r.to);
    const avgTraffic = Math.round((from.traffic + to.traffic) / 2);
    const color = trafficToColor(avgTraffic);
    const polyline = L.polyline(r.coords, { color: color, weight: 6, opacity: 0.7 }).addTo(map);
    polylines.push(polyline);
  });
}

updateRoutes();

// Création du panel avec jauges
const panel = document.getElementById('dashboardPanel');

intersections.forEach(i => {
  const container = document.createElement('div');
  container.className = 'gaugeContainer';
  container.innerHTML = `
    <div class="gaugeLabel">${i.name}</div>
    <div class="gaugeBar">
      <div id="gauge-${i.id}" class="gaugeFill" style="background:${i.marker.options.color}"></div>
      <div class="gaugeText" id="gaugeText-${i.id}">${i.traffic}%</div>
    </div>
  `;

  panel.appendChild(container);
});

updateDashboard();

function updateDashboard() {
  intersections.forEach(i => {
    const gauge = document.getElementById(`gauge-${i.id}`);
    gauge.style.width = i.traffic + '%';
    gauge.style.background = i.marker.options.color;
    const gaugeText = document.getElementById(`gaugeText-${i.id}`);
    gaugeText.innerText = i.traffic + '%';
  });
}

// Mise à jour toutes les 5 secondes
setInterval(() => {
  intersections.forEach(i => {
    i.traffic = getTraffic();
    i.marker.setStyle({ color: trafficToColor(i.traffic) });
    i.marker.bindPopup(`<b>${i.name}</b><br/>Traffic: ${i.traffic}`);
  });
  updateRoutes();
  updateDashboard();
}, 5000);

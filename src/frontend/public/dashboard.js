const map = L.map('map');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const intersections = [
  { id: "A1", lat: 47.847131, lng: 1.914037 },
  { id: "B2", lat: 47.849052, lng: 1.915603 },
  { id: "C3", lat: 47.851791, lng: 1.913284 }
];

function getColor(value) {
  if (value < 30) return "green";
  if (value < 70) return "orange";
  return "red";
}

function randomTraffic() {
  return Math.floor(Math.random() * 100);
}

intersections.forEach(i => {
  i.marker = L.circleMarker([i.lat, i.lng], {
    radius: 15,
    color: "green"
  }).addTo(map);
});

const group = L.featureGroup(intersections.map(i => i.marker));
map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 17, animate: true, duration: 1 });

const routes = [
  {
    from: "A1",
    to: "B2",
    coords: [
      [47.847131, 1.914037],
      [47.848929, 1.915078],
      [47.849052, 1.915603]
    ]
  },
  {
    from: "B2",
    to: "C3",
    coords: [
      [47.849052, 1.915603],
      [47.850000, 1.915000],
      [47.851000, 1.914200],
      [47.851791, 1.913284]
    ]
  },
  {
    from: "C3",
    to: "A1",
    coords: [
      [47.851791, 1.913284],
      [47.851573, 1.913011],
      [47.848833, 1.912645],
      [47.847805, 1.913032],
      [47.847131, 1.914037]
    ]
  }
];

var polylines = [];

function updateRoutes() {
  polylines.forEach(p => map.removeLayer(p));
  polylines = [];
  routes.forEach(r => {
    const from = intersections.find(i => i.id === r.from);
    const to = intersections.find(i => i.id === r.to);
    const colors = ["green", "orange", "red"];
    const routeColor = colors[Math.max(
      colors.indexOf(from.marker.options.color),
      colors.indexOf(to.marker.options.color)
    )];
    const polyline = L.polyline(r.coords, { color: routeColor, weight: 6, opacity: 0.7 }).addTo(map);
    polylines.push(polyline);
  });
}

updateRoutes();

setInterval(() => {
  intersections.forEach(i => {
    const traffic = randomTraffic();
    const color = getColor(traffic);
    i.marker.setStyle({ color: color });
    i.marker.bindPopup(`<b>Intersection ${i.id}</b><br/>Traffic: ${traffic}`);
  });
  updateRoutes();
}, 10000);

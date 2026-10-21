/**
 * NightSafe — Local Pedestrian Router for Elmina Township
 * 
 * Architecture: Option B — Local pedestrian graph with A* / Dijkstra shortest-path.
 * Simulated demo pedestrian network. Geometry follows approximate pedestrian road/path
 * alignments in City of Elmina, Shah Alam, Malaysia.
 * NOT surveyed or real-world verified.
 * 
 * Each node = a named pedestrian waypoint (junction, crossing, gate, etc.)
 * Each edge = a walkable segment between two nodes.
 * Edge weights = approximate walking distance in metres.
 */

// ---------------------------------------------------------------------------
// Pedestrian Graph Nodes
// Each node: { id, lat, lng, name }
// ---------------------------------------------------------------------------
export const PED_NODES = {
  // Origin cluster — The Eighth / Community Gate area
  'N-01': { lat: 3.1835, lng: 101.5120, name: 'Community Residence Gate' },
  'N-02': { lat: 3.1840, lng: 101.5128, name: 'Elmina Boulevard Entry' },
  'N-03': { lat: 3.1845, lng: 101.5135, name: 'Elmina Boulevard North' },

  // Main Avenue (Route A) — northern corridor
  'N-04': { lat: 3.1855, lng: 101.5135, name: 'North Junction A' },
  'N-05': { lat: 3.1865, lng: 101.5138, name: 'Avenue Walkway Mid' },
  'N-06': { lat: 3.1875, lng: 101.5145, name: 'Persiaran Elmina West Junction' },
  'N-07': { lat: 3.1882, lng: 101.5155, name: 'Clubhouse Crosswalk' },
  'N-08': { lat: 3.1888, lng: 101.5165, name: 'Central Park North Gate' },
  'N-09': { lat: 3.1895, lng: 101.5178, name: 'Central Park East Walk' },
  'N-10': { lat: 3.1900, lng: 101.5192, name: 'Boulevard Junction East' },
  'N-11': { lat: 3.1902, lng: 101.5205, name: 'Central Boulevard Junction' },

  // Garden Shortcut (Route B) — southern corridor
  'N-12': { lat: 3.1828, lng: 101.5135, name: 'Garden East Gate' },
  'N-13': { lat: 3.1820, lng: 101.5145, name: 'Garden Shortcut Entry' },
  'N-14': { lat: 3.1818, lng: 101.5160, name: 'Garden Path West' },
  'N-15': { lat: 3.1820, lng: 101.5175, name: 'Garden Path Mid' },
  'N-16': { lat: 3.1825, lng: 101.5190, name: 'Lakeside Connector South' },
  'N-17': { lat: 3.1833, lng: 101.5205, name: 'Garden Junction' },
  'N-18': { lat: 3.1845, lng: 101.5215, name: 'Heritage Trail Junction' },

  // Cross-connectors — links between corridors
  'N-19': { lat: 3.1855, lng: 101.5175, name: 'Granada Wellness Cross' },
  'N-20': { lat: 3.1862, lng: 101.5195, name: 'Lakeside Walk North' },

  // Destination cluster — Central Transit Stop / Lakeside Mall
  'N-21': { lat: 3.1870, lng: 101.5215, name: 'Transit Hub West' },
  'N-22': { lat: 3.1878, lng: 101.5225, name: 'Elmina Lakeside Mall Entry' },
  'N-23': { lat: 3.1885, lng: 101.5235, name: 'Central Transit Stop' },
};

// ---------------------------------------------------------------------------
// Pedestrian Graph Edges
// Each edge: [nodeId1, nodeId2, distanceMetres]
// All edges represent walkable sidewalk/path connections.
// ---------------------------------------------------------------------------
export const PED_EDGES = [
  // Origin cluster
  ['N-01', 'N-02', 90],
  ['N-01', 'N-12', 70],
  ['N-02', 'N-03', 75],
  ['N-02', 'N-13', 80],
  ['N-03', 'N-04', 105],

  // Main avenue corridor (northern)
  ['N-04', 'N-05', 105],
  ['N-05', 'N-06', 110],
  ['N-06', 'N-07', 115],
  ['N-07', 'N-08', 120],
  ['N-08', 'N-09', 145],
  ['N-09', 'N-10', 145],
  ['N-10', 'N-11', 135],
  ['N-11', 'N-21', 110],

  // Garden shortcut corridor (southern)
  ['N-12', 'N-13', 100],
  ['N-13', 'N-14', 155],
  ['N-14', 'N-15', 155],
  ['N-15', 'N-16', 155],
  ['N-16', 'N-17', 155],
  ['N-17', 'N-18', 115],
  ['N-18', 'N-21', 110],

  // Cross-connectors
  ['N-08', 'N-19', 135],
  ['N-19', 'N-17', 145],
  ['N-10', 'N-20', 120],
  ['N-20', 'N-21', 100],
  ['N-06', 'N-15', 165],
  ['N-09', 'N-19', 80],

  // Destination cluster
  ['N-21', 'N-22', 105],
  ['N-22', 'N-23', 95],
  ['N-11', 'N-22', 135],
  ['N-18', 'N-22', 80],
];

// ---------------------------------------------------------------------------
// Build adjacency list from edges (undirected)
// ---------------------------------------------------------------------------
function buildAdjacency() {
  const adj = {};
  Object.keys(PED_NODES).forEach(id => { adj[id] = []; });
  PED_EDGES.forEach(([a, b, dist]) => {
    if (adj[a] && adj[b]) {
      adj[a].push({ to: b, dist });
      adj[b].push({ to: a, dist });
    }
  });
  return adj;
}

const ADJACENCY = buildAdjacency();

// ---------------------------------------------------------------------------
// Haversine distance (metres) — used as heuristic & distance calculation
// ---------------------------------------------------------------------------
export function haversineM(a, b) {
  const R = 6371000;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const chord = sinLat * sinLat +
    Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(chord), Math.sqrt(1 - chord));
}

// ---------------------------------------------------------------------------
// Find the closest graph node to a given {lat, lng} point
// ---------------------------------------------------------------------------
export function nearestNode(latLng) {
  let bestId = null;
  let bestDist = Infinity;
  Object.entries(PED_NODES).forEach(([id, node]) => {
    const d = haversineM(latLng, node);
    if (d < bestDist) { bestDist = d; bestId = id; }
  });
  return bestId;
}

// ---------------------------------------------------------------------------
// A* search — returns ordered array of {lat, lng} coordinates, or null if unreachable
// ---------------------------------------------------------------------------
export function findPedestrianRoute(originLatLng, destLatLng, blockedEdges = []) {
  if (!originLatLng || !destLatLng) return null;

  const startId = nearestNode(originLatLng);
  const goalId  = nearestNode(destLatLng);

  if (!startId || !goalId) return null;

  if (startId === goalId) {
    const n = PED_NODES[startId];
    return { path: [{ lat: n.lat, lng: n.lng }], nodeIds: [startId], distanceM: 0 };
  }

  const blockedSet = new Set(blockedEdges.map(([a, b]) => `${a}|${b}`));
  function isBlocked(a, b) {
    return blockedSet.has(`${a}|${b}`) || blockedSet.has(`${b}|${a}`);
  }

  const goalNode = PED_NODES[goalId];
  const open = [{ id: startId, g: 0, f: haversineM(PED_NODES[startId], goalNode) }];
  const gScore = { [startId]: 0 };
  const cameFrom = {};
  const closed = new Set();

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const { id: current } = open.shift();

    if (current === goalId) {
      const nodeIds = [];
      let cur = current;
      while (cur !== undefined) {
        nodeIds.unshift(cur);
        cur = cameFrom[cur];
      }
      const path = nodeIds.map(id => {
        const n = PED_NODES[id];
        return { lat: n.lat, lng: n.lng };
      });
      const distanceM = gScore[goalId];
      return { path, nodeIds, distanceM };
    }

    closed.add(current);

    const neighbors = ADJACENCY[current] || [];
    for (const { to: neighbor, dist } of neighbors) {
      if (closed.has(neighbor)) continue;
      if (isBlocked(current, neighbor)) continue;

      const tentativeG = gScore[current] + dist;
      if (tentativeG < (gScore[neighbor] ?? Infinity)) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeG;
        const h = haversineM(PED_NODES[neighbor], goalNode);
        open.push({ id: neighbor, g: tentativeG, f: tentativeG + h });
      }
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Pre-computed named routes for RouteComparisonView & Map overlays
// ---------------------------------------------------------------------------
export const NAMED_ROUTES = {
  A: {
    nodeIds: ['N-01','N-02','N-03','N-04','N-05','N-06','N-07','N-08','N-09','N-10','N-11','N-21','N-22','N-23'],
    get path() { return this.nodeIds.map(id => ({ lat: PED_NODES[id].lat, lng: PED_NODES[id].lng })); },
    distanceM: 1380,
    etaMin: 16,
  },
  B: {
    nodeIds: ['N-01','N-12','N-13','N-14','N-15','N-16','N-17','N-18','N-21','N-22','N-23'],
    get path() { return this.nodeIds.map(id => ({ lat: PED_NODES[id].lat, lng: PED_NODES[id].lng })); },
    distanceM: 1050,
    etaMin: 13,
  },
  C: {
    nodeIds: ['N-01','N-02','N-03','N-04','N-05','N-06','N-15','N-16','N-17','N-22','N-23'],
    get path() { return this.nodeIds.map(id => ({ lat: PED_NODES[id].lat, lng: PED_NODES[id].lng })); },
    distanceM: 870,
    etaMin: 11,
  },
};

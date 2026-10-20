// NightSafe Loop - Shared Data Model & Simulated Scenario
// Hackathon Context: Sime Darby Property University Hackathon 2026

import {
  BROKEN_STREET_LIGHT_IMG,
  OVERGROWN_VEGETATION_IMG,
  DAMAGED_PATHWAY_IMG
} from '../assets/hazardImages';

export {
  CITY_OF_ELMINA_DATA,
  ELMINA_CATEGORIES,
  ELMINA_LOCATIONS,
  searchElminaLocations,
  getLocationsByCategory
} from './cityOfElminaAreas';

export const TOWNSHIP_INFO = {
  name: "Sime Darby Property — Sample Township (Demo Environment)",
  badge: "Prototype Demo · Simulated Data",
  disclaimer: "No real emergency services or streetlights are connected.",
  hackathonTrack: "People: Safety & Security, Accessibility & Inclusion, Getting Around",
  studentTeam: "2 Quantity Surveying & 2 Computer Science Students"
};

export const RESIDENT_PROFILE = {
  name: "Aina",
  title: "Aina",
  origin: "Community Residence",
  destination: "Central Transit Stop",
  estimatedTime: "8–10 min",
  emergencyContact: "Emergency Contact",
  phoneSimulated: "Active during journey",
  duressPin: "9142",
  duressPinEnabled: true
};

// Schematic lamp & checkpoint nodes across the township
export const SCHEMATIC_NODES = [
  {
    id: "L-01",
    name: "Community Residence Gate",
    area: "Origin Point",
    x: 80,
    y: 280,
    type: "checkpoint_lamp",
    defaultState: "normal", // 'normal' | 'active' | 'fault' | 'held_bright'
    description: "Well-lit entrance gate with automated sensor"
  },
  {
    id: "L-02",
    name: "North Avenue Junction",
    area: "Route A — Main Avenue",
    x: 220,
    y: 120,
    type: "checkpoint_lamp",
    defaultState: "normal",
    description: "Main avenue node with broad pedestrian sidewalk"
  },
  {
    id: "L-03",
    name: "Main Avenue Pedestrian Walkway",
    area: "Route A — Main Avenue",
    x: 420,
    y: 120,
    type: "checkpoint_lamp",
    defaultState: "normal",
    description: "Mid-avenue checkpoint with continuous paving"
  },
  {
    id: "L-04",
    name: "Central Boulevard Junction",
    area: "Route A — Main Avenue",
    x: 600,
    y: 160,
    type: "checkpoint_lamp",
    defaultState: "fault", // HZ-101 lighting deficiency reported here
    description: "Reported lighting deficiency (HZ-101). Reduced night visibility."
  },
  {
    id: "L-05",
    name: "Garden Shortcut East Gate",
    area: "Route B — Garden Shortcut",
    x: 240,
    y: 380,
    type: "checkpoint_lamp",
    defaultState: "normal",
    description: "Pedestrian gate into garden pathway"
  },
  {
    id: "L-06",
    name: "Garden Shortcut Path",
    area: "Route B — Garden Shortcut",
    x: 420,
    y: 380,
    type: "checkpoint_lamp",
    defaultState: "normal",
    description: "Partially shaded pathway with overgrown shrubs (HZ-102 & HZ-103)"
  },
  {
    id: "L-07",
    name: "Garden Junction",
    area: "Route B — Garden Shortcut",
    x: 580,
    y: 350,
    type: "checkpoint_lamp",
    defaultState: "normal",
    description: "Junction between shortcut and boulevard. Checkpoint for Duress Demo."
  },
  {
    id: "L-08",
    name: "Central Transit Stop",
    area: "Destination Point",
    x: 740,
    y: 240,
    type: "checkpoint_lamp",
    defaultState: "fault", // HZ-104 flickering lamp
    description: "Well-trafficked bus & LRT connector hub. Reported flickering lamp."
  }
];

// Route definitions with baseline and penalty breakdowns
export const SCHEMATIC_ROUTES = {
  A: {
    id: "A",
    name: "Main Avenue",
    tagline: "Recommended Night Route",
    durationMinutes: 9,
    distanceMeters: 620,
    nodes: ["L-01", "L-02", "L-03", "L-04", "L-08"],
    baseTimeIndex: 24,
    penalties: {
      lighting: 7, // fault near L-04
      sightline: 0,
      pathway: 0
    },
    totalCost: 31,
    recommended: true,
    recommendationReason: "Lower modelled environmental cost despite being slightly longer. Better continuous lighting coverage and wider walkway with unobstructed sightlines.",
    caveat: "Route cost is an illustrative environmental model index, not a guarantee of safety or crime prevention.",
    confidence: "High (validated via 3 recent daytime & dusk audits)"
  },
  B: {
    id: "B",
    name: "Garden Shortcut",
    tagline: "Fastest by distance, higher environmental penalties",
    durationMinutes: 7,
    distanceMeters: 480,
    nodes: ["L-01", "L-05", "L-06", "L-07", "L-08"],
    baseTimeIndex: 18,
    penalties: {
      lighting: 10, // unlit path segment
      sightline: 8,  // overgrown shrubs
      pathway: 7    // damaged pavers & tree roots
    },
    totalCost: 43,
    recommended: false,
    recommendationReason: "Contains multiple environmental penalties: lighting deficiency, overgrown vegetation obstructing sightlines, and damaged pavement section.",
    caveat: "Route cost is an illustrative environmental model index, not a guarantee of safety or crime prevention.",
    confidence: "Medium (pending physical inspection of pavers)"
  },
  C: {
    id: "C",
    name: "Courtyard Link",
    tagline: "Shortest walking path via residential inner courtyard",
    durationMinutes: 8,
    distanceMeters: 520,
    nodes: ["L-01", "L-05", "L-07", "L-08"],
    baseTimeIndex: 16,
    penalties: {
      lighting: 5,
      sightline: 2,
      pathway: 1
    },
    totalCost: 26,
    recommended: false,
    recommendationReason: "Shortest physical corridor connecting directly through courtyard gates with moderate night illumination.",
    caveat: "Route cost is an illustrative environmental model index, not a guarantee of safety or crime prevention.",
    confidence: "High (residential pathway check)"
  }
};

// Initial Hazards dataset — 3 feeds matched to actual site photos
export const INITIAL_HAZARDS = [
  {
    id: "HZ-103",
    title: "Severely cracked and broken pedestrian pathway",
    category: "Damaged / discontinuous pedestrian path",
    feedCategory: "Damaged Path",
    location: "Garden Shortcut midpoint",
    affectedNode: "L-06",
    routesAffected: ["B"],
    severity: "High",
    pedestrianExposure: "Medium",
    urgency: "High",
    evidenceConfidence: "High",
    status: "Reported",
    reportDate: "17 Oct 2026",
    figureUrl: DAMAGED_PATHWAY_IMG,
    figureCaption: "Severely fractured concrete path with exposed rubble and deep fissures",
    source: "Resident report",
    timestamp: "7:10 PM",
    reportedBy: "Alex Chen (Resident)",
    description: "The concrete pedestrian pathway at the Garden Shortcut midpoint has severely cracked and broken apart, with exposed gravel and rubble. The surface is highly uneven and poses a significant trip and fall hazard, especially at night.",
    estimatedCost: 4500,
    pairedInterventionId: "IN-03"
  },
  {
    id: "HZ-102",
    title: "Overgrown vegetation blocking pedestrian sightline",
    category: "Obstructed sightline",
    feedCategory: "Overgrown Vege",
    location: "Garden Shortcut near Lamp L-06",
    affectedNode: "L-06",
    routesAffected: ["B"],
    severity: "Medium",
    pedestrianExposure: "Medium",
    urgency: "Medium",
    evidenceConfidence: "High",
    status: "Under verification",
    reportDate: "18 Oct 2026",
    figureUrl: OVERGROWN_VEGETATION_IMG,
    figureCaption: "Dense overhanging tree branches encroaching across the roadside walkway",
    source: "Property Grounds Inspection",
    timestamp: "5:15 PM",
    reportedBy: "Anonymous Resident",
    description: "Heavy tree branches and overgrown shrubs are hanging over the walkway, blocking sightlines around the bend near Lamp L-06. Workers are visible attempting to clear the obstruction.",
    estimatedCost: 900,
    pairedInterventionId: "IN-02"
  },
  {
    id: "HZ-101",
    title: "Broken street lamp cover at pedestrian junction",
    category: "Lighting deficiency / faulty streetlight",
    feedCategory: "Light Broken",
    location: "Junction L-04 (Central Boulevard)",
    affectedNode: "L-04",
    routesAffected: ["A"],
    severity: "High",
    pedestrianExposure: "High",
    urgency: "High",
    evidenceConfidence: "High",
    status: "Reported",
    reportDate: "18 Oct 2026",
    figureUrl: BROKEN_STREET_LIGHT_IMG,
    figureCaption: "Street lamp casing completely shattered, bulb exposed to weather",
    source: "Resident report",
    timestamp: "8:42 PM",
    reportedBy: "Aina (Resident)",
    description: "The lamp cover on the streetlight at Junction L-04 is completely shattered. The bare bulb and wiring are exposed to rain, creating both a safety and electrical hazard for passing pedestrians.",
    estimatedCost: 1800,
    pairedInterventionId: "IN-01"
  }
];

// Candidate Interventions Catalogue (Section 5)
export const CANDIDATE_INTERVENTIONS = [
  {
    id: "IN-01",
    title: "Repair lamp L-04 at Boulevard Junction",
    category: "Lighting Maintenance",
    cost: 1800,
    modelledBenefit: 12,
    targetHazardId: "HZ-101",
    targetRoute: "Route A",
    segmentAffected: "Central Boulevard (L-04)",
    penaltyReduction: { lighting: -7 },
    explanation: "Replaces faulty luminaire with energy-efficient LED luminaire. Resolves HZ-101, reducing Route A cost by 7 points."
  },
  {
    id: "IN-02",
    title: "Trim vegetation near Garden Shortcut",
    category: "Landscape Management",
    cost: 900,
    modelledBenefit: 6,
    targetHazardId: "HZ-102",
    targetRoute: "Route B",
    segmentAffected: "Garden Shortcut Path (L-06)",
    penaltyReduction: { sightline: -6 },
    explanation: "Clears sightline obstruction around bend. Resolves HZ-102, reducing Route B cost by 6 points."
  },
  {
    id: "IN-03",
    title: "Repair damaged pathway section",
    category: "Civil Works / Footpath",
    cost: 4500,
    modelledBenefit: 15,
    targetHazardId: "HZ-103",
    targetRoute: "Route B",
    segmentAffected: "Garden Shortcut midpoint",
    penaltyReduction: { pathway: -7 },
    explanation: "Excavates intrusive roots and relevels interlocking pavers. Resolves HZ-103, reducing Route B cost by 7 points."
  },
  {
    id: "IN-04",
    title: "Repair flickering lamp near Transit Stop",
    category: "Lighting Maintenance",
    cost: 1200,
    modelledBenefit: 8,
    targetHazardId: "HZ-104",
    targetRoute: "Route A & B",
    segmentAffected: "Transit Stop Approach (L-08)",
    penaltyReduction: { lighting: -3 },
    explanation: "Replaces faulty LED driver. Resolves HZ-104, reducing environmental penalties on both routes by 3 points."
  },
  {
    id: "IN-05",
    title: "Add / improve lighting at dark path segment",
    category: "Capital Improvement",
    cost: 3000,
    modelledBenefit: 10,
    targetHazardId: null,
    targetRoute: "Route B",
    segmentAffected: "Garden Entrance (L-05 to L-06)",
    penaltyReduction: { lighting: -5 },
    explanation: "Installs supplemental solar bollard luminaires on previously unlit section of garden path."
  }
];

// Initial Alerts — seeded demo queue so the Security console is populated on first
// load. Presenter can still trigger new Duress PIN / SOS cases on top of these.
export const INITIAL_ALERTS = [
  {
    id: "AL-204",
    type: "Discreet Duress Alert",
    severity: "High",
    resident: "Aina (Demo Resident)",
    residentId: "RES-8821",
    location: "Near Lamp L-07, Garden Junction",
    lastCheckpoint: "L-07 · 9:14 PM",
    alertReceived: "9:15 PM",
    locationFreshness: "Last available demo location — not live tracking",
    status: "Awaiting security acknowledgement",
    lightingResponse: "Simulated — nearby route lights held at high brightness",
    notes: [],
    category: "Personal Safety (Discreet)",
    timestamp: "9:15 PM",
    isDuress: true
  },
  {
    id: "AL-946",
    type: "Emergency SOS Alert",
    severity: "High",
    resident: "Aina (Demo Resident)",
    residentId: "RES-8821",
    location: "Near Lamp L-04 (Central Boulevard Junction)",
    lastCheckpoint: "L-03 · 9:12 PM",
    alertReceived: "9:22 PM",
    locationFreshness: "Last available demo location — not live tracking",
    status: "Awaiting security acknowledgement",
    lightingResponse: "Simulated — nearby route lights held at high brightness",
    notes: [],
    category: "Personal Safety",
    timestamp: "9:22 PM",
    isDuress: false
  },
  {
    id: "AL-941",
    type: "Emergency SOS Alert",
    severity: "High",
    resident: "Marcus Lim (Demo Resident)",
    residentId: "RES-7734",
    location: "Near Lamp L-06 (Garden Shortcut Path)",
    lastCheckpoint: "L-05 · 9:08 PM",
    alertReceived: "9:11 PM",
    locationFreshness: "Last available demo location — not live tracking",
    status: "Response in progress",
    lightingResponse: "Simulated — corridor L-05 to L-07 held at high brightness",
    notes: [
      "9:12 PM — Officer: Alert acknowledged by Duty Security Lead.",
      "9:14 PM — Officer: Patrol unit dispatched to Garden Shortcut Path."
    ],
    category: "Personal Safety",
    timestamp: "9:11 PM",
    isDuress: false
  },
  {
    id: "AL-938",
    type: "Missed Checkpoint / No Response",
    severity: "Medium",
    resident: "Aina (Demo Resident)",
    residentId: "RES-8821",
    location: "Near Lamp L-03 (Main Avenue Pedestrian Walkway)",
    lastCheckpoint: "L-02 · 9:09 PM",
    alertReceived: "9:05 PM",
    locationFreshness: "Simulated checkpoint overdue · Prompt unconfirmed",
    status: "Acknowledged",
    lightingResponse: "Simulated — path lights held active",
    notes: ["9:06 PM — Officer: Wellbeing callback attempted, pending resident reply."],
    category: "Checkpoint Overdue",
    timestamp: "9:05 PM",
    isDuress: false
  },
  {
    id: "AL-469",
    type: "Emergency SOS Alert",
    severity: "High",
    resident: "Priya Nair (Demo Resident)",
    residentId: "RES-6612",
    location: "Near Lamp L-02 (North Avenue Junction)",
    lastCheckpoint: "L-01 · 8:52 PM",
    alertReceived: "8:54 PM",
    locationFreshness: "Last available demo location — not live tracking",
    status: "Resolved — demo",
    lightingResponse: "Simulated — corridor returned to normal mode",
    notes: [
      "8:56 PM — Officer: Patrol guard arrived on scene, resident safe.",
      "9:02 PM — Officer: Case closed, luminaires returned to corridor mode."
    ],
    category: "Personal Safety",
    timestamp: "8:54 PM",
    isDuress: false
  }
];

// Preconfigured Duress Alert (Scene 3 & 4)
export const DURESS_ALERT_SEED = {
  id: "AL-204",
  type: "Discreet Duress Alert",
  severity: "High",
  resident: "Aina (Demo Resident)",
  residentId: "RES-8821",
  location: "Near Lamp L-07, Garden Junction",
  lastCheckpoint: "L-07 · 9:14 PM",
  alertReceived: "9:15 PM",
  locationFreshness: "Last available demo location — not live tracking",
  status: "Awaiting security acknowledgement", // 'Awaiting security acknowledgement' | 'Acknowledged' | 'Response in progress' | 'Resolved — demo'
  lightingResponse: "Simulated — nearby route lights held at high brightness",
  notes: [],
  category: "Personal Safety (Discreet)",
  timestamp: "9:15 PM",
  isDuress: true
};

// Checkpoint event log
export const INITIAL_CHECKPOINT_EVENTS = [
  {
    id: "CP-301",
    checkpointId: "L-01",
    checkpointName: "Community Residence Gate",
    residentName: "Aina (Demo Resident)",
    timestamp: "9:05 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  },
  {
    id: "CP-302",
    checkpointId: "L-02",
    checkpointName: "North Avenue Junction",
    residentName: "Aina (Demo Resident)",
    timestamp: "9:09 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  },
  {
    id: "CP-303",
    checkpointId: "L-03",
    checkpointName: "Main Avenue Pedestrian Walkway",
    residentName: "Aina (Demo Resident)",
    timestamp: "9:12 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  },
  {
    id: "CP-304",
    checkpointId: "L-04",
    checkpointName: "Central Boulevard Junction",
    residentName: "Aina (Demo Resident)",
    timestamp: "9:16 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  },
  {
    id: "CP-305",
    checkpointId: "L-05",
    checkpointName: "Garden Shortcut East Gate",
    residentName: "Marcus Lim (Demo Resident)",
    timestamp: "9:08 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  },
  {
    id: "CP-306",
    checkpointId: "L-06",
    checkpointName: "Garden Shortcut Path",
    residentName: "Marcus Lim (Demo Resident)",
    timestamp: "9:10 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  },
  {
    id: "CP-307",
    checkpointId: "L-07",
    checkpointName: "Garden Junction",
    residentName: "Aina (Demo Resident)",
    timestamp: "9:14 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  },
  {
    id: "CP-308",
    checkpointId: "L-08",
    checkpointName: "Central Transit Stop",
    residentName: "Priya Nair (Demo Resident)",
    timestamp: "8:58 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  }
];

// Knapsack 0/1 Budget Optimisation helper
export function solveKnapsackBudget(budget, items = CANDIDATE_INTERVENTIONS) {
  const n = items.length;
  const b = Math.floor(budget);
  
  // DP table: dp[i][w] = max benefit using first i items with budget w
  // Scale budget by step of 100 for fast dynamic programming
  const step = 100;
  const scaledB = Math.max(0, Math.floor(b / step));
  const dp = Array.from({ length: n + 1 }, () => new Array(scaledB + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    const itemWeight = Math.ceil(item.cost / step);
    const itemVal = item.modelledBenefit;

    for (let w = 0; w <= scaledB; w++) {
      if (itemWeight <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - itemWeight] + itemVal);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find selected items
  let w = scaledB;
  const selected = [];
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      const item = items[i - 1];
      selected.push(item.id);
      w -= Math.ceil(item.cost / step);
    }
  }

  const selectedItems = items.filter(it => selected.includes(it.id));
  const totalCost = selectedItems.reduce((acc, it) => acc + it.cost, 0);
  const totalBenefit = selectedItems.reduce((acc, it) => acc + it.modelledBenefit, 0);
  const remainingBudget = budget - totalCost;

  const excludedItems = items
    .filter(it => !selected.includes(it.id))
    .map(it => ({
      ...it,
      reason: it.cost > remainingBudget
        ? `Exceeds remaining budget (requires RM ${it.cost.toLocaleString()}, RM ${remainingBudget.toLocaleString()} left)`
        : `Lower benefit-to-cost efficiency under current model weights`
    }));

  return {
    selectedIds: selected,
    selectedItems,
    excludedItems,
    totalCost,
    totalBenefit,
    remainingBudget
  };
}

// Model formula: Route Cost = Base Time Index + Lighting Penalty + Sightline Penalty + Pathway Penalty
export function calculateRouteCost(routeId, appliedInterventions = []) {
  const base = SCHEMATIC_ROUTES[routeId];
  let lightingPenalty = base.penalties.lighting;
  let sightlinePenalty = base.penalties.sightline;
  let pathwayPenalty = base.penalties.pathway;

  // Apply reductions if selected interventions are marked applied
  appliedInterventions.forEach(id => {
    const intervention = CANDIDATE_INTERVENTIONS.find(it => it.id === id);
    if (!intervention) return;
    if (intervention.penaltyReduction.lighting) {
      if (routeId === 'A' && (id === 'IN-01' || id === 'IN-04')) {
        lightingPenalty = Math.max(0, lightingPenalty + intervention.penaltyReduction.lighting);
      }
      if (routeId === 'B' && (id === 'IN-04' || id === 'IN-05')) {
        lightingPenalty = Math.max(0, lightingPenalty + intervention.penaltyReduction.lighting);
      }
    }
    if (intervention.penaltyReduction.sightline && routeId === 'B' && id === 'IN-02') {
      sightlinePenalty = Math.max(0, sightlinePenalty + intervention.penaltyReduction.sightline);
    }
    if (intervention.penaltyReduction.pathway && routeId === 'B' && id === 'IN-03') {
      pathwayPenalty = Math.max(0, pathwayPenalty + intervention.penaltyReduction.pathway);
    }
  });

  const total = base.baseTimeIndex + lightingPenalty + sightlinePenalty + pathwayPenalty;
  return {
    baseTimeIndex: base.baseTimeIndex,
    lightingPenalty,
    sightlinePenalty,
    pathwayPenalty,
    totalCost: total,
    delta: base.totalCost - total
  };
}

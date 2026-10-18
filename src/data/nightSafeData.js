// NightSafe Loop - Shared Data Model & Simulated Scenario
// Hackathon Context: Sime Darby Property University Hackathon 2026

export const TOWNSHIP_INFO = {
  name: "Sime Darby Property — Sample Township (Demo Environment)",
  badge: "Prototype Demo · Simulated Data",
  disclaimer: "No real emergency services or streetlights are connected.",
  hackathonTrack: "People: Safety & Security, Accessibility & Inclusion, Getting Around",
  studentTeam: "2 Quantity Surveying & 2 Computer Science Students"
};

export const RESIDENT_PROFILE = {
  name: "Aina",
  title: "Aina (Demo Resident)",
  origin: "Community Residence",
  destination: "Central Transit Stop",
  estimatedTime: "8–10 min",
  emergencyContact: "Demo Contact",
  phoneSimulated: "Only active during journey simulation",
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
  }
};

// Initial Hazards dataset (Section 5)
export const INITIAL_HAZARDS = [
  {
    id: "HZ-101",
    title: "Lighting deficiency at Junction L-04",
    category: "Lighting deficiency / faulty streetlight",
    location: "Junction L-04 (Central Boulevard)",
    affectedNode: "L-04",
    routesAffected: ["A"],
    severity: "High",
    pedestrianExposure: "High",
    urgency: "High",
    evidenceConfidence: "Medium",
    status: "Reported", // 'Reported' | 'Under verification' | 'Verified' | 'In progress' | 'Resolved'
    source: "Resident report",
    timestamp: "8:42 PM · Demo data",
    reportedBy: "Resident (Simulated)",
    description: "Sodium-vapour luminaire flickers intermittently and dims to < 5 lux on pedestrian crossing.",
    estimatedCost: 1800,
    pairedInterventionId: "IN-01"
  },
  {
    id: "HZ-102",
    title: "Overgrown vegetation obstructing sightline",
    category: "Obstructed sightline",
    location: "Garden Shortcut near Lamp L-06",
    affectedNode: "L-06",
    routesAffected: ["B"],
    severity: "Medium",
    pedestrianExposure: "Medium",
    urgency: "Medium",
    evidenceConfidence: "High",
    status: "Under verification",
    source: "Property Grounds Inspection",
    timestamp: "5:15 PM · Demo data",
    reportedBy: "Landscape Inspector (Simulated)",
    description: "Thick ficus branches have grown across the pedestrian sightline between L-05 and L-06 bend.",
    estimatedCost: 900,
    pairedInterventionId: "IN-02"
  },
  {
    id: "HZ-103",
    title: "Uneven / damaged pathway section",
    category: "Damaged / discontinuous pedestrian path",
    location: "Garden Shortcut midpoint",
    affectedNode: "L-06",
    routesAffected: ["B"],
    severity: "High",
    pedestrianExposure: "Medium",
    urgency: "High",
    evidenceConfidence: "Medium",
    status: "Reported",
    source: "Resident report",
    timestamp: "7:10 PM · Demo data",
    reportedBy: "Resident (Simulated)",
    description: "Tree root heaving has cracked 6 linear metres of interlocking concrete paving; trip hazard in poor light.",
    estimatedCost: 4500,
    pairedInterventionId: "IN-03"
  },
  {
    id: "HZ-104",
    title: "Streetlight flickering near Central Transit Stop",
    category: "Lighting deficiency / faulty streetlight",
    location: "Lamp L-08 (Transit Approach)",
    affectedNode: "L-08",
    routesAffected: ["A", "B"],
    severity: "Medium",
    pedestrianExposure: "High",
    urgency: "Medium",
    evidenceConfidence: "Low",
    status: "Needs verification",
    source: "Resident report",
    timestamp: "9:02 PM · Demo data",
    reportedBy: "Commuter (Simulated)",
    description: "LED driver cycles every 40 seconds near the pedestrian ramp leading into LRT station.",
    estimatedCost: 1200,
    pairedInterventionId: "IN-04"
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

// Initial Alerts (Empty by default until triggered by presenter in demo storyline)
export const INITIAL_ALERTS = [];

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

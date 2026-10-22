import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TOWNSHIP_INFO,
  RESIDENT_PROFILE,
  SCHEMATIC_NODES,
  SCHEMATIC_ROUTES,
  INITIAL_HAZARDS,
  CANDIDATE_INTERVENTIONS,
  DURESS_ALERT_SEED,
  INITIAL_ALERTS,
  INITIAL_CHECKPOINT_EVENTS,
  solveKnapsackBudget,
  calculateRouteCost
} from '../data/nightSafeData';

const NightSafeContext = createContext();

/** Strip legacy prototype suffixes from cached alert records (e.g. "Resolved — demo"). */
function normalizeAlertRecord(alert) {
  if (!alert) return alert;
  const status =
    typeof alert.status === 'string'
      ? alert.status.replace(/\s*[—–-]\s*demo\s*$/i, '').trim()
      : alert.status;
  const locationFreshness =
    typeof alert.locationFreshness === 'string'
      ? alert.locationFreshness.replace(/Last available demo location/i, 'Last recorded location')
      : alert.locationFreshness;
  return {
    ...alert,
    status,
    locationFreshness,
    resident: alert.resident ? alert.resident.replace(/\s*\(Demo Resident\)/gi, '') : alert.resident
  };
}

export function NightSafeProvider({ children }) {
  // Current demo role: 'select' | 'resident' | 'security' | 'property'
  const [role, setRole] = useState(() => {
    return localStorage.getItem('ns_role') || 'select';
  });

  // Current active sub-tab per role
  const [residentTab, setResidentTab] = useState('home'); // 'home' | 'routes' | 'journey' | 'safety' | 'duress-setup' | 'duress-trigger' | 'sos' | 'checkpoints' | 'report' | 'my-reports' | 'settings'
  const [securityTab, setSecurityTab] = useState('overview'); // 'overview' | 'alert-detail' | 'checkpoints' | 'history'
  const [propertyTab, setPropertyTab] = useState('overview'); // 'overview' | 'hazard-map' | 'reports' | 'ranking' | 'budget' | 'lighting'

  // Selected alert in Security view
  const [selectedAlertId, setSelectedAlertId] = useState('AL-204');

  // Selected hazard in Property view
  const [selectedHazardId, setSelectedHazardId] = useState('HZ-101');

  // Priority Model weights (Screen M4)
  const [priorityWeights, setPriorityWeights] = useState({
    severity: 40,
    exposure: 35,
    urgency: 25
  });

  // Resident Journey state
  const [selectedRouteId, setSelectedRouteId] = useState('A');
  const [routeCategory, setRouteCategory] = useState('safest'); // 'safest' | 'fastest' | 'shortest'
  const [journeyStatus, setJourneyStatus] = useState('idle'); // 'idle' | 'in_progress' | 'ended'
  const [journeyOrigin, setJourneyOrigin] = useState('The Eighth, Elmina Green');
  const [journeyDestination, setJourneyDestination] = useState('Elmina Lakeside Mall');
  const [demoRouteFallback, setDemoRouteFallback] = useState(false);
  const [checkpointIndex, setCheckpointIndex] = useState(0);
  const [passedCheckpoints, setPassedCheckpoints] = useState(['L-01']);
  const [missedCheckpointPrompt, setMissedCheckpointPrompt] = useState(false);
  const [checkinsEnabled, setCheckinsEnabled] = useState(true);

  // Lighting simulation states
  const [activeLamps, setActiveLamps] = useState(['L-01', 'L-02']);

  // Fall detection simulation state
  const [fallDetectionActive, setFallDetectionActive] = useState(false);

  // Unsafe / Assistance request at streetlight simulation state
  const [unsafeAssistanceActive, setUnsafeAssistanceActive] = useState(false);
  const [unsafeAssistanceNode, setUnsafeAssistanceNode] = useState(null);

  // PIN configuration (Normal cancel PIN + Duress fake cancel PIN)
  const [duressConfig, setDuressConfig] = useState(() => {
    const saved = localStorage.getItem('ns_pin_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          enabled: parsed.enabled ?? true,
          pin: parsed.pin || '9142',
          normalPin: parsed.normalPin || '1234'
        };
      } catch (e) {}
    }
    return {
      enabled: true,
      pin: '9142',
      normalPin: '1234'
    };
  });
  const [duressTriggered, setDuressTriggered] = useState(false);

  // Security Alerts list  —  seeded with demo queue on first load
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('ns_alerts');
    if (!saved) return INITIAL_ALERTS;
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(normalizeAlertRecord);
    } catch {
      return INITIAL_ALERTS;
    }
  });

  // Hazards list  —  guaranteed reliable images and synchronized across all roles
  const [hazards, setHazards] = useState(() => {
    const saved = localStorage.getItem('ns_hazards');
    if (!saved) return INITIAL_HAZARDS;
    try {
      const parsed = JSON.parse(saved);
      // Map seed hazards so figureUrl, severity, feedCategory, assignedPath always reflect latest data
      const mergedSeeds = INITIAL_HAZARDS.map(initH => {
        const existing = parsed.find(p => p.id === initH.id);
        return existing
          ? {
              ...initH,
              ...existing,
              status: initH.id === 'HZ-107' && existing.status === 'Scheduled'
                ? initH.status
                : existing.status || initH.status,
              figureUrl: initH.figureUrl,
              feedCategory: initH.feedCategory,
              assignedPath: initH.assignedPath || existing.assignedPath,
              reportedBy: initH.reportedBy,
              severity: existing.severity || initH.severity,
              upvotes: existing.upvotes ?? initH.upvotes ?? 0,
              validatedBy: existing.validatedBy || initH.validatedBy || []
            }
          : initH;
      });
      const userAdded = parsed.filter(p => !INITIAL_HAZARDS.some(initH => initH.id === p.id));
      return [...mergedSeeds, ...userAdded];
    } catch {
      return INITIAL_HAZARDS;
    }
  });

  // Checkpoint events
  const [checkpointEvents, setCheckpointEvents] = useState(() => {
    const saved = localStorage.getItem('ns_checkpoints');
    if (!saved) return INITIAL_CHECKPOINT_EVENTS;
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(cp => ({
        ...cp,
        residentName: cp.residentName ? cp.residentName.replace(/\s*\(Demo Resident\)/gi, '') : cp.residentName
      }));
    } catch {
      return INITIAL_CHECKPOINT_EVENTS;
    }
  });

  // Budget Optimization (Screen M5)
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('ns_budget');
    return saved ? Number(saved) : 5000;
  });
  const [optimisedPlan, setOptimisedPlan] = useState(() => solveKnapsackBudget(5000));
  const [appliedInterventions, setAppliedInterventions] = useState(() => {
    const saved = localStorage.getItem('ns_applied_interventions');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  const [planApplied, setPlanApplied] = useState(() => {
    const saved = localStorage.getItem('ns_applied_interventions');
    if (!saved) return false;
    try {
      const arr = JSON.parse(saved);
      return Array.isArray(arr) && arr.length > 0;
    } catch {
      return false;
    }
  });

  // Toast notifications
  const [toast, setToast] = useState(null);

  // Storyline Presenter Helper (Scenes 0 to 8)
  const [storylineStep, setStorylineStep] = useState(0);
  const [isStorylineDrawerOpen, setIsStorylineDrawerOpen] = useState(false);

  useEffect(() => {
    setHazards(currentHazards => {
      const hasScheduledSeed = currentHazards.some(
        hazard => hazard.id === 'HZ-107' && hazard.status === 'Scheduled'
      );
      if (!hasScheduledSeed) return currentHazards;
      return currentHazards.map(hazard =>
        hazard.id === 'HZ-107' && hazard.status === 'Scheduled'
          ? { ...hazard, status: 'Resolved' }
          : hazard
      );
    });
  }, []);

  // Cross-tab / cross-window synchronization via storage events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!e.newValue) return;
      try {
        if (e.key === 'ns_hazards') {
          const updatedHazards = JSON.parse(e.newValue);
          setHazards(updatedHazards);
        } else if (e.key === 'ns_alerts') {
          const updatedAlerts = JSON.parse(e.newValue);
          setAlerts(updatedAlerts);
        } else if (e.key === 'ns_checkpoints') {
          const updatedCheckpoints = JSON.parse(e.newValue);
          setCheckpointEvents(updatedCheckpoints);
        } else if (e.key === 'ns_applied_interventions') {
          const updatedPlan = JSON.parse(e.newValue);
          setAppliedInterventions(updatedPlan);
          setPlanApplied(updatedPlan.length > 0);
        }
      } catch (err) {
        console.error('Error syncing cross-tab storage:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ns_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('ns_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('ns_hazards', JSON.stringify(hazards));
  }, [hazards]);

  useEffect(() => {
    localStorage.setItem('ns_checkpoints', JSON.stringify(checkpointEvents));
  }, [checkpointEvents]);

  useEffect(() => {
    localStorage.setItem('ns_pin_config', JSON.stringify(duressConfig));
  }, [duressConfig]);

  useEffect(() => {
    localStorage.setItem('ns_budget', String(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('ns_applied_interventions', JSON.stringify(appliedInterventions));
  }, [appliedInterventions]);

  // Toast timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  };

  // Re-run knapsack when budget changes
  useEffect(() => {
    setOptimisedPlan(solveKnapsackBudget(budget));
  }, [budget]);

  // Navigation helper
  const navigateRole = (newRole, optionalTab = null) => {
    setRole(newRole);
    if (optionalTab) {
      if (newRole === 'resident') setResidentTab(optionalTab);
      if (newRole === 'security') setSecurityTab(optionalTab);
      if (newRole === 'property') setPropertyTab(optionalTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // -------------------------------------------------------------
  // RESIDENT ACTIONS
  // -------------------------------------------------------------

  // Start journey (Scene 2)
  const startJourney = (routeId = selectedRouteId) => {
    setSelectedRouteId(routeId);
    setJourneyStatus('in_progress');
    setCheckpointIndex(0);
    setPassedCheckpoints(['L-01']);
    setMissedCheckpointPrompt(false);

    const route = SCHEMATIC_ROUTES[routeId];
    setActiveLamps(route.nodes.slice(0, 3)); // track first few nodes for checkpoint display
    setResidentTab('journey');
    showToast(
      journeyOrigin && journeyDestination
        ? `Walking route started to ${journeyDestination}.`
        : `Journey started along ${route.name}.`,
      'success'
    );
  };

  // Simulate passing checkpoint (e.g. L-03)
  const simulatePassCheckpoint = (nodeId = 'L-03') => {
    const route = SCHEMATIC_ROUTES[selectedRouteId];
    const nodeIndex = route.nodes.indexOf(nodeId);
    
    if (nodeIndex !== -1) {
      setCheckpointIndex(nodeIndex);
      const passed = route.nodes.slice(0, nodeIndex + 1);
      setPassedCheckpoints(passed);

      // Track current position in checkpoint nodes
      const ahead = route.nodes.slice(nodeIndex, nodeIndex + 3);
      setActiveLamps(ahead);

      // Add to checkpoint audit event log
      const newEvent = {
        id: `CP-${Date.now().toString().slice(-4)}`,
        checkpointId: nodeId,
        checkpointName: SCHEMATIC_NODES.find(n => n.id === nodeId)?.name || nodeId,
        residentName: RESIDENT_PROFILE.title,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Passed',
        source: 'Simulated Checkpoint Node'
      };
      setCheckpointEvents(prev => [newEvent, ...prev]);

      showToast(`Checkpoint ${nodeId} passed.`, 'success');
    }
  };

  // Simulate missed checkpoint prompt (Screen R8)
  const simulateMissedCheckpoint = () => {
    setMissedCheckpointPrompt(true);
    showToast('Simulated: Checkpoint ping overdue. Confirmation prompt displayed.', 'warning');
  };

  const resolveMissedPrompt = (responseType) => {
    setMissedCheckpointPrompt(false);
    if (responseType === 'okay') {
      showToast("Check-in confirmed: Resident marked 'I am okay'.", 'success');
    } else if (responseType === 'help' || responseType === 'unsafe') {
      const route = SCHEMATIC_ROUTES[selectedRouteId] || SCHEMATIC_ROUTES.A;
      const currentNode = route.nodes[checkpointIndex] || route.nodes[0];
      triggerUnsafeAssistance(currentNode);
    } else if (responseType === 'no_response') {
      // Create follow up alert for security
      const followUpAlert = {
        id: `AL-${Date.now().toString().slice(-3)}`,
        type: 'Missed Checkpoint / No Response',
        severity: 'Medium',
        resident: RESIDENT_PROFILE.title,
        residentId: 'RES-8821',
        location: 'Near Lamp L-03 (Boulevard Walkway)',
        lastCheckpoint: 'L-02  ·  9:09 PM',
        alertReceived: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        locationFreshness: 'Simulated checkpoint overdue  ·  Prompt unconfirmed',
        status: 'Awaiting security acknowledgement',
        notes: ['Automatic prompt timed out after 90 seconds in simulation.'],
        category: 'Checkpoint Overdue',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDuress: false
      };
      setAlerts(prev => [followUpAlert, ...prev]);
      showToast('Simulated follow-up alert dispatched to Security Dashboard.', 'warning');
    }
  };

  // End journey
  const endJourney = () => {
    setJourneyStatus('ended');
    setActiveLamps([]);
    setMissedCheckpointPrompt(false);
    showToast('Journey ended. Simulated location sharing stopped.', 'info');
  };

  // Trigger Duress PIN discreetly (Scene 3 - Screen R6)
  const triggerDuressPin = () => {
    setDuressTriggered(true);

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Look for existing active AL-204
    setAlerts(prev => {
      const existing = prev.find(a => a.id === 'AL-204');
      if (existing) {
        // Update alert received without duplicating
        return prev.map(a => a.id === 'AL-204' ? {
          ...a,
          alertReceived: nowStr,
          timestamp: nowStr,
          status: 'Awaiting security acknowledgement'
        } : a);
      }
      const duressAlert = {
        ...DURESS_ALERT_SEED,
        id: 'AL-204',
        alertReceived: nowStr,
        timestamp: nowStr,
        status: 'Awaiting security acknowledgement',
        isDuress: true,
        assignedGuard: null
      };
      return [duressAlert, ...prev];
    });

    // Subtly navigate or keep resident screen neutral
    setResidentTab('home');
    showToast('Request received. (UI remains neutral for user safety)', 'info');
  };

  // Trigger Overt SOS (Screen R7) — returns the existing active or new alert ID
  const triggerSos = (category = 'Personal Safety', specificNode = null) => {
    // Check if an unacknowledged SOS alert already exists from this resident
    const activeUnack = alerts.find(a => 
      a.residentId === 'RES-8821' && 
      !a.isDuress && 
      (a.status === 'Awaiting security acknowledgement' || a.status === 'Response in progress')
    );
    if (activeUnack) {
      showToast(`Active SOS alert ${activeUnack.id} is already in progress.`, 'warning');
      return activeUnack.id;
    }

    const route = SCHEMATIC_ROUTES[selectedRouteId] || SCHEMATIC_ROUTES.A;
    const currentNode = specificNode || route.nodes[checkpointIndex] || 'L-04';
    const nodeObj = SCHEMATIC_NODES.find(n => n.id === currentNode);
    const locName = nodeObj ? `${nodeObj.name} (${currentNode})` : `Near Lamp ${currentNode}`;

    // Generate unique stable ID
    const existingNums = alerts
      .map(a => parseInt(a.id?.replace(/[^0-9]/g, ''), 10))
      .filter(n => !isNaN(n));
    const maxNum = existingNums.length > 0 ? Math.max(...existingNums, 204) : 204;
    const newId = `AL-${maxNum + 1}`;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newAlert = {
      id: newId,
      type: 'Emergency SOS Alert',
      severity: 'High',
      resident: RESIDENT_PROFILE.title,
      residentId: 'RES-8821',
      location: locName,
      lastCheckpoint: `${currentNode} · ${nowStr}`,
      alertReceived: nowStr,
      locationFreshness: 'Simulated checkpoint fix — live tracking active',
      status: 'Awaiting security acknowledgement',
      assignedGuard: null,
      notes: [],
      category,
      timestamp: nowStr,
      isDuress: false
    };

    setAlerts(prev => [newAlert, ...prev]);
    showToast(`Emergency SOS alert ${newId} dispatched to Security Operations.`, 'warning');
    return newId;
  };

  // Fall Detection Simulation Demo
  const triggerFallDetectionDemo = () => {
    setFallDetectionActive(true);
    showToast('Simulated phone accelerometer fall impact (3.8G)!', 'warning');
  };

  const cancelFallDetection = () => {
    setFallDetectionActive(false);
  };

  // Unsafe / Assistance request at streetlight simulation demo
  const triggerUnsafeAssistance = (nodeId = null) => {
    const route = SCHEMATIC_ROUTES[selectedRouteId] || SCHEMATIC_ROUTES.A;
    const currentNode = nodeId || route.nodes[checkpointIndex] || route.nodes[0];
    setUnsafeAssistanceNode(currentNode);
    setUnsafeAssistanceActive(true);
    setMissedCheckpointPrompt(false); // dismiss check-in prompt if open
    showToast(`Assistance request initiated at Streetlight ${currentNode}. 10s countdown active.`, 'warning');
  };

  const cancelUnsafeAssistance = () => {
    setUnsafeAssistanceActive(false);
    setUnsafeAssistanceNode(null);
  };

  // Walking Demo: advance to next node and trigger safety confirmation modal
  const triggerWalkingDemo = () => {
    const route = SCHEMATIC_ROUTES[selectedRouteId] || SCHEMATIC_ROUTES.A;
    const nextIdx = (checkpointIndex + 1) % route.nodes.length;
    const nextNodeId = route.nodes[nextIdx];

    setCheckpointIndex(nextIdx);
    const passed = route.nodes.slice(0, nextIdx + 1);
    setPassedCheckpoints(passed);

    // Track current position nodes
    const ahead = route.nodes.slice(nextIdx, nextIdx + 3);
    setActiveLamps(ahead);

    // Log checkpoint event
    const newEvent = {
      id: `CP-${Date.now().toString().slice(-4)}`,
      checkpointId: nextNodeId,
      checkpointName: SCHEMATIC_NODES.find(n => n.id === nextNodeId)?.name || nextNodeId,
      residentName: RESIDENT_PROFILE.title,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Passed',
      source: 'Walking Demo Sensor'
    };
    setCheckpointEvents(prev => [newEvent, ...prev]);

    // Popup safety confirmation message
    setMissedCheckpointPrompt(true);
    showToast(`Arrived at Node ${nextNodeId}. Please confirm your safety.`, 'info');
  };

  // Toggle community hazard validation / upvote
  const toggleHazardValidation = (hazardId, residentId = RESIDENT_PROFILE.id || 'RES-8821') => {
    let outcome = 'added';
    setHazards(prev => prev.map(h => {
      if (h.id !== hazardId) return h;
      const validatedList = Array.isArray(h.validatedBy) ? h.validatedBy : [];
      const hasValidated = validatedList.includes(residentId);
      const currentVotes = typeof h.upvotes === 'number' ? h.upvotes : 0;
      
      const newVotes = hasValidated ? Math.max(0, currentVotes - 1) : currentVotes + 1;
      const newList = hasValidated
        ? validatedList.filter(id => id !== residentId)
        : [...validatedList, residentId];
      
      outcome = hasValidated ? 'removed' : 'added';

      // Dynamically compute evidence confidence based on validations & status
      let newConfidence = h.evidenceConfidence || 'Medium';
      if (newVotes >= 10 || h.figureUrl) {
        newConfidence = 'High';
      } else if (newVotes >= 3) {
        newConfidence = 'Medium';
      } else {
        newConfidence = 'Low';
      }

      return {
        ...h,
        upvotes: newVotes,
        validatedBy: newList,
        evidenceConfidence: newConfidence
      };
    }));

    if (outcome === 'added') {
      showToast('Thank you for confirming this community hazard report!', 'success');
    } else {
      showToast('Hazard confirmation removed.', 'info');
    }
  };

  // Submit hazard report (Scene 5 - Screen R9)
  const submitHazardReport = ({ category, location, severity, description, title, contactInfo, affectedNode = 'L-04', figureUrl = null, figureCaption = null }) => {
    // Generate unique stable ID by taking max existing HZ number + 1
    const existingNums = hazards
      .map(h => parseInt(h.id?.replace(/[^0-9]/g, ''), 10))
      .filter(n => !isNaN(n));
    const maxNum = existingNums.length > 0 ? Math.max(...existingNums, 107) : 107;
    const newId = `HZ-${maxNum + 1}`;

    // Map canonical feedCategory from category or title
    const text = ((category || '') + ' ' + (title || '')).toLowerCase();
    let feedCategory = 'Environmental Hazard';
    if (text.includes('path') || text.includes('pavement') || text.includes('paver')) feedCategory = 'Damaged Path';
    else if (text.includes('vegetation') || text.includes('sightline') || text.includes('vege') || text.includes('hedge')) feedCategory = 'Overgrown Vege';
    else if (text.includes('light') || text.includes('lamp') || text.includes('illumination')) feedCategory = 'Light Broken';

    // Infer affected route based on node
    const routesAffected = [];
    Object.entries(SCHEMATIC_ROUTES).forEach(([rId, rData]) => {
      if (rData.nodes?.includes(affectedNode)) routesAffected.push(rId);
    });
    if (routesAffected.length === 0) routesAffected.push('A');

    const defaultImages = {
      'Light Broken': '/broken-street-light-2.jpeg',
      'Damaged Path': '/damaged-pathway-2.jpeg',
      'Overgrown Vege': '/overgrown-vegetation-2.jpeg'
    };

    const newHazard = {
      id: newId,
      title: title || `${category.split('/')[0].trim()} at ${location}`,
      category,
      feedCategory,
      location,
      contactInfo: contactInfo || '',
      affectedNode,
      assignedPath: `Route ${routesAffected[0]}`,
      routesAffected,
      severity: severity || 'Medium',
      pedestrianExposure: 'High',
      urgency: severity === 'High' ? 'High' : 'Medium',
      evidenceConfidence: figureUrl ? 'High' : 'Medium',
      status: 'Reported',
      reportDate: 'Today',
      upvotes: 1,
      validatedBy: [RESIDENT_PROFILE.id || 'RES-8821'],
      source: 'Resident report',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reportedBy: RESIDENT_PROFILE.title || 'Aina (Resident)',
      description: description || 'Reported by resident via mobile prototype form.',
      figureUrl: figureUrl || defaultImages[feedCategory] || '/broken-street-light-2.jpeg',
      figureCaption: figureCaption || `Resident photo evidence at node ${affectedNode}`,
      estimatedCost: severity === 'High' ? 2200 : 1200,
      pairedInterventionId: null
    };

    setHazards(prev => [newHazard, ...prev]);
    showToast(`Hazard report ${newId} submitted. Visible in Property Management console.`, 'success');
    return newHazard;
  };

  // -------------------------------------------------------------
  // SECURITY ACTIONS (Screens S1 - S4)
  // -------------------------------------------------------------

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, status: 'Acknowledged' } : a
    ));
    showToast(`Alert ${alertId} acknowledged by Duty Security Lead.`, 'success');
  };

  const assignGuardToAlert = (alertId, guardId, guardName) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts(prev => prev.map(a => {
      if (a.id !== alertId) return a;
      return {
        ...a,
        assignedGuard: guardName,
        status: 'Response in progress',
        notes: [...(a.notes || []), `${now} — Dispatch: ${guardName} assigned to respond at ${a.location}.`]
      };
    }));
    showToast(`${guardName} assigned and dispatched to ${alertId}.`, 'success');
  };

  const markResponseInProgress = (alertId) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, status: 'Response in progress' } : a
    ));
    showToast(`Alert ${alertId} status marked: 'Response in progress'.`, 'info');
  };

  const addAlertNote = (alertId, noteText) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts(prev => prev.map(a => {
      if (a.id !== alertId) return a;
      return {
        ...a,
        notes: [...(a.notes || []), `${now}  —  Officer: ${noteText}`]
      };
    }));
    showToast('Incident audit note appended.', 'success');
  };

  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, status: 'Resolved' } : a
    ));
    showToast(`Alert ${alertId} marked as 'Resolved'.`, 'info');
  };

  // -------------------------------------------------------------
  // PROPERTY MANAGEMENT ACTIONS (Screens M1 - M8)
  // -------------------------------------------------------------

  const updateHazardStatus = (hazardId, newStatus) => {
    setHazards(prev => prev.map(h => 
      h.id === hazardId ? { ...h, status: newStatus } : h
    ));
    showToast(`Hazard ${hazardId} updated to '${newStatus}'.`, 'success');
  };

  const updateHazardMetric = (hazardId, field, value) => {
    setHazards(prev => prev.map(h => 
      h.id === hazardId ? { ...h, [field]: value } : h
    ));
  };

  const applySelectedPlan = (customIds) => {
    const ids = Array.isArray(customIds) ? customIds : optimisedPlan.selectedIds;
    setAppliedInterventions(ids);
    setPlanApplied(true);

    // Also update matching hazards to 'Verified' or 'In progress'
    setHazards(prev => prev.map(h => {
      if (ids.includes(h.pairedInterventionId)) {
        return { ...h, status: 'In progress' };
      }
      return h;
    }));

    showToast(`Maintenance plan applied! Modelled route conditions updated for Route A & B.`, 'success');
  };

  const resetAppliedPlan = () => {
    setAppliedInterventions([]);
    setPlanApplied(false);
    showToast('Applied plan reset to baseline.', 'info');
  };

  // -------------------------------------------------------------
  // RESET DEMO SCENARIO (Section 4 & 5)
  // -------------------------------------------------------------
  const resetDemoScenario = () => {
    setRole('select');
    setResidentTab('home');
    setSecurityTab('overview');
    setPropertyTab('overview');
    setSelectedRouteId('A');
    setJourneyStatus('idle');
    setDemoRouteFallback(false);
    setCheckpointIndex(0);
    setPassedCheckpoints(['L-01']);
    setMissedCheckpointPrompt(false);
    setActiveLamps(['L-01', 'L-02']);
    setDuressTriggered(false);
    setAlerts(INITIAL_ALERTS);
    setHazards(INITIAL_HAZARDS);
    setCheckpointEvents(INITIAL_CHECKPOINT_EVENTS);
    setBudget(5000);
    setOptimisedPlan(solveKnapsackBudget(5000));
    setAppliedInterventions([]);
    setPlanApplied(false);
    setStorylineStep(0);
    
    localStorage.removeItem('ns_role');
    localStorage.removeItem('ns_alerts');
    localStorage.removeItem('ns_hazards');
    localStorage.removeItem('ns_checkpoints');
    localStorage.removeItem('ns_pin_config');
    localStorage.removeItem('ns_budget');
    localStorage.removeItem('ns_applied_interventions');

    showToast('Demo scenario reset to initial clean state.', 'info');
  };

  return (
    <NightSafeContext.Provider
      value={{
        // Role & Tab Navigation
        role,
        setRole,
        residentTab,
        setResidentTab,
        securityTab,
        setSecurityTab,
        propertyTab,
        setPropertyTab,
        navigateRole,
        selectedAlertId,
        setSelectedAlertId,
        selectedHazardId,
        setSelectedHazardId,

        // Data & Models
        townshipInfo: TOWNSHIP_INFO,
        residentProfile: RESIDENT_PROFILE,
        routes: SCHEMATIC_ROUTES,
        nodes: SCHEMATIC_NODES,
        hazards,
        alerts,
        checkpointEvents,
        candidateInterventions: CANDIDATE_INTERVENTIONS,

        // Journey State
        selectedRouteId,
        setSelectedRouteId,
        routeCategory,
        setRouteCategory,
        journeyStatus,
        journeyOrigin,
        setJourneyOrigin,
        journeyDestination,
        setJourneyDestination,
        demoRouteFallback,
        setDemoRouteFallback,
        checkpointIndex,
        passedCheckpoints,
        missedCheckpointPrompt,
        checkinsEnabled,
        setCheckinsEnabled,
        activeLamps,
        duressConfig,
        setDuressConfig,
        duressTriggered,

        // Journey Actions
        startJourney,
        simulatePassCheckpoint,
        simulateMissedCheckpoint,
        resolveMissedPrompt,
        endJourney,
        triggerDuressPin,
        triggerSos,
        fallDetectionActive,
        triggerFallDetectionDemo,
        cancelFallDetection,
        unsafeAssistanceActive,
        unsafeAssistanceNode,
        triggerUnsafeAssistance,
        cancelUnsafeAssistance,
        triggerWalkingDemo,
        submitHazardReport,
        toggleHazardValidation,

        // Security Actions
        acknowledgeAlert,
        assignGuardToAlert,
        markResponseInProgress,
        addAlertNote,
        resolveAlert,

        // Property Actions
        priorityWeights,
        setPriorityWeights,
        updateHazardStatus,
        updateHazardMetric,
        budget,
        setBudget,
        optimisedPlan,
        appliedInterventions,
        setAppliedInterventions,
        planApplied,
        applySelectedPlan,
        resetAppliedPlan,

        // Global Reset & Toast
        toast,
        showToast,
        resetDemoScenario,

        // Storyline Helper (safe no-op fallbacks)
        storylineStep: 0,
        setStorylineStep: () => {},
        isStorylineDrawerOpen: false,
        setIsStorylineDrawerOpen: () => {}
      }}
    >
      {children}
    </NightSafeContext.Provider>
  );
}

export function useNightSafe() {
  const context = useContext(NightSafeContext);
  if (!context) throw new Error('useNightSafe must be used within NightSafeProvider');
  return context;
}

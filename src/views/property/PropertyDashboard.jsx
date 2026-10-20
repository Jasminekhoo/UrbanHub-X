import React, { useState } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import { SchematicTownshipMap } from '../../components/SchematicTownshipMap';
import { 
  SCHEMATIC_NODES, 
  SCHEMATIC_ROUTES, 
  CANDIDATE_INTERVENTIONS, 
  calculateRouteCost 
} from '../../data/nightSafeData';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Sliders, 
  DollarSign, 
  Lightbulb, 
  FileText, 
  HelpCircle, 
  Check, 
  ArrowRight, 
  RefreshCw,
  Search,
  Filter,
  Eye,
  Info,
  Footprints,
  Smartphone,
  RotateCcw
} from 'lucide-react';

export function PropertyDashboard() {
  const { 
    propertyTab, 
    setPropertyTab, 
    hazards, 
    updateHazardStatus, 
    budget, 
    setBudget, 
    optimisedPlan, 
    appliedInterventions, 
    planApplied, 
    applySelectedPlan, 
    resetAppliedPlan, 
    priorityWeights, 
    setPriorityWeights,
    selectedHazardId,
    setSelectedHazardId,
    activeLamps,
    heldBrightNode,
    showToast,
    navigateRole,
    resetDemoScenario
  } = useNightSafe();

  // Search & Filters in Reports
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Selected Hazard for Inspection
  const activeHazard = hazards.find(h => h.id === selectedHazardId) || hazards[0];
  const [selectedRankedId, setSelectedRankedId] = useState('HZ-101');

  // Calculated route impacts (Screen M6)
  const routeACost = calculateRouteCost('A', appliedInterventions);
  const routeBCost = calculateRouteCost('B', appliedInterventions);

  // Statistics
  const openHazards = hazards.filter(h => h.status !== 'Resolved').length;
  const highPriority = hazards.filter(h => h.severity === 'High' && h.status !== 'Resolved').length;
  const awaitingVerification = hazards.filter(h => h.status === 'Reported' || h.status === 'Under verification' || h.status === 'Needs verification').length;

  // Filtered reports
  const filteredHazards = hazards.filter(h => {
    const matchesSearch = h.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          h.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          h.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || h.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate weighted priority score (Screen M4)
  const calculatePriorityScore = (item) => {
    const sevScore = item.severity === 'High' ? 10 : item.severity === 'Medium' ? 6 : 3;
    const expScore = item.pedestrianExposure === 'High' ? 10 : item.pedestrianExposure === 'Medium' ? 6 : 3;
    const urgScore = item.urgency === 'High' ? 10 : item.urgency === 'Medium' ? 6 : 3;

    const totalWeight = priorityWeights.severity + priorityWeights.exposure + priorityWeights.urgency;
    const weighted = (sevScore * priorityWeights.severity + expScore * priorityWeights.exposure + urgScore * priorityWeights.urgency) / (totalWeight || 1);
    return Math.round(weighted * 10);
  };

  // Sorted ranked hazards for Screen M4
  const rankedHazards = [...hazards].sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a));

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172334] flex flex-col font-sans">
      {/* Top Demo Header Bar */}
      <header className="bg-[#142B4A] text-white px-4 py-2.5 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-md z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1F9D8B] text-white flex items-center justify-center font-bold text-sm shadow">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">NightSafe Loop · Property Intelligence</span>
              <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded font-mono border border-teal-700/60 uppercase">
                Demo Console
              </span>
            </div>
            <div className="text-[11px] text-slate-300">Hazard prioritization, RM 5,000 budget & route impact ΔC</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateRole('resident', 'home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2864A6] hover:bg-[#1E3C66] text-white font-bold text-xs shadow transition"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>← Return to Resident App</span>
          </button>


          <button
            onClick={() => navigateRole('login')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            Switch Role
          </button>

          <button
            onClick={resetDemoScenario}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
            title="Reset demo scenario"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[#142B4A] text-white flex flex-col justify-between p-4 border-r border-slate-700 shrink-0">
        <div className="space-y-6">
          {/* Identity */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1F9D8B] text-white flex items-center justify-center font-bold text-sm shadow">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Property Intel</h3>
                <span className="text-[10px] text-teal-300 font-mono">Operations Decision Support</span>
              </div>
            </div>
            <div className="pt-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700/60 uppercase tracking-wider inline-block">
                Budget & Environmental Model
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setPropertyTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                propertyTab === 'overview'
                  ? 'bg-[#2864A6] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Management Overview (M1)</span>
            </button>

            <button
              onClick={() => setPropertyTab('hazard-map')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                propertyTab === 'hazard-map'
                  ? 'bg-[#2864A6] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Township Hazard Map (M2)</span>
            </button>

            <button
              onClick={() => setPropertyTab('reports')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                propertyTab === 'reports'
                  ? 'bg-[#2864A6] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Verification Queue (M3)</span>
              </div>
              {awaitingVerification > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {awaitingVerification}
                </span>
              )}
            </button>

            <button
              onClick={() => setPropertyTab('ranking')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                propertyTab === 'ranking'
                  ? 'bg-[#2864A6] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Priority Ranking (M4)</span>
            </button>

            <button
              onClick={() => setPropertyTab('budget')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                propertyTab === 'budget'
                  ? 'bg-[#2864A6] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4" />
                <span>Budget Optimisation (M5)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
                RM {budget.toLocaleString()}
              </span>
            </button>

            <button
              onClick={() => setPropertyTab('route-impact')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                propertyTab === 'route-impact'
                  ? 'bg-[#2864A6] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4" />
                <span>Route Impact ΔC (M6)</span>
              </div>
              {planApplied && (
                <span className="text-[10px] font-bold text-emerald-400">Δ -{routeACost.delta}</span>
              )}
            </button>

            <button
              onClick={() => setPropertyTab('lighting')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                propertyTab === 'lighting'
                  ? 'bg-[#2864A6] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Lighting Status (M7)</span>
            </button>

            <button
              onClick={() => setPropertyTab('assumptions')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                propertyTab === 'assumptions'
                  ? 'bg-[#2864A6] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Model Assumptions (M8)</span>
            </button>
          </nav>
        </div>

        {/* Bottom Disclaimer */}
        <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 space-y-1">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Illustrative Estimates</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Intervention costs and route benefit scores are prototype assumptions that require practitioner validation.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Top Summary Cards (Screen M1) */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Open Hazards</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{openHazards}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Lighting & Pathways</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">High-Priority Items</div>
            <div className="text-2xl font-black text-[#C83E4D] mt-1">{highPriority}</div>
            <div className="text-[11px] text-red-600 mt-0.5 font-medium">Require Mitigation</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Awaiting Verification</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{awaitingVerification}</div>
            <div className="text-[11px] text-amber-600 mt-0.5 font-medium">Grounds Check Queue</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Illustrative Budget</div>
            <div className="text-2xl font-black text-[#2864A6] mt-1">RM {budget.toLocaleString()}</div>
            <div className="text-[11px] text-sky-600 mt-0.5 font-medium">Default Allocation</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Modelled Route Cost ΔC</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {planApplied ? `-${routeACost.delta} pts` : '0 pts'}
            </div>
            <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">
              {planApplied ? 'Plan Applied to Simulation' : 'Pending Plan Application'}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            SCREEN M1: MANAGEMENT OVERVIEW
           ------------------------------------------------------------- */}
        {propertyTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Map Panel (7 cols) */}
              <div className="lg:col-span-7 p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#2864A6]" />
                    <span>Township Environmental Hazard Map</span>
                  </h3>
                  <button 
                    onClick={() => setPropertyTab('hazard-map')}
                    className="text-xs text-[#2864A6] font-semibold hover:underline"
                  >
                    Open Detailed Map →
                  </button>
                </div>

                <SchematicTownshipMap
                  theme="day"
                  activeLamps={activeLamps}
                  heldBrightNode={heldBrightNode}
                  hazards={hazards}
                  height="300px"
                  showLegend={true}
                />
              </div>

              {/* Quick Decision Support & Priority Panel (5 cols) */}
              <div className="lg:col-span-5 p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Priority Action Queue</h3>
                  <button 
                    onClick={() => setPropertyTab('ranking')}
                    className="text-xs text-[#2864A6] font-semibold hover:underline"
                  >
                    All Ranked ({rankedHazards.length}) →
                  </button>
                </div>

                <div className="space-y-2">
                  {rankedHazards.slice(0, 4).map((hz, idx) => (
                    <div
                      key={hz.id}
                      onClick={() => {
                        setSelectedHazardId(hz.id);
                        setPropertyTab('reports');
                      }}
                      className="p-2.5 rounded-lg border border-slate-200 hover:border-[#2864A6] cursor-pointer bg-slate-50/70 hover:bg-sky-50/40 transition flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#142B4A] text-white font-bold text-[10px] flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{hz.id}: {hz.title}</div>
                          <div className="text-[11px] text-slate-500">{hz.location}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          hz.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {hz.severity}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">Score: {calculatePriorityScore(hz)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick CTA to budget optimizer */}
                <div className="pt-2">
                  <button
                    onClick={() => setPropertyTab('budget')}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#2864A6] hover:bg-[#1E3C66] text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Run RM 5,000 Budget Optimisation (Scene 7)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            SCREEN M2: HAZARD MAP (WITH PIN INSPECTION)
           ------------------------------------------------------------- */}
        {propertyTab === 'hazard-map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Township Hazard Geolocation</h3>
                  <p className="text-xs text-slate-500">Click pins to inspect lighting, pathway, and sightline reports</p>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Total Hazards: {hazards.length}</span>
              </div>

              <SchematicTownshipMap
                theme="day"
                activeLamps={activeLamps}
                heldBrightNode={heldBrightNode}
                hazards={hazards}
                onSelectHazard={(h) => setSelectedHazardId(h.id)}
                height="420px"
                showLegend={true}
              />
            </div>

            {/* Inspector Panel for selected hazard */}
            <div className="lg:col-span-4 p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Hazard Inspector</h3>

              {activeHazard ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Hazard ID</span>
                    <div className="font-extrabold text-sm text-[#142B4A]">{activeHazard.id}: {activeHazard.title}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-semibold text-slate-400">Severity</span>
                      <div className="font-bold text-slate-900">{activeHazard.severity}</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-semibold text-slate-400">Exposure</span>
                      <div className="font-bold text-slate-900">{activeHazard.pedestrianExposure}</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-semibold text-slate-400">Confidence</span>
                      <div className="font-bold text-slate-900">{activeHazard.evidenceConfidence}</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-semibold text-slate-400">Status</span>
                      <div className="font-bold text-amber-700">{activeHazard.status}</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Description</span>
                    <p className="text-slate-600 leading-snug mt-0.5">{activeHazard.description}</p>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="pt-2 space-y-1.5 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Change Status</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateHazardStatus(activeHazard.id, 'Under verification')}
                        className="py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200"
                      >
                        Under Verification
                      </button>
                      <button
                        onClick={() => updateHazardStatus(activeHazard.id, 'Verified')}
                        className="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold border border-emerald-200"
                      >
                        Verify Report
                      </button>
                      <button
                        onClick={() => updateHazardStatus(activeHazard.id, 'Duplicate')}
                        className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                      >
                        Mark Duplicate
                      </button>
                      <button
                        onClick={() => updateHazardStatus(activeHazard.id, 'Resolved')}
                        className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">Select a hazard pin on the map.</div>
              )}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            SCREEN M3: REPORTS & VERIFICATION TABLE
           ------------------------------------------------------------- */}
        {propertyTab === 'reports' && (
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Reports & Verification Queue</h3>
                <p className="text-xs text-slate-500">Audit resident and physical ground inspection reports</p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by ID, location..."
                    className="bg-transparent focus:outline-none w-36"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Lighting deficiency / faulty streetlight">Lighting</option>
                  <option value="Obstructed sightline">Sightline</option>
                  <option value="Damaged / discontinuous pedestrian path">Pathway</option>
                </select>
              </div>
            </div>

            {/* High-severity low-confidence banner (Master Prompt Section 5 requirement) */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Explainable Verification Rule:</strong> Reports with High Severity but Low Evidence Confidence (such as flickering lamps reported by a single commuter) are held in this queue for on-site verification rather than being downranked or dismissed.
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50">
                    <th className="py-2.5 px-3">Hazard ID</th>
                    <th className="py-2.5 px-3">Title & Category</th>
                    <th className="py-2.5 px-3">Location Node</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Confidence</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHazards.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{h.id}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{h.title}</div>
                        <div className="text-[10px] text-slate-400">{h.category} · {h.timestamp}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">{h.location}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          h.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {h.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          h.evidenceConfidence === 'High' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : h.evidenceConfidence === 'Medium'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {h.evidenceConfidence}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          h.status === 'Verified' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : h.status === 'In progress'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {h.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => updateHazardStatus(h.id, 'Verified')}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                            title="Verify Report"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => updateHazardStatus(h.id, 'Under verification')}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px]"
                            title="Request Inspection"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => updateHazardStatus(h.id, 'Duplicate')}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-[10px]"
                            title="Mark Duplicate"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={() => updateHazardStatus(h.id, 'Resolved')}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white font-semibold text-[10px]"
                            title="Close Report"
                          >
                            Close
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            SCREEN M4: EXPLAINABLE PRIORITY RANKING
           ------------------------------------------------------------- */}
        {propertyTab === 'ranking' && (
          <div className="space-y-4">
            {/* Model Weights Config Accordion */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Explainable Priority Scoring Model</h3>
                  <p className="text-xs text-slate-500">Configurable weights for township environmental intervention rankings</p>
                </div>
                <div className="text-xs font-mono font-bold text-slate-700">
                  Total Weight: {priorityWeights.severity + priorityWeights.exposure + priorityWeights.urgency}%
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">Severity Weight</span>
                    <span className="font-mono font-bold text-[#2864A6]">{priorityWeights.severity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={priorityWeights.severity}
                    onChange={(e) => setPriorityWeights(prev => ({ ...prev, severity: Number(e.target.value) }))}
                    className="w-full accent-[#2864A6]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">Pedestrian Exposure Weight</span>
                    <span className="font-mono font-bold text-[#2864A6]">{priorityWeights.exposure}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={priorityWeights.exposure}
                    onChange={(e) => setPriorityWeights(prev => ({ ...prev, exposure: Number(e.target.value) }))}
                    className="w-full accent-[#2864A6]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">Urgency Weight</span>
                    <span className="font-mono font-bold text-[#2864A6]">{priorityWeights.urgency}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={priorityWeights.urgency}
                    onChange={(e) => setPriorityWeights(prev => ({ ...prev, urgency: Number(e.target.value) }))}
                    className="w-full accent-[#2864A6]"
                  />
                </div>
              </div>
            </div>

            {/* 2-Column: Ranked Table (8 cols) + "Why this rank?" Side Panel (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 8 cols: Ranked Table */}
              <div className="lg:col-span-8 p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Dynamic Ranked Interventions Queue
                  </h4>
                  <span className="text-[11px] text-slate-400">Score = (Sev × Ws + Exp × We + Urg × Wu) / 100</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50">
                        <th className="py-2.5 px-3">Rank</th>
                        <th className="py-2.5 px-3">Hazard / Issue</th>
                        <th className="py-2.5 px-3">Severity</th>
                        <th className="py-2.5 px-3">Exposure</th>
                        <th className="py-2.5 px-3">Score</th>
                        <th className="py-2.5 px-3 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rankedHazards.map((hz, idx) => {
                        const score = calculatePriorityScore(hz);
                        const isSelected = (selectedRankedId || rankedHazards[0].id) === hz.id;
                        return (
                          <tr
                            key={hz.id}
                            onClick={() => setSelectedRankedId(hz.id)}
                            className={`cursor-pointer transition ${isSelected ? 'bg-sky-50/80 font-semibold' : 'hover:bg-slate-50'}`}
                          >
                            <td className="py-2.5 px-3 font-bold text-slate-900">#{idx + 1}</td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-800">{hz.id}: {hz.title}</div>
                              <div className="text-[11px] text-slate-400">{hz.location}</div>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                hz.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {hz.severity}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-700">{hz.pedestrianExposure}</td>
                            <td className="py-2.5 px-3">
                              <span className="font-extrabold text-sm text-[#2864A6]">{score}</span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isSelected ? 'bg-[#2864A6] text-white' : 'text-[#2864A6] hover:underline'}`}>
                                {isSelected ? 'Inspecting' : 'Why this rank?'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right 4 cols: "Why this rank?" Side Panel */}
              <div className="lg:col-span-4 p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                {(() => {
                  const currentItem = rankedHazards.find(h => h.id === (selectedRankedId || rankedHazards[0].id)) || rankedHazards[0];
                  const rankPos = rankedHazards.findIndex(h => h.id === currentItem.id) + 1;
                  const score = calculatePriorityScore(currentItem);

                  return (
                    <div className="space-y-4 text-xs">
                      <div className="border-b pb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Rank #{rankPos} Explanation
                          </span>
                          <span className="text-sm font-black text-[#2864A6]">Score: {score} / 100</span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 mt-1">{currentItem.id}: {currentItem.title}</h4>
                        <div className="text-[11px] text-slate-500">{currentItem.location}</div>
                      </div>

                      {/* Weighted Component Breakdown */}
                      <div className="space-y-2">
                        <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                          Model Weight Contributions:
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex justify-between font-semibold">
                            <span>Severity ({currentItem.severity}):</span>
                            <span className="text-[#2864A6] font-mono">Weight: {priorityWeights.severity}%</span>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            {currentItem.severity === 'High' ? 'Severe illumination or trip risk directly impacting night commuters.' : 'Moderate impediment to walkway access.'}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex justify-between font-semibold">
                            <span>Pedestrian Exposure ({currentItem.pedestrianExposure}):</span>
                            <span className="text-[#2864A6] font-mono">Weight: {priorityWeights.exposure}%</span>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            High volume corridor connecting residential clusters to central transit.
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex justify-between font-semibold">
                            <span>Urgency ({currentItem.urgency}):</span>
                            <span className="text-[#2864A6] font-mono">Weight: {priorityWeights.urgency}%</span>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            Requires preventative action before next wet-weather night cycle.
                          </p>
                        </div>
                      </div>

                      {/* Evidence Confidence Safeguard */}
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] space-y-0.5">
                        <div className="font-bold">Evidence Confidence: {currentItem.evidenceConfidence}</div>
                        <p className="text-[10px] text-emerald-800 leading-tight">
                          Confidence is audited separately. Low confidence does not automatically suppress high severity items.
                        </p>
                      </div>

                      <button
                        onClick={() => setPropertyTab('budget')}
                        className="w-full py-2 px-3 rounded-lg bg-[#2864A6] hover:bg-[#1E3C66] text-white text-xs font-bold shadow flex items-center justify-center gap-1.5 transition"
                      >
                        <span>Inspect in Budget Optimiser →</span>
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            SCREEN M5: BUDGET OPTIMISATION (CORE DIFFERENTIATOR)
           ------------------------------------------------------------- */}
        {propertyTab === 'budget' && (
          <div className="space-y-6">
            {/* Budget Input & Knapsack Runner Card */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <span>0/1 Knapsack Maintenance Budget Optimiser</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Finds the mathematically optimal maintenance package under financial constraints
                  </p>
                </div>

                {/* Editable Budget Input */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Available Budget:</span>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900">
                    <span>RM</span>
                    <input
                      type="number"
                      step="500"
                      min="1000"
                      max="20000"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-20 bg-transparent focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setBudget(5000)}
                    className="px-2 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200"
                    title="Reset to default RM 5,000"
                  >
                    Reset RM 5K
                  </button>
                </div>
              </div>

              {/* Optimisation Result Summary Pill Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Selected Package Cost</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    RM {optimisedPlan.totalCost.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Under RM {budget.toLocaleString()} Cap</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Budget Remaining</span>
                  <div className="text-lg font-black text-emerald-600 mt-0.5">
                    RM {optimisedPlan.remainingBudget.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium">Surplus Unspent</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Modelled Benefit</span>
                  <div className="text-lg font-black text-[#2864A6] mt-0.5">
                    +{optimisedPlan.totalBenefit} points
                  </div>
                  <div className="text-[11px] text-sky-600 font-medium">Environmental Index Value</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-center">
                  <button
                    onClick={applySelectedPlan}
                    className="w-full py-2.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply Plan to Simulation</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Candidate Interventions Catalogue */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Selected Feasible Package (7 cols) */}
              <div className="lg:col-span-7 p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Recommended Feasible Package ({optimisedPlan.selectedItems.length} Selected)</span>
                  </h4>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Optimal Knapsack Allocation
                  </span>
                </div>

                <div className="space-y-2.5">
                  {optimisedPlan.selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-emerald-950">{item.id}: {item.title}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-emerald-200 text-emerald-900">
                            {item.targetRoute}
                          </span>
                        </div>
                        <div className="font-mono font-bold text-xs text-emerald-900">
                          RM {item.cost.toLocaleString()}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-snug">{item.explanation}</p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-emerald-100">
                        <span>Segment: {item.segmentAffected}</span>
                        <span className="font-bold text-[#2864A6]">Modelled Benefit: +{item.modelledBenefit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Excluded Interventions & Rationale (5 cols) */}
              <div className="lg:col-span-5 p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Excluded Interventions & Explanations ({optimisedPlan.excludedItems.length})
                </h4>

                <div className="space-y-2.5">
                  {optimisedPlan.excludedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-700">{item.id}: {item.title}</span>
                        <span className="font-mono text-xs text-slate-500">RM {item.cost.toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{item.explanation}</p>
                      <div className="text-[10px] font-semibold text-amber-700 bg-amber-50 p-1.5 rounded border border-amber-200 mt-1">
                        Reason Excluded: {item.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alternative Feasible Maintenance Packages Comparison (Screen M5 Spec) */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Alternative Package Sensitivity Comparison</h4>
                  <p className="text-xs text-slate-500">Compare competing maintenance allocation strategies under RM {budget.toLocaleString()} cap</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  Quantity Surveying Trade-off Analysis
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Package 1: Knapsack Recommended */}
                <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/30 space-y-2 relative">
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[9px] font-extrabold uppercase">
                    Optimal Knapsack
                  </span>
                  <div className="font-bold text-slate-900">Package A: High-Impact Balanced</div>
                  <div className="text-[11px] text-slate-500">Items: IN-01, IN-02, IN-04</div>
                  <div className="pt-2 border-t border-emerald-200 space-y-1">
                    <div className="flex justify-between"><span>Est. Cost:</span><strong className="font-mono text-slate-900">RM 3,900</strong></div>
                    <div className="flex justify-between"><span>Unspent:</span><strong className="font-mono text-emerald-700">RM 1,100</strong></div>
                    <div className="flex justify-between"><span>Model Benefit:</span><strong className="font-mono text-[#2864A6]">+26 pts</strong></div>
                    <div className="flex justify-between text-[11px] text-slate-400"><span>Efficiency:</span><span>150 RM/pt</span></div>
                  </div>
                </div>

                {/* Package 2: Heavy Civil Footpath Focus */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="font-bold text-slate-900">Package B: Footway Infrastructure</div>
                  <div className="text-[11px] text-slate-500">Items: IN-03 (Damaged Path Repaving)</div>
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <div className="flex justify-between"><span>Est. Cost:</span><strong className="font-mono text-slate-900">RM 4,500</strong></div>
                    <div className="flex justify-between"><span>Unspent:</span><strong className="font-mono text-slate-600">RM 500</strong></div>
                    <div className="flex justify-between"><span>Model Benefit:</span><strong className="font-mono text-slate-700">+15 pts</strong></div>
                    <div className="flex justify-between text-[11px] text-slate-400"><span>Efficiency:</span><span>300 RM/pt</span></div>
                  </div>
                </div>

                {/* Package 3: Modern Capital Lighting */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="font-bold text-slate-900">Package C: Dark Corridor Relighting</div>
                  <div className="text-[11px] text-slate-500">Items: IN-01, IN-05 (Bollard Lamps)</div>
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <div className="flex justify-between"><span>Est. Cost:</span><strong className="font-mono text-slate-900">RM 4,800</strong></div>
                    <div className="flex justify-between"><span>Unspent:</span><strong className="font-mono text-slate-600">RM 200</strong></div>
                    <div className="flex justify-between"><span>Model Benefit:</span><strong className="font-mono text-slate-700">+22 pts</strong></div>
                    <div className="flex justify-between text-[11px] text-slate-400"><span>Efficiency:</span><span>218 RM/pt</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            SCREEN M6: ROUTE IMPACT / BEFORE AND AFTER
           ------------------------------------------------------------- */}
        {propertyTab === 'route-impact' && (
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Before & After Route Impact Analysis</h3>
                <p className="text-xs text-slate-500">
                  Modelled environmental condition change: ΔC = C_before − C_after
                </p>
              </div>

              <div className="flex items-center gap-2">
                {planApplied ? (
                  <button
                    onClick={resetAppliedPlan}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Reset to Baseline
                  </button>
                ) : (
                  <button
                    onClick={applySelectedPlan}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow"
                  >
                    Apply Selected Plan
                  </button>
                )}
              </div>
            </div>

            {/* Side by side comparison: Route A and Route B */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Route A Card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#2864A6] text-white font-bold text-xs flex items-center justify-center">
                      A
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Route A: Main Avenue</h4>
                      <p className="text-[11px] text-slate-500">620m · 9 min walk</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Modelled Cost</div>
                    <div className="text-xl font-black text-slate-900">
                      {routeACost.totalCost}
                      {routeACost.delta > 0 && (
                        <span className="text-sm text-emerald-600 font-bold ml-1.5">
                          (Δ -{routeACost.delta})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Segment breakdown */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span>Base Distance / Time Index:</span>
                    <span className="font-mono font-semibold">{routeACost.baseTimeIndex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lighting Deficiency Penalty:</span>
                    <span className={`font-mono font-semibold ${routeACost.lightingPenalty === 0 ? 'text-emerald-600' : 'text-amber-700'}`}>
                      +{routeACost.lightingPenalty} {routeACost.lightingPenalty === 0 && '(Resolved by IN-01/IN-04)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sightline Obstruction Penalty:</span>
                    <span className="font-mono font-semibold text-emerald-600">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pathway Discontinuity Penalty:</span>
                    <span className="font-mono font-semibold text-emerald-600">0</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600">
                  {routeACost.delta > 0 ? (
                    <span className="text-emerald-800 font-semibold">
                      ✓ Model improvement applied: Luminaire L-04 repaired, restoring continuous illumination.
                    </span>
                  ) : (
                    <span>Baseline state: 1 active lighting penalty near Central Boulevard.</span>
                  )}
                </div>
              </div>

              {/* Route B Card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                      B
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Route B: Garden Shortcut</h4>
                      <p className="text-[11px] text-slate-500">480m · 7 min walk</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Modelled Cost</div>
                    <div className="text-xl font-black text-slate-900">
                      {routeBCost.totalCost}
                      {routeBCost.delta > 0 && (
                        <span className="text-sm text-emerald-600 font-bold ml-1.5">
                          (Δ -{routeBCost.delta})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Segment breakdown */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span>Base Distance / Time Index:</span>
                    <span className="font-mono font-semibold">{routeBCost.baseTimeIndex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lighting Deficiency Penalty:</span>
                    <span className="font-mono font-semibold">+{routeBCost.lightingPenalty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sightline Obstruction Penalty:</span>
                    <span className={`font-mono font-semibold ${routeBCost.sightlinePenalty === 0 ? 'text-emerald-600' : 'text-amber-700'}`}>
                      +{routeBCost.sightlinePenalty} {routeBCost.sightlinePenalty === 0 && '(Cleared by IN-02)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pathway Discontinuity Penalty:</span>
                    <span className="font-mono font-semibold">+{routeBCost.pathwayPenalty}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600">
                  {routeBCost.delta > 0 ? (
                    <span className="text-emerald-800 font-semibold">
                      ✓ Model improvement applied: Vegetation trimmed near Lamp L-06, clearing sightlines.
                    </span>
                  ) : (
                    <span>Baseline state: Multiple impediments across unlit garden pathway.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Scientific Caveat Banner */}
            <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">Caveat on Modelled Metrics:</span> ΔC represents a simulated reduction in environmental penalties according to prototype assumptions. It is <em>not</em> an empirical guarantee of crime elimination, personal safety, or reduced physical incidents.
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            SCREEN M7: LIGHTING STATUS / CORRIDOR SIMULATION
           ------------------------------------------------------------- */}
        {propertyTab === 'lighting' && (
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Streetlight Node Simulation Registry</h3>
                <p className="text-xs text-slate-500">Nodes L-01 through L-08 smart luminaire statuses</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Simulated Controller API
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {SCHEMATIC_NODES.map((node) => {
                const isHeld = heldBrightNode === node.id;
                const isActive = activeLamps.includes(node.id);
                const hasHazard = hazards.some(h => h.affectedNode === node.id && h.status !== 'Resolved');

                let statusLabel = 'Normal / Idle';
                let pillColor = 'bg-slate-100 text-slate-600';

                if (isHeld) {
                  statusLabel = 'Held Bright (Emergency)';
                  pillColor = 'bg-red-100 text-[#C83E4D] font-bold animate-pulse';
                } else if (isActive) {
                  statusLabel = 'Simulated Active Corridor';
                  pillColor = 'bg-amber-100 text-amber-900 font-bold';
                } else if (hasHazard) {
                  statusLabel = 'Fault Reported';
                  pillColor = 'bg-amber-50 text-amber-800 border border-amber-300';
                }

                return (
                  <div key={node.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#142B4A]">{node.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${pillColor}`}>
                        {statusLabel}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800">{node.name}</div>
                    <p className="text-[11px] text-slate-500 leading-tight">{node.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            SCREEN M8: MODEL ASSUMPTIONS & DATA QUALITY
           ------------------------------------------------------------- */}
        {propertyTab === 'assumptions' && (
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Prototype Assumptions & Data Governance</h3>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900">1. Environmental Route Model</h4>
                <p>
                  Route costs are computed as normalized time plus penalty weights for lighting deficiencies (+7 to +10), overgrown sightline obstructions (+8), and uneven walkway discontinuities (+7). The score does not incorporate crime databases or live CCTV feeds.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900">2. Knapsack Maintenance Optimization</h4>
                <p>
                  Intervention benefits are assumed linear and non-additive in overlap. Costs are indicative benchmark figures derived from standard municipal footway and lighting refurbishment rates.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900">3. Verification Governance</h4>
                <p>
                  Resident submissions are tagged with source, timestamp, and confidence levels. High-risk reports with low confidence are routed to grounds inspectors rather than automatically prioritized for major capital works.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 space-y-1">
                <h4 className="font-bold text-amber-950">4. SDP Integration Boundary</h4>
                <p>
                  Future real-world deployment requires validating township streetlight hardware protocols (e.g., DALI / Zhaga / LoRaWAN), resident data consent policies, and integration with Sime Darby Property's existing facility management work-order systems.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
    </div>
  );
}


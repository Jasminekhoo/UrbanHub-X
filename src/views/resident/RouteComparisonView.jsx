import React, { useState } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import { SchematicTownshipMap } from '../../components/SchematicTownshipMap';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  Eye,
  Footprints,
  Lightbulb
} from 'lucide-react';

export function RouteComparisonView() {
  const { 
    routes, 
    selectedRouteId, 
    setSelectedRouteId, 
    startJourney, 
    setResidentTab, 
    hazards,
    activeLamps
  } = useNightSafe();

  const [activeRoute, setActiveRoute] = useState(selectedRouteId || 'A');
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const routeA = routes.A;
  const routeB = routes.B;
  const currentRouteData = routes[activeRoute];

  const handleSelectRoute = (id) => {
    setActiveRoute(id);
    setSelectedRouteId(id);
  };

  const handleStartWalk = () => {
    startJourney(activeRoute);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Compare Night Routes</h2>
          <p className="text-xs text-slate-500">Community Residence → Central Transit Stop</p>
        </div>
        <button
          onClick={() => setShowFormulaModal(!showFormulaModal)}
          className="flex items-center gap-1 text-[11px] font-semibold text-[#2864A6] hover:underline"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>How is cost calculated?</span>
        </button>
      </div>

      {/* Schematic Map Visualizer (Night Theme) */}
      <div className="rounded-xl overflow-hidden shadow-sm">
        <SchematicTownshipMap
          theme="night"
          selectedRoute={activeRoute}
          activeLamps={activeLamps}
          hazards={hazards}
          height="230px"
          showLegend={false}
        />
      </div>

      {/* Formula Explanation Accordion */}
      {showFormulaModal && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-2 border border-slate-700 animate-fadeIn">
          <div className="flex items-center justify-between font-bold text-amber-400">
            <span>Model Formula: Environmental Route Cost Index</span>
            <button onClick={() => setShowFormulaModal(false)}>✕</button>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            <span className="font-mono bg-slate-800 px-1 py-0.5 rounded text-amber-300">
              Route Cost = Base Time + Lighting Penalty + Sightline Penalty + Pathway Penalty
            </span>
          </p>
          <ul className="space-y-1 text-[11px] text-slate-300 list-disc pl-4">
            <li>Lower modelled cost indicates fewer recorded environmental impediments.</li>
            <li>Cost is an illustrative index, NOT a crime prediction or safety guarantee.</li>
            <li>Evidence confidence is audited separately from raw resident reports.</li>
          </ul>
        </div>
      )}

      {/* Route Cards Selection */}
      <div className="space-y-2.5">
        {/* Route A Card */}
        <div
          onClick={() => handleSelectRoute('A')}
          className={`p-3.5 rounded-xl border cursor-pointer transition relative ${
            activeRoute === 'A'
              ? 'bg-sky-50/70 border-[#2864A6] ring-1 ring-[#2864A6] shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          {routeA.recommended && (
            <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
              Recommended by Model
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                activeRoute === 'A' ? 'bg-[#2864A6] text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                A
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{routeA.name}</h4>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {routeA.durationMinutes} min ({routeA.distanceMeters}m)
                  </span>
                  <span>•</span>
                  <span>Paved Avenue</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-[#142B4A]">
                Cost Index: <span className="text-sm text-emerald-700 font-extrabold">{routeA.totalCost}</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">Lower Penalty</div>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 flex flex-wrap gap-1.5 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              Light penalty: +{routeA.penalties.lighting} (Fault near L-04)
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Sightlines: Clear (0)
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Footprints className="w-3 h-3" />
              Walkway: Continuous (0)
            </span>
          </div>

          <p className="mt-2 text-[11px] text-slate-600 italic leading-snug">
            "{routeA.recommendationReason}"
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-200 flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectRoute('A');
                startJourney('A');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeRoute === 'A'
                  ? 'bg-[#2864A6] text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Choose Main Avenue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Route B Card */}
        <div
          onClick={() => handleSelectRoute('B')}
          className={`p-3.5 rounded-xl border cursor-pointer transition relative ${
            activeRoute === 'B'
              ? 'bg-amber-50/70 border-amber-600 ring-1 ring-amber-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                activeRoute === 'B' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                B
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{routeB.name}</h4>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-amber-700 font-semibold">
                    <Clock className="w-3 h-3" />
                    {routeB.durationMinutes} min (Fastest time)
                  </span>
                  <span>•</span>
                  <span>Garden Path</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-[#142B4A]">
                Cost Index: <span className="text-sm text-red-700 font-extrabold">{routeB.totalCost}</span>
              </div>
              <div className="text-[10px] text-amber-700 font-medium">+12 Penalty Points</div>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 flex flex-wrap gap-1.5 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-600" />
              Light penalty: +{routeB.penalties.lighting}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Eye className="w-3 h-3 text-amber-600" />
              Sightlines: +{routeB.penalties.sightline} (Vegetation)
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Footprints className="w-3 h-3 text-amber-600" />
              Path defect: +{routeB.penalties.pathway} (Roots/Pavers)
            </span>
          </div>

          <p className="mt-2 text-[11px] text-slate-600 italic leading-snug">
            "{routeB.recommendationReason}"
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-200 flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectRoute('B');
                startJourney('B');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeRoute === 'B'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Choose Garden Shortcut</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Model Confidence & Disclaimer */}
      <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between font-medium">
          <span>Data Confidence: High (SDP Prototype Model)</span>
          <span>Last Model Audit: Today 18:30</span>
        </div>
        <p className="italic">
          Notice: Route cost reflects environmental condition indices, not measured personal risk or crime statistics.
        </p>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={handleStartWalk}
        className="w-full py-3 px-4 rounded-xl bg-[#2864A6] hover:bg-[#1E3C66] text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition"
      >
        <span>Start Demo Journey ({currentRouteData.name})</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

import React from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import { SchematicTownshipMap } from '../../components/SchematicTownshipMap';
import { 
  Lightbulb, 
  MapPin, 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Play, 
  StopCircle, 
  Radio, 
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export function JourneyPreviewView() {
  const { 
    selectedRouteId, 
    routes, 
    journeyStatus, 
    startJourney, 
    endJourney, 
    checkpointIndex, 
    passedCheckpoints, 
    simulatePassCheckpoint, 
    simulateMissedCheckpoint, 
    activeLamps, 
    heldBrightNode,
    hazards, 
    alerts,
    setResidentTab,
    checkinsEnabled,
    setCheckinsEnabled
  } = useNightSafe();

  const route = routes[selectedRouteId] || routes.A;
  const currentNodeId = route.nodes[checkpointIndex] || route.nodes[0];

  return (
    <div className="space-y-4 pb-20">
      {/* Header with status pill */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Journey Mode</h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              journeyStatus === 'in_progress' 
                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {journeyStatus === 'in_progress' ? 'Journey In Progress' : 'Ready to Start'}
            </span>
          </div>
          <p className="text-xs text-slate-500">{route.name} · Est. {route.durationMinutes} min</p>
        </div>

        {journeyStatus === 'in_progress' ? (
          <button
            onClick={endJourney}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-sm transition"
          >
            <StopCircle className="w-3.5 h-3.5 text-red-400" />
            <span>End Journey</span>
          </button>
        ) : (
          <button
            onClick={() => startJourney(selectedRouteId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2864A6] hover:bg-[#1E3C66] text-white text-xs font-semibold shadow-sm transition"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Walk</span>
          </button>
        )}
      </div>

      {/* Schematic Map (Night Theme) */}
      <div className="rounded-xl overflow-hidden shadow-sm">
        <SchematicTownshipMap
          theme="night"
          selectedRoute={selectedRouteId}
          activeLamps={activeLamps}
          heldBrightNode={heldBrightNode}
          currentCheckpointNode={journeyStatus === 'in_progress' ? currentNodeId : null}
          hazards={hazards}
          alerts={alerts}
          height="250px"
          showLegend={true}
        />
      </div>

      {/* Smart Light Corridor Notice Badge */}
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <div className="font-bold">Simulated Smart-Light Corridor</div>
            <div className="text-[11px] text-amber-800">
              {activeLamps.length > 0 
                ? `Luminaires illuminated ahead: ${activeLamps.join(', ')}`
                : 'Lamps will sequence ahead when journey starts'}
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-amber-200/60 px-2 py-0.5 rounded text-amber-900">
          Simulated
        </span>
      </div>

      {/* Interactive Demo Presentation Controls */}
      <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2 border border-slate-700 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            <span>Demo Presenter Controls (Simulation)</span>
          </span>
          <span className="text-[10px] text-slate-400">Step controls for pitch</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => simulatePassCheckpoint('L-03')}
            className="py-2 px-2.5 rounded-lg bg-[#2864A6] hover:bg-[#1E3C66] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Simulate Passing L-03</span>
          </button>

          <button
            onClick={simulateMissedCheckpoint}
            className="py-2 px-2.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/40 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Missed Checkpoint</span>
          </button>
        </div>
      </div>

      {/* Safety Checkpoints Sequence List */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#2864A6]" />
            <span>Route Checkpoints & Safe Nodes</span>
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer" onClick={() => setCheckinsEnabled(!checkinsEnabled)}>
            <span>Auto Check-ins:</span>
            {checkinsEnabled ? (
              <span className="text-emerald-700 font-bold">Enabled</span>
            ) : (
              <span className="text-slate-400">Off</span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          {route.nodes.map((nodeId, idx) => {
            const isPassed = passedCheckpoints.includes(nodeId);
            const isCurrent = currentNodeId === nodeId && journeyStatus === 'in_progress';

            return (
              <div
                key={nodeId}
                className={`p-2 rounded-lg flex items-center justify-between text-xs transition ${
                  isCurrent
                    ? 'bg-sky-50 border border-sky-300 font-semibold text-[#142B4A]'
                    : isPassed
                    ? 'bg-slate-50 text-slate-500'
                    : 'bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-[#2864A6] text-white animate-pulse'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isPassed ? '✓' : idx + 1}
                  </div>
                  <span>Node {nodeId}</span>
                </div>

                <div className="text-[11px]">
                  {isCurrent ? (
                    <span className="text-[#2864A6] font-bold">Current Location</span>
                  ) : isPassed ? (
                    <span className="text-emerald-600">Passed</span>
                  ) : (
                    <span className="text-slate-400">Upcoming</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Emergency Action Bottom Bar */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setResidentTab('duress-setup')}
          className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Discreet Help (Duress PIN)</span>
        </button>

        <button
          onClick={() => setResidentTab('sos')}
          className="py-2.5 px-3 rounded-xl bg-[#C83E4D] hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Overt SOS</span>
        </button>
      </div>
    </div>
  );
}

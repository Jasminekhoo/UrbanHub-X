import React, { useState } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import { 
  MapPin, 
  Navigation, 
  ShieldAlert, 
  Lock, 
  AlertTriangle, 
  ChevronRight, 
  Clock, 
  Sparkles,
  Info
} from 'lucide-react';

export function ResidentHomeView() {
  const { 
    residentProfile, 
    setResidentTab, 
    journeyStatus, 
    selectedRouteId, 
    routes, 
    alerts,
    hazards
  } = useNightSafe();

  const [origin, setOrigin] = useState("Community Residence");
  const [destination, setDestination] = useState("Central Transit Stop");

  const destinations = [
    "Central Transit Stop",
    "Township Community Centre",
    "Commercial Square Park",
    "Boulevard Retail Strip"
  ];

  const recentReport = hazards.find(h => h.reportedBy === residentProfile.title) || hazards[0];

  return (
    <div className="space-y-4 pb-20">
      {/* Top Greeting & Status Chip */}
      <div className="bg-[#142B4A] text-white p-4 -mx-4 -mt-4 rounded-b-2xl shadow-md">
        <div className="flex items-center justify-between text-xs text-sky-200 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Demo Township · Safe Walk Active</span>
          </div>
          <span className="text-[11px] opacity-75">8:45 PM</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">Good evening, {residentProfile.name}</h2>
        <p className="text-xs text-slate-300">Where are you walking tonight?</p>
      </div>

      {/* Journey in progress alert card if active */}
      {journeyStatus === 'in_progress' && (
        <div 
          onClick={() => setResidentTab('journey')}
          className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 cursor-pointer hover:bg-amber-500/20 transition flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Active Walk: {routes[selectedRouteId]?.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Smart lighting corridor simulated · Tap to view
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-600" />
        </div>
      )}

      {/* Main Card: Plan a Night Journey */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-[#2864A6]" />
            <span>Plan a Night Journey</span>
          </h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-[#2864A6] border border-sky-100">
            Modelled Cost Comparison
          </span>
        </div>

        {/* Origin Input */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Origin</label>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="bg-transparent w-full focus:outline-none font-medium"
            />
          </div>
        </div>

        {/* Destination Selector */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Destination</label>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800">
            <MapPin className="w-3.5 h-3.5 text-[#C83E4D] shrink-0" />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-transparent w-full focus:outline-none font-medium cursor-pointer"
            >
              {destinations.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => setResidentTab('routes')}
          className="w-full py-2.5 px-4 rounded-xl bg-[#2864A6] hover:bg-[#1E3C66] text-white text-xs font-semibold shadow flex items-center justify-center gap-2 transition"
        >
          <span>Compare Routes (Main Ave vs Garden)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Grid: SOS, Discreet Help, Report Hazard */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setResidentTab('sos')}
          className="p-3 rounded-xl bg-white hover:bg-red-50/50 border border-slate-200 hover:border-red-300 text-center transition flex flex-col items-center gap-1.5 shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-red-100 text-[#C83E4D] flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-800">SOS</span>
          <span className="text-[10px] text-slate-400 leading-none">Emergency</span>
        </button>

        <button
          onClick={() => setResidentTab('duress-setup')}
          className="p-3 rounded-xl bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 text-center transition flex flex-col items-center gap-1.5 shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-800">Discreet Help</span>
          <span className="text-[10px] text-slate-400 leading-none">Duress PIN</span>
        </button>

        <button
          onClick={() => setResidentTab('report')}
          className="p-3 rounded-xl bg-white hover:bg-sky-50/50 border border-slate-200 hover:border-sky-300 text-center transition flex flex-col items-center gap-1.5 shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-sky-100 text-[#2864A6] flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-800">Report</span>
          <span className="text-[10px] text-slate-400 leading-none">Hazard</span>
        </button>
      </div>

      {/* Recent Hazard / Environmental Status Card */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Community Hazard Feed</span>
          </span>
          <button 
            onClick={() => setResidentTab('my-reports')}
            className="text-[11px] text-[#2864A6] hover:underline font-semibold"
          >
            View All ({hazards.length})
          </button>
        </div>

        {recentReport && (
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">{recentReport.id}: {recentReport.title}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                {recentReport.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">{recentReport.description}</p>
            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
              <span>{recentReport.timestamp}</span>
              <span>Node: {recentReport.affectedNode}</span>
            </div>
          </div>
        )}
      </div>

      {/* Safety Notice Footer */}
      <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-[11px] leading-relaxed flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Trust over false certainty:</span> NightSafe Loop displays environmental condition indices based on available data, not predictive crime statistics.
        </div>
      </div>
    </div>
  );
}

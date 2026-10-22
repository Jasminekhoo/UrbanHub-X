import React, { useState } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import {
  MapPin,
  Navigation2,
  ChevronRight,
  Search,
  X,
} from 'lucide-react';

import { ELMINA_LOCATIONS } from '../../data/cityOfElminaAreas';
import { ROUTE_LOCATION_COORDS } from '../../data/elminaRouteLocations';
import { GoogleMapsTownshipView } from '../../components/GoogleMapsTownshipView';

const ROUTABLE_LOCATIONS = ELMINA_LOCATIONS.filter(location => ROUTE_LOCATION_COORDS[location.label]);

export function NightPathView() {
  const {
    setResidentTab,
    journeyOrigin,
    setJourneyOrigin,
    journeyDestination,
    setJourneyDestination,
    setDemoRouteFallback
  } = useNightSafe();

  const [from, setFrom]             = useState(journeyOrigin || '');
  const [to, setTo]                 = useState(journeyDestination || '');
  const [fromFocus, setFromFocus]   = useState(false);
  const [toFocus, setToFocus]       = useState(false);

  const fromSelected = ROUTABLE_LOCATIONS.find(l => l.label === from);
  const toSelected   = ROUTABLE_LOCATIONS.find(l => l.label === to);
  const canConfirm   = Boolean(fromSelected && toSelected && from !== to);

  // Build GPS pin objects for the map
  const fromPin = fromSelected ? { ...ROUTE_LOCATION_COORDS[from], label: from } : null;
  const toPin   = toSelected ? { ...ROUTE_LOCATION_COORDS[to], label: to } : null;

  const handleConfirm = () => {
    setDemoRouteFallback(false);
    if (setJourneyOrigin) setJourneyOrigin(from);
    if (setJourneyDestination) setJourneyDestination(to);
    setResidentTab('routes');
  };

  const filteredFrom = ROUTABLE_LOCATIONS.filter(l =>
    from.length === 0
      ? l.label !== from
      : l.label.toLowerCase().includes(from.toLowerCase()) && l.label !== from
  );
  const filteredTo = ROUTABLE_LOCATIONS.filter(l =>
    to.length === 0
      ? l.label !== to
      : l.label.toLowerCase().includes(to.toLowerCase()) && l.label !== to
  );

  return (
    <div className="flex flex-col h-full pb-0">
      {/* ── Top Panel: Location Inputs ──────────────────────────────── */}
      <div className="shrink-0 bg-white border-b border-slate-200 shadow-sm px-3 pt-3 pb-2 space-y-2 z-10 relative">

        {/* From input */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-[#2864A6] focus-within:ring-1 focus-within:ring-[#2864A6]/20 transition">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2864A6] shrink-0" />
            <input
              type="text"
              value={from}
              onChange={e => setFrom(e.target.value)}
              onFocus={() => setFromFocus(true)}
              onBlur={() => setTimeout(() => setFromFocus(false), 150)}
              placeholder="Choose starting location"
              className="flex-1 text-xs bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {from ? (
              <button onClick={() => setFrom('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          {/* From dropdown */}
          {fromFocus && filteredFrom.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-30">
              {filteredFrom.map(loc => (
                <button
                  key={loc.id}
                  type="button"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 transition border-b border-slate-100 last:border-0"
                  onMouseDown={() => { setFrom(loc.label); setFromFocus(false); }}
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-800 truncate">{loc.label}</div>
                    <div className="text-[10px] text-slate-500 truncate">{loc.sublabel}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Connector dot line */}
        <div className="flex items-center gap-2 px-1">
          <div className="ml-1 flex flex-col items-center gap-0.5">
            <div className="w-0.5 h-1 bg-slate-300 rounded" />
            <div className="w-0.5 h-1 bg-slate-300 rounded" />
          </div>
        </div>

        {/* To input */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500/20 transition">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <input
              type="text"
              value={to}
              onChange={e => setTo(e.target.value)}
              onFocus={() => setToFocus(true)}
              onBlur={() => setTimeout(() => setToFocus(false), 150)}
              placeholder="Choose destination"
              className="flex-1 text-xs bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {to && (
              <button onClick={() => setTo('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* To dropdown */}
          {toFocus && filteredTo.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-30">
              {filteredTo.map(loc => (
                <button
                  key={loc.id}
                  type="button"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 transition border-b border-slate-100 last:border-0"
                  onMouseDown={() => { setTo(loc.label); setToFocus(false); }}
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-800 truncate">{loc.label}</div>
                    <div className="text-[10px] text-slate-500 truncate">{loc.sublabel}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {from && to && from === to && (
          <p className="text-[10px] font-medium text-rose-600">
            Choose different start and destination locations.
          </p>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm ${
            canConfirm
              ? 'bg-[#2864A6] hover:bg-[#1E3C66] text-white cursor-pointer'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Navigation2 className="w-3.5 h-3.5" />
          <span>Find Walking Routes</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="shrink-0 px-3 py-1.5 bg-slate-50 text-center text-[9px] text-slate-500">
        Google Maps routes along mapped roads. Safety ratings for custom locations are unavailable.
      </p>

      {/* ── Map Area ────────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        {/* Google Maps (light mode, simple pin mode) */}
        <GoogleMapsTownshipView
          theme="day"
          simpleMode={true}
          fromPin={fromPin}
          toPin={toPin}
          showOverlayLabels={false}
          showHeader={false}
        />

        {/* Floating hint if nothing typed yet */}
        {!from && !to && (
          <div className="absolute bottom-4 left-3 right-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-md z-10">
            <Search className="w-3.5 h-3.5 text-[#2864A6] shrink-0" />
            <p className="text-[10px] text-slate-600 leading-relaxed">
              Enter your <span className="text-slate-900 font-semibold">origin</span> and <span className="text-slate-900 font-semibold">destination</span> above to find walking routes on mapped roads.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { SCHEMATIC_NODES, SCHEMATIC_ROUTES } from '../data/nightSafeData';
import { AlertTriangle, Lightbulb, MapPin, Eye, AlertCircle, ShieldAlert, Layers, ChevronDown } from 'lucide-react';

export function SchematicTownshipMap({
  theme = 'day', // 'day' | 'night'
  selectedRoute = null, // 'A' | 'B' | null
  activeLamps = [], // array of node IDs that are currently glowing
  currentCheckpointNode = null, // e.g. 'L-03'
  hazards = [],
  alerts = [],
  onSelectNode = null,
  onSelectHazard = null,
  interactive = true,
  height = '420px',
  fillContainer = false,
  showLegend = true,
  showOverlayLabels = true,
  showHeader = true,
  routePaths = null,
  hideRoutes = false
}) {
  const isNight = theme === 'night';

  // Legend is collapsed by default so the map canvas stays fully visible
  const [legendOpen, setLegendOpen] = useState(false);

  // SVG dimensions
  const width = 820;
  const mapHeight = 480;

  // Path data for Route A: L-01 (80, 280) -> L-02 (220, 120) -> L-03 (420, 120) -> L-04 (600, 160) -> L-08 (740, 240)
  const routeAPath = "M 80 280 C 130 180, 150 120, 220 120 L 420 120 C 500 120, 540 140, 600 160 L 740 240";

  // Path data for Route B: L-01 (80, 280) -> L-05 (240, 380) -> L-06 (420, 380) -> L-07 (580, 350) -> L-08 (740, 240)
  const routeBPath = "M 80 280 C 140 340, 170 380, 240 380 L 420 380 C 500 380, 530 365, 580 350 L 740 240";

  // Path data for Route C: L-01 (80, 280) -> Courtyard Link -> L-07 (580, 350) -> L-08 (740, 240)
  const routeCPath = "M 80 280 C 180 260, 380 260, 580 350 L 740 240";
  const customCoordinates = Object.values(routePaths || {})
    .flatMap(route => route?.path || [])
    .filter(point => Number.isFinite(point.lat) && Number.isFinite(point.lng));
  const coordinateBounds = customCoordinates.length > 0
    ? {
        minLat: Math.min(...customCoordinates.map(point => point.lat)),
        maxLat: Math.max(...customCoordinates.map(point => point.lat)),
        minLng: Math.min(...customCoordinates.map(point => point.lng)),
        maxLng: Math.max(...customCoordinates.map(point => point.lng))
      }
    : null;
  const projectPoint = point => {
      if (!coordinateBounds) return null;
      const latRange = coordinateBounds.maxLat - coordinateBounds.minLat || 1;
      const lngRange = coordinateBounds.maxLng - coordinateBounds.minLng || 1;
      return {
        x: 80 + ((point.lng - coordinateBounds.minLng) / lngRange) * 660,
        y: 120 + ((coordinateBounds.maxLat - point.lat) / latRange) * 260
      };
  };
  const getRoutePath = (routeId, fallback) => {
      const points = routePaths?.[routeId]?.path;
      if (!points || points.length < 2 || !coordinateBounds) return fallback;
      return points.map((point, index) => {
        const projected = projectPoint(point);
        return `${index === 0 ? 'M' : 'L'} ${projected.x} ${projected.y}`;
      }).join(' ');
  };
  const displayRouteAPath = getRoutePath('A', routeAPath);
  const displayRouteBPath = getRoutePath('B', routeBPath);
  const displayRouteCPath = getRoutePath('C', routeCPath);

  // Active emergency alert check
  const hasEmergency = alerts.some(a => a.status !== 'Resolved');
  const emergencyAlert = alerts.find(a => a.status !== 'Resolved');

  return (
    <div className={`relative rounded-xl overflow-hidden border ${isNight ? 'bg-[#0D1726] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} transition-colors duration-300 shadow-sm flex flex-col ${fillContainer ? 'h-full min-h-0' : ''}`}>
      {/* Map Header Bar */}
      {showHeader && (
        <div className={`px-4 py-2.5 border-b flex items-center justify-between text-xs font-medium ${isNight ? 'bg-[#142B4A]/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold tracking-wide uppercase">Schematic Township Layout</span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200/50 dark:bg-slate-800 text-slate-500">
              {isNight ? 'Night Corridor Mode' : 'Simulated Demo Layout'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">Simulated Demo — not real-world verified</span>
          </div>
        </div>
      )}

      {/* SVG Canvas Area */}
      <div
        className={`relative w-full overflow-hidden ${fillContainer ? 'flex-1 min-h-0' : ''}`}
        style={fillContainer ? undefined : { height }}
      >
        <svg
          viewBox={`0 0 ${width} ${mapHeight}`}
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={isNight ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
                strokeWidth="1"
              />
            </pattern>

            {/* Glow filters */}
            <filter id="amber-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="emergency-pulse" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient for Route A */}
            <linearGradient id="routeAGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2864A6" />
              <stop offset="50%" stopColor="#F4B942" />
              <stop offset="100%" stopColor="#1F9D8B" />
            </linearGradient>
          </defs>

          {/* Background grid */}
          <rect width={width} height={mapHeight} fill="url(#grid)" />

          {/* Fictional Blocks & Greenery zones */}
          <g opacity={isNight ? '0.2' : '0.6'}>
            {/* Central Garden zone */}
            <rect x="230" y="220" width="340" height="130" rx="20" fill={isNight ? '#0b3d2c' : '#dcfce7'} stroke={isNight ? '#166534' : '#bbf7d0'} strokeDasharray="4 4" />
            <text x="400" y="285" fill={isNight ? '#4ade80' : '#15803d'} fontSize="11" fontWeight="600" textAnchor="middle" letterSpacing="1">CENTRAL TOWNSHIP PARK & GARDEN</text>

            {/* Residential parcel */}
            <rect x="20" y="210" width="100" height="150" rx="12" fill={isNight ? '#1e293b' : '#e2e8f0'} />
            <text x="70" y="270" fill={isNight ? '#94a3b8' : '#475569'} fontSize="10" textAnchor="middle" fontWeight="bold">RESIDENCE</text>
            <text x="70" y="285" fill={isNight ? '#64748b' : '#64748b'} fontSize="9" textAnchor="middle">BLOCK Aâ€“C</text>

            {/* Transit Hub parcel */}
            <rect x="710" y="170" width="90" height="140" rx="12" fill={isNight ? '#1e293b' : '#e2e8f0'} />
            <text x="755" y="235" fill={isNight ? '#94a3b8' : '#475569'} fontSize="10" textAnchor="middle" fontWeight="bold">TRANSIT HUB</text>
            <text x="755" y="250" fill={isNight ? '#64748b' : '#64748b'} fontSize="9" textAnchor="middle">BUS & LRT</text>
          </g>

          {/* Base Road Tracks */}
          {!hideRoutes && <g fill="none">
            {/* Route A base road */}
            <path
              d={displayRouteAPath}
              stroke={isNight ? '#1e293b' : '#cbd5e1'}
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Route B base road */}
            <path
              d={displayRouteBPath}
              stroke={isNight ? '#1e293b' : '#cbd5e1'}
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Route C base road */}
            <path
              d={displayRouteCPath}
              stroke={isNight ? '#1e293b' : '#cbd5e1'}
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>}

          {/* Active Highlighted Route Lines */}
          {!hideRoutes && <g fill="none">
            {/* Route A Line */}
            <path
              d={displayRouteAPath}
              stroke={selectedRoute === 'A' ? '#F4B942' : (isNight ? '#334155' : '#94a3b8')}
              strokeWidth={selectedRoute === 'A' ? '7' : '3'}
              strokeLinecap="round"
              strokeDasharray={selectedRoute === 'A' ? 'none' : '6 6'}
              className="transition-all duration-300"
              opacity={selectedRoute && selectedRoute !== 'A' ? '0.3' : '1'}
            />

            {/* Route B Line */}
            <path
              d={displayRouteBPath}
              stroke={selectedRoute === 'B' ? '#F4B942' : (isNight ? '#334155' : '#94a3b8')}
              strokeWidth={selectedRoute === 'B' ? '7' : '3'}
              strokeLinecap="round"
              strokeDasharray={selectedRoute === 'B' ? 'none' : '6 6'}
              className="transition-all duration-300"
              opacity={selectedRoute && selectedRoute !== 'B' ? '0.3' : '1'}
            />

            {/* Route C Line */}
            <path
              d={displayRouteCPath}
              stroke={selectedRoute === 'C' ? '#F4B942' : (isNight ? '#334155' : '#94a3b8')}
              strokeWidth={selectedRoute === 'C' ? '7' : '3'}
              strokeLinecap="round"
              strokeDasharray={selectedRoute === 'C' ? 'none' : '6 6'}
              className="transition-all duration-300"
              opacity={selectedRoute && selectedRoute !== 'C' ? '0.3' : '1'}
            />
          </g>}

          {!hideRoutes && routePaths?.[selectedRoute]?.path?.length > 1 && (
            <g pointerEvents="none">
              {[
                { point: routePaths[selectedRoute].path[0], label: 'S', color: '#2864A6' },
                { point: routePaths[selectedRoute].path[routePaths[selectedRoute].path.length - 1], label: 'D', color: '#ef4444' }
              ].map(({ point, label, color }) => {
                const projected = projectPoint(point);
                return (
                  <g key={label}>
                    <circle cx={projected.x} cy={projected.y} r="11" fill={color} stroke="#ffffff" strokeWidth="3" />
                    <text x={projected.x} y={projected.y + 4} fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">
                      {label}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Route Direction Arrows / Text */}
          {!hideRoutes && <g fontSize="11" fontWeight="600">
            {/* Route A Label */}
            <text
              x="320"
              y="100"
              fill={selectedRoute === 'A' ? '#F4B942' : (isNight ? '#64748b' : '#64748b')}
              className="transition-colors"
            >
              Route A: Main Avenue (9 min Â· Model Cost 31)
            </text>

            {/* Route B Label */}
            <text
              x="320"
              y="415"
              fill={selectedRoute === 'B' ? '#F4B942' : (isNight ? '#64748b' : '#64748b')}
              className="transition-colors"
            >
              Route B: Garden Shortcut (6 min Â· Model Cost 43)
            </text>

            {/* Route C Label */}
            <text
              x="260"
              y="250"
              fill={selectedRoute === 'C' ? '#F4B942' : (isNight ? '#64748b' : '#64748b')}
              className="transition-colors"
            >
              Route C: Courtyard Link (8 min Â· Shortest 520m)
            </text>
          </g>}

          {/* Lamp Radiance Cones / Illumination halos */}
          <g>
            {SCHEMATIC_NODES.map((node) => {
              const isActive = activeLamps.includes(node.id);
              const isFault = hazards.some(h => h.affectedNode === node.id && h.status !== 'Resolved');

              if (isActive) {
                return (
                  <circle
                    key={`halo-${node.id}`}
                    cx={node.x}
                    cy={node.y}
                    r="34"
                    fill="rgba(244, 185, 66, 0.2)"
                    filter="url(#amber-glow)"
                  />
                );
              }

              return null;
            })}
          </g>

          {/* Schematic Lamp Nodes (L-01 to L-08) */}
          <g>
            {SCHEMATIC_NODES.map((node) => {
              const isActive = activeLamps.includes(node.id);
              const isCurrent = currentCheckpointNode === node.id;
              const hasFault = hazards.some(h => h.affectedNode === node.id && h.status !== 'Resolved');

              let nodeColor = isNight ? '#334155' : '#cbd5e1';
              let ringColor = isNight ? '#64748b' : '#94a3b8';

              if (isActive) {
                nodeColor = '#F4B942';
                ringColor = '#142B4A';
              } else if (hasFault) {
                nodeColor = '#f59e0b';
                ringColor = '#b45309';
              }

              return (
                <g
                  key={node.id}
                  className="cursor-pointer group"
                  onClick={() => onSelectNode && onSelectNode(node)}
                >
                  {/* Outer ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isActive || isCurrent ? 14 : 11}
                    fill={isActive ? '#F4B942' : (isNight ? '#1e293b' : '#ffffff')}
                    stroke={ringColor}
                    strokeWidth={isCurrent ? 3 : 2}
                    className="transition-all duration-300"
                  />

                  {/* Inner node dot */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isActive ? 6 : 4}
                    fill={isActive ? '#142B4A' : (hasFault ? '#d97706' : (isNight ? '#64748b' : '#475569'))}
                  />

                  {/* Node ID label */}
                  <rect
                    x={node.x - 18}
                    y={node.y - (node.y > 250 ? -18 : 28)}
                    width="36"
                    height="16"
                    rx="4"
                    fill={isNight ? '#142B4A' : '#ffffff'}
                    stroke={isNight ? '#334155' : '#e2e8f0'}
                    strokeWidth="1"
                    className="shadow-sm"
                  />
                  <text
                    x={node.x}
                    y={node.y - (node.y > 250 ? -30 : 16)}
                    fill={isNight ? '#e2e8f0' : '#1e293b'}
                    fontSize="9.5"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Current Resident Position Marker */}
          {currentCheckpointNode && (
            <g>
              {(() => {
                const node = SCHEMATIC_NODES.find(n => n.id === currentCheckpointNode);
                if (!node) return null;
                return (
                  <g className="animate-bounce">
                    <circle
                      cx={node.x}
                      cy={node.y - 28}
                      r="12"
                      fill="#2864A6"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="shadow-lg"
                    />
                    <text
                      x={node.x}
                      y={node.y - 24}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      A
                    </text>
                    <polygon
                      points={`${node.x - 4},${node.y - 18} ${node.x + 4},${node.y - 18} ${node.x},${node.y - 12}`}
                      fill="#2864A6"
                    />
                  </g>
                );
              })()}
            </g>
          )}

          {/* Hazard Marker Pins on Map */}
          <g>
            {hazards.filter(h => h.status !== 'Resolved').map((hazard) => {
              const node = SCHEMATIC_NODES.find(n => n.id === hazard.affectedNode);
              if (!node) return null;

              // Offset hazard pin slightly so it doesn't cover the node dot
              const offsetX = hazard.routesAffected?.includes('A') ? 18 : -18;
              const offsetY = hazard.routesAffected?.includes('A') ? -14 : 14;

              return (
                <g
                  key={`hazard-${hazard.id}`}
                  className="cursor-pointer group"
                  onClick={() => onSelectHazard && onSelectHazard(hazard)}
                >
                  <circle
                    cx={node.x + offsetX}
                    cy={node.y + offsetY}
                    r="9"
                    fill={hazard.severity === 'High' ? '#C83E4D' : '#F4B942'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="shadow-md"
                  />
                  <text
                    x={node.x + offsetX}
                    y={node.y + offsetY + 3}
                    fill="#ffffff"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    !
                  </text>
                  <title>{`${hazard.id}: ${hazard.title} (${hazard.severity} Severity)`}</title>
                </g>
              );
            })}
          </g>

          {/* Emergency Alert Pin (e.g. Duress alert AL-204 at L-07) */}
          {hasEmergency && emergencyAlert && (
            <g className="animate-pulse">
              <circle
                cx={580}
                cy={350}
                r="30"
                fill="none"
                stroke="#C83E4D"
                strokeWidth="2.5"
                filter="url(#emergency-pulse)"
              />
              <circle
                cx={580}
                cy={350}
                r="18"
                fill="rgba(200, 62, 77, 0.3)"
              />
              <rect
                x={580 - 45}
                y={350 - 48}
                width="90"
                height="20"
                rx="4"
                fill="#C83E4D"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x={580}
                y={350 - 34}
                fill="#ffffff"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                ALERT: {emergencyAlert.id}
              </text>
            </g>
          )}
        </svg>

        {/* Collapsible Map Legend â€” collapsed by default so the canvas is unobstructed */}
        {showLegend && (
          <div className="absolute bottom-3 left-3 z-20 flex flex-col items-start gap-1.5">
            {legendOpen && (
              <div className={`p-2.5 rounded-lg border text-[11px] backdrop-blur-md shadow-lg ${isNight ? 'bg-[#142B4A]/95 border-slate-700 text-slate-200' : 'bg-white/95 border-slate-200 text-slate-700'}`}>
                <div className="font-semibold text-[10px] tracking-wider uppercase opacity-80 border-b pb-1 mb-1.5 border-slate-600/40">
                  Schematic Legend
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F4B942] inline-block shadow-sm"></span>
                    <span>Streetlight: Normal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                    <span>Normal / Idle Light</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                    <span>Lighting Deficiency</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C83E4D] inline-block"></span>
                    <span>Reported Hazard / Alert</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <span className="w-3 h-0.5 bg-[#F4B942] inline-block"></span>
                    <span>Selected Route</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setLegendOpen(open => !open)}
              aria-expanded={legendOpen}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[11px] font-semibold shadow-sm transition-colors ${
                isNight
                  ? 'bg-[#142B4A]/90 border-slate-700 text-slate-200 hover:bg-[#142B4A]'
                  : legendOpen
                    ? 'bg-[#1F9D8B] border-[#1F9D8B] text-white'
                    : 'bg-white/95 border-slate-200 text-slate-600 hover:border-[#1F9D8B]/50 hover:text-[#1F9D8B]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Legend</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${legendOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}

        {/* Disclaimer water-mark */}
        <div className="absolute top-2 right-3 text-[10px] text-slate-400 opacity-75 font-mono select-none pointer-events-none">
          Simulated Township Topology Â· Demo Only
        </div>
      </div>
    </div>
  );
}

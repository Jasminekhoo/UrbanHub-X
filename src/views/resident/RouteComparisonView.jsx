import React, { useState, useEffect } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import {
  Clock,
  Ruler,
  ShieldCheck,
  Lightbulb,
  Eye,
  Footprints,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Play,
  Zap,
  Sparkles,
} from 'lucide-react';

// ── Route categories at top ───────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'safest',
    label: 'Safest',
    badge: '88/100',
    icon: ShieldCheck,
    routeId: 'A',
    activeColor: 'bg-emerald-600 text-white border-emerald-600 shadow-sm',
    inactiveColor: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
    iconColor: 'text-emerald-600',
    ringColor: 'ring-emerald-500',
    summary: 'Focuses on maximum lighting (94%), clear sightlines & active guard corridor.',
  },
  {
    id: 'fastest',
    label: 'Fastest',
    badge: '6 min',
    icon: Zap,
    routeId: 'B',
    activeColor: 'bg-amber-500 text-white border-amber-500 shadow-sm',
    inactiveColor: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
    iconColor: 'text-amber-500',
    ringColor: 'ring-amber-400',
    summary: 'Direct cut-through. Saves ~3 mins but has lower lighting and uneven pavement.',
  },
  {
    id: 'shortest',
    label: 'Shortest',
    badge: '0.52 km',
    icon: Ruler,
    routeId: 'C',
    activeColor: 'bg-[#2864A6] text-white border-[#2864A6] shadow-sm',
    inactiveColor: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
    iconColor: 'text-[#2864A6]',
    ringColor: 'ring-[#2864A6]',
    summary: 'Minimum walking steps (~650 steps) through internal residential courtyard link.',
  },
];

// ── Route data (Elmina-flavoured) ─────────────────────────────────────────────
const ROUTE_DATA = [
  {
    id: 'A',
    label: 'Route A',
    name: 'Central Boulevard',
    type: 'Main Avenue',
    category: 'safest',
    categoryLabel: 'Safest Choice',
    color: 'emerald', // Safest uses green (emerald)
    etaMin: 9,
    distanceKm: 0.82,
    safetyScore: 88,
    safetyLabel: 'High',
    recommended: true,
    lightCoverage: '94%',
    highlightNote: 'Best continuous illumination and active emergency points',
    metrics: [
      { icon: Lightbulb, label: 'Street Lighting',  value: 'Well-lit (94%)', status: 'good'    },
      { icon: Eye,       label: 'Sightlines',        value: 'Clear',          status: 'good'    },
      { icon: Footprints,label: 'Walkway Condition', value: 'Paved & Wide',   status: 'good'    },
      { icon: AlertTriangle, label: 'Known Hazards', value: '1 minor',       status: 'caution' },
    ],
    reason: 'Paved, well-lit boulevard with smart-lamp corridor. Minor streetlight fault near L-04 is noted.',
  },
  {
    id: 'B',
    label: 'Route B',
    name: 'Garden Shortcut',
    type: 'Direct Path',
    category: 'fastest',
    categoryLabel: 'Fastest ETA',
    color: 'amber', // Fastest uses amber
    etaMin: 6,
    distanceKm: 0.68,
    safetyScore: 62,
    safetyLabel: 'Medium',
    recommended: false,
    lightCoverage: '58%',
    highlightNote: 'Fastest route to transit hub (saves 3 minutes)',
    metrics: [
      { icon: Lightbulb, label: 'Street Lighting',  value: 'Partial (58%)',  status: 'caution' },
      { icon: Eye,       label: 'Sightlines',        value: 'Overgrown',     status: 'warn'    },
      { icon: Footprints,label: 'Walkway Condition', value: 'Uneven Pavers', status: 'warn'    },
      { icon: AlertTriangle, label: 'Known Hazards', value: '3 reported',    status: 'warn'    },
    ],
    reason: 'Fastest cut-through, but passes low-lit garden sections with overgrown vegetation and uneven pavers.',
  },
  {
    id: 'C',
    label: 'Route C',
    name: 'Courtyard Link',
    type: 'Inner Walkway',
    category: 'shortest',
    categoryLabel: 'Shortest Distance',
    color: 'blue', // Shortest uses blue
    etaMin: 8,
    distanceKm: 0.52,
    safetyScore: 76,
    safetyLabel: 'Good',
    recommended: false,
    lightCoverage: '78%',
    highlightNote: 'Only 520m walking distance (~650 steps)',
    metrics: [
      { icon: Lightbulb, label: 'Street Lighting',  value: 'Good (78%)',     status: 'good'    },
      { icon: Eye,       label: 'Sightlines',        value: 'Enclosed',       status: 'caution' },
      { icon: Footprints,label: 'Walkway Condition', value: 'Paved Courtyard',status: 'good'   },
      { icon: AlertTriangle, label: 'Known Hazards', value: 'Gate access',   status: 'caution' },
    ],
    reason: 'Shortest physical distance through residential inner courtyard link with steady lighting.',
  },
];

const colorMap = {
  emerald: { ring: 'ring-emerald-600 border-emerald-600', badge: 'bg-emerald-600 text-white', bg: 'bg-emerald-50/70', bar: 'bg-emerald-600', pill: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  amber:   { ring: 'ring-amber-500 border-amber-500', badge: 'bg-amber-500 text-white', bg: 'bg-amber-50/70',   bar: 'bg-amber-500',    pill: 'bg-amber-50 text-amber-800 border-amber-200' },
  blue:    { ring: 'ring-[#2864A6] border-[#2864A6]', badge: 'bg-[#2864A6] text-white', bg: 'bg-sky-50/70',     bar: 'bg-[#2864A6]',    pill: 'bg-sky-50 text-sky-800 border-sky-200' },
  slate:   { ring: 'ring-slate-400 border-slate-400', badge: 'bg-slate-600 text-white', bg: 'bg-slate-50',      bar: 'bg-slate-500',    pill: 'bg-slate-100 text-slate-700 border-slate-200' },
};

const statusStyle = {
  good:    'text-emerald-700 bg-emerald-50 border-emerald-200',
  caution: 'text-amber-700  bg-amber-50  border-amber-200',
  warn:    'text-rose-700   bg-rose-50   border-rose-200',
};

const safetyColor = (score) => {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 65) return 'text-amber-600';
  return 'text-rose-600';
};

export function RouteComparisonView() {
  const { setResidentTab, selectedRouteId, setSelectedRouteId, routeCategory, setRouteCategory, startJourney } = useNightSafe();
  
  // Initialize from context or routeId
  const [activeCategory, setActiveCategory] = useState(routeCategory || 'safest');
  const [selected, setSelected] = useState(selectedRouteId || 'A');

  // Keep in sync with parent context if changed externally
  useEffect(() => {
    if (routeCategory && routeCategory !== activeCategory) {
      setActiveCategory(routeCategory);
      const matched = CATEGORIES.find(c => c.id === routeCategory);
      if (matched) {
        setSelected(matched.routeId);
        setSelectedRouteId(matched.routeId);
      }
    }
  }, [routeCategory]);

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    if (setRouteCategory) setRouteCategory(catId);
    const matched = CATEGORIES.find(c => c.id === catId);
    if (matched) {
      setSelected(matched.routeId);
      setSelectedRouteId(matched.routeId);
    }
  };

  const handleRouteCardClick = (route) => {
    setSelected(route.id);
    setSelectedRouteId(route.id);
    setActiveCategory(route.category);
    if (setRouteCategory) setRouteCategory(route.category);
  };

  const handleChoose = (id) => {
    setSelected(id);
    setSelectedRouteId(id);
    startJourney(id);
    setResidentTab('journey');
  };

  // Re-order routes so the chosen category's recommended route is shown first
  const sortedRoutes = [...ROUTE_DATA].sort((a, b) => {
    if (a.category === activeCategory) return -1;
    if (b.category === activeCategory) return 1;
    return 0;
  });

  const activeCategoryObj = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA]">

      {/* ── Sticky Back Bar ──────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-2 px-4 pt-3 pb-2 bg-[#F5F7FA] border-b border-slate-200 z-10">
        <button
          onClick={() => setResidentTab('routes-entry')}
          className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
        </button>
        <div>
          <span className="text-xs font-bold text-slate-800">Choose a Safe Route</span>
          <span className="block text-[9px] text-slate-400 font-medium">Elmina Township · Real-time NightSafe</span>
        </div>
      </div>

      {/* ── Top Category Bar: Fastest / Safest / Shortest ────────── */}
      <div className="shrink-0 bg-white px-3.5 pt-2.5 pb-2.5 border-b border-slate-200 shadow-[0_2px_4px_rgba(0,0,0,0.03)] z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#2864A6]" />
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
              Route Category
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            Tap to select priority
          </span>
        </div>

        {/* Category Buttons (Safest / Fastest / Shortest) */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/70">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`relative flex flex-col items-center justify-center py-2 px-1.5 rounded-lg border text-center transition-all ${
                  isActive
                    ? cat.activeColor
                    : `${cat.inactiveColor} text-slate-600`
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : cat.iconColor}`} />
                  <span className="text-xs font-bold leading-none">{cat.label}</span>
                </div>
                <span className={`text-[9px] font-medium leading-none ${isActive ? 'text-white/90' : 'text-slate-400'}`}>
                  {cat.badge}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <div className={`absolute -top-1 right-1 w-2 h-2 rounded-full bg-white ring-2 ${cat.ringColor} shadow-sm`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Category Context Hint */}
        <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-1.5 text-[10px] text-slate-600">
          <activeCategoryObj.icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${activeCategoryObj.iconColor}`} />
          <p className="leading-snug">
            <span className="font-bold text-slate-800">{activeCategoryObj.label} Mode: </span>
            {activeCategoryObj.summary}
          </p>
        </div>
      </div>

      {/* ── Scrollable Route Cards ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-3.5">
        {sortedRoutes.map((route) => {
          const isSelected = selected === route.id;
          const c = colorMap[route.color] || colorMap.blue;

          return (
            <div
              key={route.id}
              onClick={() => handleRouteCardClick(route)}
              className={`relative rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? `${c.bg} ${c.ring} ring-2 shadow-md`
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Recommended badge */}
              {route.recommended && (
                <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                  ✦ Recommended
                </div>
              )}

              <div className="p-3.5 space-y-2.5">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-extrabold shadow-sm ${
                      isSelected ? c.badge : 'bg-slate-100 text-slate-600'
                    }`}>
                      {route.id}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 leading-tight">{route.name}</div>
                      <div className="text-[10px] text-slate-500">{route.type}</div>
                    </div>
                  </div>

                  {/* Safety score */}
                  <div className="text-right">
                    <div className={`text-lg font-extrabold leading-tight ${safetyColor(route.safetyScore)}`}>
                      {route.safetyScore}
                      <span className="text-[10px] font-semibold text-slate-400">/100</span>
                    </div>
                    <div className="text-[9px] text-slate-400 font-medium">Safety Score</div>
                  </div>
                </div>

                {/* Stats row: ETA · Distance · Lighting */}
                <div className="flex items-center gap-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                  <div className="flex-1 flex flex-col items-center py-2 border-r border-slate-100">
                    <Clock className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                    <span className="text-xs font-bold text-slate-800">{route.etaMin} min</span>
                    <span className="text-[9px] text-slate-400">ETA</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center py-2 border-r border-slate-100">
                    <Ruler className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                    <span className="text-xs font-bold text-slate-800">{route.distanceKm} km</span>
                    <span className="text-[9px] text-slate-400">Distance</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center py-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
                    <span className="text-xs font-bold text-slate-800">{route.lightCoverage}</span>
                    <span className="text-[9px] text-slate-400">Lit</span>
                  </div>
                </div>

                {/* Safety score bar */}
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${c.bar}`}
                    style={{ width: `${route.safetyScore}%` }}
                  />
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 gap-1.5">
                  {route.metrics.map((m, i) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[10px] font-semibold ${statusStyle[m.status]}`}
                      >
                        <Icon className="w-3 h-3 shrink-0" />
                        <span className="truncate">{m.value}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Reason description */}
                <p className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-100 pt-2">
                  {route.reason}
                </p>

                {/* Choose button — visible when selected */}
                {isSelected && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleChoose(route.id); }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-98 ${c.badge}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start — {route.label} ({route.name})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

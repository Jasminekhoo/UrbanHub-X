import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import { GoogleMapsTownshipView } from '../../components/GoogleMapsTownshipView';
import { calculateRouteCost } from '../../data/nightSafeData';
import {
  DEMO_ROUTE_DESTINATION,
  DEMO_ROUTE_ORIGIN,
  ROUTE_LOCATION_COORDS,
} from '../../data/elminaRouteLocations';
import { HAZARD_COORDINATES, NODE_COORDINATES } from '../../data/elminaGeoData';
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

// â”€â”€ Route categories at top â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CATEGORIES = [
  {
    id: 'safest',
    label: 'Safest',
    badge: 'Recommended',
    icon: ShieldCheck,
    routeId: 'A',
    activeColor: 'bg-emerald-600 text-white border-emerald-600 shadow-sm',
    inactiveColor: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
    iconColor: 'text-emerald-600',
    ringColor: 'ring-emerald-500',
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
  },
];

// â”€â”€ Route data (Elmina-flavoured) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    reason: 'Paved, well-lit boulevard. Minor streetlight fault near L-04 is noted.',
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

const haversineMeters = (a, b) => {
  const radians = degrees => degrees * Math.PI / 180;
  const latDelta = radians(b.lat - a.lat);
  const lngDelta = radians(b.lng - a.lng);
  const value = Math.sin(latDelta / 2) ** 2 +
    Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(lngDelta / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

const sampleRoute = path => {
  const samples = path.length ? [path[0]] : [];
  path.slice(1).forEach((point, index) => {
    const previous = path[index];
    const segmentLength = haversineMeters(previous, point);
    const steps = Math.max(1, Math.ceil(segmentLength / 30));
    for (let step = 1; step <= steps; step += 1) {
      const ratio = step / steps;
      samples.push({
        lat: previous.lat + (point.lat - previous.lat) * ratio,
        lng: previous.lng + (point.lng - previous.lng) * ratio,
      });
    }
  });
  return samples;
};

const measureRoadSafety = (route, hazards, activeLamps) => {
  const pathSamples = sampleRoute(route.path);
  const mappedHazards = hazards
    .filter(hazard => hazard.status !== 'Resolved')
    .map(hazard => ({
      ...hazard,
      coordinates: HAZARD_COORDINATES[hazard.id] || NODE_COORDINATES[hazard.affectedNode],
    }))
    .filter(hazard => hazard.coordinates);
  const nearbyHazards = mappedHazards.filter(hazard =>
    pathSamples.some(point => haversineMeters(point, hazard.coordinates) <= 35)
  );
  const activeLampLocations = activeLamps
    .map(lampId => NODE_COORDINATES[lampId])
    .filter(Boolean);
  const litSamples = activeLampLocations.length
    ? pathSamples.filter(point =>
        activeLampLocations.some(lamp => haversineMeters(point, lamp) <= 45)
      ).length
    : 0;
  const lightingCoverage = pathSamples.length
    ? Math.round((litSamples / pathSamples.length) * 100)
    : 0;
  const hazardPenalty = nearbyHazards.reduce((total, hazard) => {
    if (hazard.severity === 'High') return total + 24;
    if (hazard.severity === 'Medium') return total + 12;
    return total + 6;
  }, 0);
  const safetyScore = Math.max(
    0,
    Math.min(100, Math.round(100 - hazardPenalty - (100 - lightingCoverage) * 0.22))
  );

  return {
    safetyScore,
    nearbyHazards,
    lightingCoverage,
  };
};

const sortRoutesForCategory = (routes, categoryId, hasCustomEndpoints) =>
  [...routes].sort((a, b) => {
    if (categoryId === 'fastest') {
      return a.etaMin - b.etaMin ||
        a.distanceKm - b.distanceKm ||
        b.safetyScore - a.safetyScore;
    }
    if (categoryId === 'shortest') {
      return a.distanceKm - b.distanceKm ||
        a.etaMin - b.etaMin ||
        b.safetyScore - a.safetyScore;
    }
    if (!hasCustomEndpoints) {
      return a.highSeverityHazards - b.highSeverityHazards ||
        a.mediumSeverityHazards - b.mediumSeverityHazards ||
        b.safetyScore - a.safetyScore;
    }
    return b.safetyScore - a.safetyScore ||
      a.nearbyHazards.length - b.nearbyHazards.length ||
      b.lightingCoverage - a.lightingCoverage ||
      a.etaMin - b.etaMin;
  });

export function RouteComparisonView() {
  const {
    setResidentTab,
    selectedRouteId,
    setSelectedRouteId,
    routeCategory,
    setRouteCategory,
    startJourney,
    activeLamps,
    hazards,
    appliedInterventions,
    journeyOrigin,
    journeyDestination,
    demoRouteFallback,
    setDemoRouteFallback
  } = useNightSafe();
  
  // Initialize from context or routeId
  const [activeCategory, setActiveCategory] = useState(routeCategory || 'safest');
  const [selected, setSelected] = useState(selectedRouteId || 'A');
  const [roadRoutes, setRoadRoutes] = useState(undefined);
  const [roadRouteFailures, setRoadRouteFailures] = useState(0);
  const hasCustomEndpoints = Boolean(ROUTE_LOCATION_COORDS[journeyOrigin] && ROUTE_LOCATION_COORDS[journeyDestination]);
  const isUsingCustomRoutes = hasCustomEndpoints && !demoRouteFallback;
  const handleRoadRoutes = useCallback((routes, failureCount = 0) => {
    setRoadRoutes(routes);
    setRoadRouteFailures(failureCount);
    const hasThreeRoutes = Array.isArray(routes) && routes.length >= 3;
    setDemoRouteFallback(hasCustomEndpoints && !hasThreeRoutes);
  }, [hasCustomEndpoints, setDemoRouteFallback]);
  const fromPin = useMemo(
    () => ({ ...ROUTE_LOCATION_COORDS[journeyOrigin], label: journeyOrigin }),
    [journeyOrigin]
  );
  const toPin = useMemo(
    () => ({ ...ROUTE_LOCATION_COORDS[journeyDestination], label: journeyDestination }),
    [journeyDestination]
  );
  // Compute dynamic route safety metrics based on appliedInterventions and active hazards
  const dynamicRoutes = isUsingCustomRoutes
    ? (roadRoutes || []).map((roadRoute, index) => {
      const routeId = roadRoute.routeId || ['A', 'B', 'C'][index];
      const routeTemplate = ROUTE_DATA.find(route => route.id === routeId) || ROUTE_DATA[index];
      const safety = measureRoadSafety(roadRoute, hazards, activeLamps);
      return {
        ...routeTemplate,
        id: routeId,
        label: `Route ${routeId}`,
        name: routeTemplate.name,
        type: 'Google walking route',
        etaMin: Math.max(1, Math.ceil(roadRoute.durationMillis / 60000)),
        distanceKm: Number((roadRoute.distanceMeters / 1000).toFixed(2)),
        safetyScore: safety.safetyScore,
        lightingCoverage: safety.lightingCoverage,
        lightCoverage: safety.lightingCoverage,
        nearbyHazards: safety.nearbyHazards,
        metrics: [
          {
            icon: Lightbulb,
            label: 'Active lamp coverage',
            value: `${safety.lightingCoverage}% of route near active lamps`,
            status: safety.lightingCoverage >= 70 ? 'good' : safety.lightingCoverage >= 35 ? 'caution' : 'warn',
          },
          {
            icon: AlertTriangle,
            label: 'Nearby known hazards',
            value: `${safety.nearbyHazards.length} within 35 m`,
            status: safety.nearbyHazards.some(hazard => hazard.severity === 'High')
              ? 'warn'
              : safety.nearbyHazards.length ? 'caution' : 'good',
          },
        ],
        reason: 'Estimated from active lamp locations and mapped, unresolved hazards within 35 m. This is an indicative score, not a safety guarantee.',
      };
    })
    : ROUTE_DATA.map(route => {
    const costData = calculateRouteCost(route.id, appliedInterventions || []);
    // Safety score formula: scale total cost inversely into 0-100 (baseline 24-40 range)
    const normalizedSafetyScore = Math.max(50, Math.min(96, Math.round(100 - (costData.totalCost * 1.3))));
    
    // Filter active (unresolved) hazards affecting this route
    const activeRouteHazards = hazards.filter(h => 
      h.status !== 'Resolved' &&
      ((h.routesAffected && h.routesAffected.includes(route.id)) || (route.id === 'A' && h.affectedNode === 'L-04') || (route.id === 'B' && h.affectedNode === 'L-06'))
    );
    const highSeverityHazards = activeRouteHazards.filter(h => h.severity === 'High').length;
    const mediumSeverityHazards = activeRouteHazards.filter(h => h.severity === 'Medium').length;

    const hazardCountText = activeRouteHazards.length === 0 
      ? '0 hazards' 
      : `${activeRouteHazards.length} active`;

    return {
      ...route,
      safetyScore: normalizedSafetyScore,
      activeRouteHazards,
      highSeverityHazards,
      mediumSeverityHazards,
      reason: highSeverityHazards > 0
        ? `${activeRouteHazards.length} active hazards remain, including ${highSeverityHazards} high-severity hazard${highSeverityHazards === 1 ? '' : 's'}.`
        : route.reason,
      metrics: route.metrics.map(m => {
        if (m.label === 'Known Hazards') {
          return {
            ...m,
            value: hazardCountText,
            status: activeRouteHazards.length === 0 ? 'good' : activeRouteHazards.some(h => h.severity === 'High') ? 'warn' : 'caution'
          };
        }
        if (m.label === 'Street Lighting' && costData.lightingPenalty <= 4) {
          return { ...m, value: 'Optimal (96%)', status: 'good' };
        }
        if (m.label === 'Sightlines' && costData.sightlinePenalty <= 2) {
          return { ...m, value: 'Cleared', status: 'good' };
        }
        if (m.label === 'Walkway Condition' && costData.pathwayPenalty <= 2) {
          return { ...m, value: 'Repaved', status: 'good' };
        }
        return m;
      })
    };
  });

  const safestRoute = sortRoutesForCategory(dynamicRoutes, 'safest', isUsingCustomRoutes)[0] || ROUTE_DATA[0];
  const fastestRoute = sortRoutesForCategory(dynamicRoutes, 'fastest', isUsingCustomRoutes)[0] || ROUTE_DATA[1];
  const shortestRoute = sortRoutesForCategory(dynamicRoutes, 'shortest', isUsingCustomRoutes)[0] || ROUTE_DATA[2];
  const categoryRoutes = {
    safest: safestRoute,
    fastest: fastestRoute,
    shortest: shortestRoute,
  };
  const categories = CATEGORIES.map(category => {
    const candidate = categoryRoutes[category.id];
    if (isUsingCustomRoutes && !dynamicRoutes.length) {
      return {
        ...category,
        routeId: null,
        badge: roadRoutes === undefined ? 'Finding…' : 'Unavailable',
      };
    }
    if (!isUsingCustomRoutes) {
      return category.id === 'safest'
        ? {
            ...category,
            routeId: safestRoute.id,
            badge: `Route ${safestRoute.id}`,
          }
        : category;
    }
    return { ...category, routeId: candidate.id, badge: `Route ${candidate.id}` };
  });

  // Keep in sync with parent context if changed externally
  useEffect(() => {
    if (isUsingCustomRoutes) return;
    const category = routeCategory || 'safest';
    setActiveCategory(category);
    const matched = categories.find(c => c.id === category);
    if (matched) {
      setSelected(matched.routeId);
      if (selectedRouteId !== matched.routeId) setSelectedRouteId(matched.routeId);
    }
  }, [isUsingCustomRoutes, routeCategory, safestRoute.id]);

  useEffect(() => {
    if (!isUsingCustomRoutes || !dynamicRoutes.length) return;
    const recommendedRouteId = categories.find(category => category.id === activeCategory)?.routeId;
    if (recommendedRouteId && dynamicRoutes.some(route => route.id === recommendedRouteId)) {
      setSelected(recommendedRouteId);
      setSelectedRouteId(recommendedRouteId);
    }
  }, [isUsingCustomRoutes, roadRoutes, activeCategory, setSelectedRouteId]);

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    if (setRouteCategory) setRouteCategory(catId);
    const matched = categories.find(c => c.id === catId);
    if (matched?.routeId) {
      setSelected(matched.routeId);
      setSelectedRouteId(matched.routeId);
    }
  };

  const handleRouteCardClick = (route) => {
    setSelected(route.id);
    setSelectedRouteId(route.id);
  };

  const handleChoose = (id) => {
    setSelected(id);
    setSelectedRouteId(id);
    startJourney(id);
    setResidentTab('journey');
  };

  const activeCategoryLabel = categories.find(category => category.id === activeCategory)?.label || 'Safest';
  const sortedRoutes = sortRoutesForCategory(dynamicRoutes, activeCategory, isUsingCustomRoutes);
  const routeOriginLabel = demoRouteFallback ? DEMO_ROUTE_ORIGIN : journeyOrigin;
  const routeDestinationLabel = demoRouteFallback ? DEMO_ROUTE_DESTINATION : journeyDestination;

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA]">

      {/* ── Sticky Back Bar ────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-4 pt-3 pb-2 bg-[#F5F7FA] border-b border-slate-200 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setResidentTab('routes-entry')}
            className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
          </button>
          <div>
            <span className="text-xs font-bold text-slate-800">
              {isUsingCustomRoutes ? 'Choose a Walking Route' : 'Choose a Safe Route'}
            </span>
            <span className="block text-[9px] text-slate-400 font-medium">
              {isUsingCustomRoutes ? 'Google Maps road routes' : demoRouteFallback ? 'Fixed Elmina demo route' : 'Elmina Township · Real-time NightSafe'}
            </span>
          </div>
        </div>
        {(journeyOrigin && journeyDestination || demoRouteFallback) && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-200 shadow-xs text-[9px] font-semibold text-slate-600 max-w-[170px] truncate">
            <span className="truncate text-slate-900">{routeOriginLabel.split(',')[0]}</span>
            <span className="text-[#2864A6]">→</span>
            <span className="truncate text-[#2864A6]">{routeDestinationLabel.split(',')[0]}</span>
          </div>
        )}
      </div>

      {/* â”€â”€ Top Category Bar: Fastest / Safest / Shortest â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                disabled={isUsingCustomRoutes && !dynamicRoutes.length}
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

      </div>

      {/* â”€â”€ Route Google Maps Preview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="shrink-0 h-44 w-full border-b border-slate-200 relative overflow-hidden bg-slate-100">
        <GoogleMapsTownshipView
          theme="day"
          selectedRoute={selected}
          fromPin={isUsingCustomRoutes ? fromPin : null}
          toPin={isUsingCustomRoutes ? toPin : null}
          onRoadRoutes={isUsingCustomRoutes ? handleRoadRoutes : null}
          activeLamps={activeLamps}
          hazards={hazards}
          height="100%"
          showOverlayLabels={false}
          showHeader={false}
        />
        <div className="absolute top-2 left-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5 z-10 pointer-events-none">
          <span className={`w-2 h-2 rounded-full ${
            selected === 'A' ? 'bg-emerald-500' : selected === 'B' ? 'bg-amber-500' : 'bg-[#2864A6]'
          }`} />
          <span className="text-[10px] font-bold text-slate-800">
            {`Route ${selected}`} Preview · {isUsingCustomRoutes ? 'Google Maps' : demoRouteFallback ? 'Demo' : 'Elmina'}
          </span>
        </div>
      </div>

      {/* â”€â”€ Scrollable Route Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-3.5">
        {isUsingCustomRoutes && roadRoutes === undefined && (
          <p className="rounded-xl bg-white p-4 text-center text-xs text-slate-500">Finding walking routes on mapped roads…</p>
        )}
        {isUsingCustomRoutes && roadRoutes === null && (
          <p className="rounded-xl bg-white p-4 text-center text-xs text-slate-600">Google Maps could not load walking routes. Please try again later.</p>
        )}
        {isUsingCustomRoutes && Array.isArray(roadRoutes) && roadRoutes.length === 0 && (
          <p className="rounded-xl bg-white p-4 text-center text-xs text-slate-600">
            {roadRouteFailures
              ? 'Google Maps could not load walking routes. Please try again later.'
              : 'No walking route was found for these locations.'}
          </p>
        )}
        {isUsingCustomRoutes && Array.isArray(roadRoutes) && roadRoutes.length > 0 && roadRouteFailures > 0 && (
          <p className="rounded-xl bg-amber-50 p-3 text-center text-[10px] text-amber-800">
            Some route options could not be loaded. Showing the available routes.
          </p>
        )}
        {demoRouteFallback && (
          <p className="rounded-xl bg-amber-50 p-3 text-center text-[10px] text-amber-800">
            Custom routes are unavailable. Showing demo routes from {DEMO_ROUTE_ORIGIN} to {DEMO_ROUTE_DESTINATION}; these do not match your selected locations.
          </p>
        )}
        {sortedRoutes.map((route, index) => {
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
              {isUsingCustomRoutes ? (
                <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[9px] font-bold uppercase tracking-wider shadow-sm">
                  {index === 0
                    ? `#1 Best match · ${activeCategoryLabel}`
                    : `#${index + 1} · ${activeCategoryLabel} priority`}
                </div>
              ) : route.id === safestRoute.id && (
                <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                  Lowest Current Risk
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
                    {route.safetyScore === null ? (
                      <>
                        <div className="text-xs font-bold text-slate-500">Unknown</div>
                        <div className="text-[9px] text-slate-400 font-medium">Safety</div>
                      </>
                    ) : (
                      <>
                        <div className={`text-lg font-extrabold leading-tight ${safetyColor(route.safetyScore)}`}>
                          {route.safetyScore}
                          <span className="text-[10px] font-semibold text-slate-400">/100</span>
                        </div>
                        <div className="text-[9px] text-slate-400 font-medium">
                          {isUsingCustomRoutes ? 'Estimated safety' : 'Safety Score'}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats row: ETA  ·  Distance  ·  Lighting */}
                <div className="flex items-center gap-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                  <div className="flex-1 flex flex-col items-center py-2 border-r border-slate-100">
                    <Clock className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                    <span className="text-xs font-bold text-slate-800">{route.etaMin ? `${route.etaMin} min` : '—'}</span>
                    <span className="text-[9px] text-slate-400">ETA</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center py-2 border-r border-slate-100">
                    <Ruler className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                    <span className="text-xs font-bold text-slate-800">{route.distanceKm ? `${route.distanceKm} km` : '—'}</span>
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

                {/* Choose button  —  visible when selected */}
                {isSelected && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleChoose(route.id); }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-98 ${c.badge}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start  —  {route.label} ({route.name})</span>
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

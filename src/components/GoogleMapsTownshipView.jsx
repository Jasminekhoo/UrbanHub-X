import React, { useEffect, useRef, useState, useCallback } from 'react';
import { loadGoogleMapsScript, resetGoogleMapsLoader, isGoogleMapsReady } from '../utils/googleMapsLoader';
import { ELMINA_CENTER, NODE_COORDINATES, ROUTE_GPS_PATHS, HAZARD_COORDINATES } from '../data/elminaGeoData';
import { findPedestrianRoute } from '../utils/pedestrianRouter';
import { SchematicTownshipMap } from './SchematicTownshipMap';

export function GoogleMapsTownshipView({
  theme = 'day',
  selectedRoute = 'A',
  activeLamps = [],
  currentCheckpointNode = null,
  hazards = [],
  onSelectHazard = null,
  alerts = [],
  height = '100%',
  showHeader = false,
  showOverlayLabels = true,
  fillContainer = false,
  // Optional origin/destination pin lat/lng for NightPathView
  fromPin = null,  // { lat, lng, label }
  toPin = null,    // { lat, lng, label }
  simpleMode = false, // true = minimal overlays (just pins), for location picker
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);
  const circlesRef = useRef([]);
  const directionsRendererRef = useRef(null);
  const [routeStatus, setRouteStatus] = useState('idle'); // 'idle' | 'loading' | 'ok' | 'local_graph' | 'unavailable'

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  // 'idle' | 'loading' | 'loaded' | 'error' | 'no_key'
  const [loadState, setLoadState] = useState('idle');

  // ── Step 1: Start loading script ───────────────────────────────────────────
  useEffect(() => {
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
      setLoadState('no_key');
      return;
    }

    let cancelled = false;
    setLoadState('loading');

    // onAuthFailure: called by googleMapsLoader when gm_authFailure fires.
    // This can happen before OR after the script's onload — the loader handles
    // both orderings, so we just need to react here.
    const handleAuthFailure = () => {
      if (!cancelled) setLoadState('error');
    };

    loadGoogleMapsScript(apiKey, handleAuthFailure)
      .then(() => {
        if (!cancelled) setLoadState('loaded');
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn('[GoogleMapsTownshipView] Maps load failed — using schematic fallback:', err?.message || err);
          setLoadState('error');
        }
      });

    return () => { cancelled = true; };
  }, [apiKey]);

  // ── Step 2: Init map once script is loaded AND div is in the DOM ───────────
  useEffect(() => {
    if (loadState !== 'loaded') return;
    if (!mapContainerRef.current) return;
    if (!window.google || !window.google.maps) return;

    // Destroy old instance if any
    if (mapInstanceRef.current) {
      clearMapObjects();
      mapInstanceRef.current = null;
    }

    const maps = window.google.maps;
    const ControlPosition = maps.ControlPosition || maps.core?.ControlPosition;
    const isDark = theme === 'night';

    const lightStyle = [
      { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#374151' }] },
      { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d1fae5' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#bae6fd' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f1f5f9' }] },
      { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#e2e8f0' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#cbd5e1' }] },
      { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
    ];

    const darkStyle = [
      { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
      { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#253d68' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c6693' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#023e58' }] },
    ];

    // Guard: gm_authFailure may have fired between state update and this effect.
    // Constructing a Map with an invalid auth throws synchronously and would
    // propagate as an unhandled React render error — catch it and fall back.
    let map;
    try {
      const zoomControlOptions = ControlPosition?.RIGHT_CENTER != null
        ? { position: ControlPosition.RIGHT_CENTER }
        : undefined;

      map = new maps.Map(mapContainerRef.current, {
        center: ELMINA_CENTER,
        zoom: 15.5,
        mapTypeId: 'roadmap',
        disableDefaultUI: true,
        zoomControl: true,
        ...(zoomControlOptions ? { zoomControlOptions } : {}),
        fullscreenControl: false,
        styles: isDark ? darkStyle : lightStyle,
      });
    } catch (initErr) {
      console.warn('[GoogleMapsTownshipView] Map init failed — falling back to schematic:', initErr?.message || initErr);
      setLoadState('error');
      return;
    }

    mapInstanceRef.current = map;
    renderOverlays(maps, map);

    const resizeObserver = new ResizeObserver(() => {
      if (!mapInstanceRef.current) return;
      maps.event.trigger(mapInstanceRef.current, 'resize');
      const center = mapInstanceRef.current.getCenter();
      if (center) mapInstanceRef.current.setCenter(center);
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      clearMapObjects();
      mapInstanceRef.current = null;
    };
  }, [loadState, theme]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const clearMapObjects = () => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
  };

  const drawLocalPedestrianRoute = (maps, map, startPin, endPin) => {
    if (!startPin || !endPin) return;
    const result = findPedestrianRoute(
      { lat: startPin.lat, lng: startPin.lng },
      { lat: endPin.lat, lng: endPin.lng }
    );
    if (result && result.path && result.path.length >= 2) {
      const polyline = new maps.Polyline({
        path: result.path,
        geodesic: true,
        strokeColor: '#2864A6',
        strokeOpacity: 0.9,
        strokeWeight: 5,
        map,
        zIndex: 15,
      });
      polylinesRef.current.push(polyline);
      setRouteStatus('local_graph');
    } else {
      setRouteStatus('unavailable');
    }
  };

  const renderOverlays = (maps, map) => {
    clearMapObjects();

    if (simpleMode) {
      // ── Simple mode: origin/destination clean standard pins + walking route ──
      if (fromPin) {
        // Standard, clean origin pin (SVG map pin icon)
        const marker = new maps.Marker({
          position: { lat: fromPin.lat, lng: fromPin.lng },
          map,
          title: fromPin.label || 'Origin',
          zIndex: 20,
          icon: {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: '#2864A6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 1.5,
            scale: 1.3,
            anchor: new maps.Point(12, 22),
          },
        });
        markersRef.current.push(marker);
      }

      if (toPin) {
        // Standard, clean destination pin (SVG map pin icon)
        const marker = new maps.Marker({
          position: { lat: toPin.lat, lng: toPin.lng },
          map,
          title: toPin.label || 'Destination',
          zIndex: 20,
          icon: {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 1.5,
            scale: 1.4,
            anchor: new maps.Point(12, 22),
          },
        });
        markersRef.current.push(marker);
      }

      // In simpleMode (location picker), only show the origin and destination pins without any route line
      setRouteStatus('idle');
      return;
    }

    // ── Full mode: routes + nodes + hazards ───────────────────────────────────
    // 1. Draw Routes
    ['A', 'B', 'C'].forEach((rId) => {
      const isSelected = selectedRoute === rId;
      const color = rId === 'A' ? '#10b981' : rId === 'B' ? '#f59e0b' : '#2864a6';

      const polyline = new maps.Polyline({
        path: ROUTE_GPS_PATHS[rId],
        geodesic: true,
        strokeColor: color,
        strokeOpacity: isSelected ? 0.95 : 0.35,
        strokeWeight: isSelected ? 6 : 3,
        map,
        zIndex: isSelected ? 10 : 2,
      });
      polylinesRef.current.push(polyline);
    });

    // 2. Draw Checkpoint Lamp Nodes
    Object.entries(NODE_COORDINATES).forEach(([nodeId, pos]) => {
      const isCurrent = currentCheckpointNode === nodeId;
      const isLit = activeLamps.includes(nodeId);

      if (isLit) {
        const circle = new maps.Circle({
          strokeColor: '#f59e0b',
          strokeOpacity: 0.8,
          strokeWeight: 1.5,
          fillColor: '#fef08a',
          fillOpacity: 0.25,
          map,
          center: pos,
          radius: 45,
          zIndex: 5,
        });
        circlesRef.current.push(circle);
      }

      const marker = new maps.Marker({
        position: pos,
        map,
        title: `${pos.name} (${nodeId})`,
        zIndex: isCurrent ? 25 : 15,
        icon: {
          path: maps.SymbolPath.CIRCLE,
          scale: isCurrent ? 9 : 6.5,
          fillColor: isCurrent ? '#0284c7' : isLit ? '#f59e0b' : '#64748b',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });
      markersRef.current.push(marker);
    });

    // 3. Draw Hazard pins
    hazards.forEach((h) => {
      const hCoord = HAZARD_COORDINATES[h.id];
      if (!hCoord) return;

      const marker = new maps.Marker({
        position: hCoord,
        map,
        title: h.title,
        zIndex: 20,
        icon: {
          path: maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 4.5,
          fillColor: h.severity === 'High' ? '#ef4444' : '#f59e0b',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 1.5,
        },
      });
      if (onSelectHazard) {
        marker.addListener('click', () => onSelectHazard(h));
      }
      markersRef.current.push(marker);
    });
  };

  // ── Update overlays when props change (after map is ready) ─────────────────
  useEffect(() => {
    if (loadState === 'loaded' && window.google?.maps && mapInstanceRef.current) {
      renderOverlays(window.google.maps, mapInstanceRef.current);
    }
  }, [selectedRoute, activeLamps, currentCheckpointNode, hazards, onSelectHazard, fromPin, toPin]);

  // ── Render ─────────────────────────────────────────────────────────────────
  // Always render the map container div so mapContainerRef.current is available.
  // Show schematic overlay on top when not loaded.
  const showFallback = loadState === 'no_key' || loadState === 'error';

  if (showFallback) {
    return (
      <div className="relative w-full h-full">
        <SchematicTownshipMap
          theme={theme}
          selectedRoute={selectedRoute}
          activeLamps={activeLamps}
          currentCheckpointNode={currentCheckpointNode}
          hazards={hazards}
          alerts={alerts}
          onSelectHazard={onSelectHazard}
          height={height}
          fillContainer={fillContainer}
          showLegend={false}
          showOverlayLabels={showOverlayLabels}
          showHeader={showHeader}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Map container — always in DOM so ref is available on first render */}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ height, minHeight: '300px' }}
      />

      {/* Loading shimmer overlay — sits on top until map tiles load */}
      {(loadState === 'idle' || loadState === 'loading') && (
        <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center gap-2 z-10">
          <div className="w-8 h-8 border-2 border-[#2864A6] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Loading map…</span>
        </div>
      )}

      {/* Route calculation & pedestrian status badges */}
      {simpleMode && routeStatus === 'unavailable' && (
        <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-600/90 text-white shadow-md backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span className="text-[10px] font-semibold">Walking route unavailable between selected points</span>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { loadGoogleMapsScript } from '../utils/googleMapsLoader';
import { ELMINA_CENTER, NODE_COORDINATES, ROUTE_GPS_PATHS, HAZARD_COORDINATES } from '../data/elminaGeoData';
import { SchematicTownshipMap } from './SchematicTownshipMap';

const ROUTE_WAYPOINTS = {
  A: [{ lat: 3.18931, lng: 101.51981 }],
  B: [{ lat: 3.18391, lng: 101.51945 }],
  C: [{ lat: 3.18713, lng: 101.51676 }],
};
const WALKING_ROUTE_CACHE = new Map();

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
  onRoadRoutes = null,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeRequestIdRef = useRef(0);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);
  const circlesRef = useRef([]);

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

  useEffect(() => {
    if ((loadState === 'no_key' || loadState === 'error') && fromPin && toPin) {
      onRoadRoutes?.(null, 1);
    }
  }, [loadState, fromPin, toPin, onRoadRoutes]);

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
    routeRequestIdRef.current += 1;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];
  };

  const drawWalkingRoutes = async (maps, map, startPin, endPin, onRoutes, useRouteCorridors = false) => {
    if (!startPin || !endPin) return;
    const requestId = routeRequestIdRef.current;
    try {
      const cacheKey = JSON.stringify([
        useRouteCorridors ? 'corridors' : 'direct',
        startPin.lat,
        startPin.lng,
        endPin.lat,
        endPin.lng,
      ]);
      let routePromise = WALKING_ROUTE_CACHE.get(cacheKey);
      if (!routePromise) {
        routePromise = (async () => {
          const { Route } = await maps.importLibrary('routes');
          if (useRouteCorridors) {
            const routeRequests = Object.entries(ROUTE_WAYPOINTS).map(async ([routeId, waypoints]) => {
              const { routes = [] } = await Route.computeRoutes({
                origin: { lat: startPin.lat, lng: startPin.lng },
                destination: { lat: endPin.lat, lng: endPin.lng },
                intermediates: waypoints.map(({ lat, lng }) => ({
                  location: { lat, lng },
                })),
                travelMode: 'WALKING',
                fields: ['path', 'distanceMeters', 'durationMillis'],
                computeAlternativeRoutes: false,
              });
              return routes
                .filter(route => route.path?.length > 1)
                .map(route => ({
                  path: route.path,
                  distanceMeters: route.distanceMeters,
                  durationMillis: route.durationMillis,
                  routeId,
                }));
            });
            const settled = await Promise.allSettled(routeRequests);
            const failedCount = settled.filter(result => result.status === 'rejected').length;
            const routes = settled.flatMap((result, index) => {
              if (result.status === 'fulfilled') return result.value;
              console.error(
                `[GoogleMapsTownshipView] Walking route ${['A', 'B', 'C'][index]} request failed.`,
                result.reason
              );
              return [];
            });
            return { routes, failedCount };
          }

          const { routes = [] } = await Route.computeRoutes({
            origin: { lat: startPin.lat, lng: startPin.lng },
            destination: { lat: endPin.lat, lng: endPin.lng },
            travelMode: 'WALKING',
            fields: ['path', 'distanceMeters', 'durationMillis'],
            computeAlternativeRoutes: true,
          });
          return { routes: routes.filter(route => route.path?.length > 1), failedCount: 0 };
        })();
        WALKING_ROUTE_CACHE.set(cacheKey, routePromise);
      }

      const { routes, failedCount } = await routePromise;
      if (requestId !== routeRequestIdRef.current || mapInstanceRef.current !== map) return;
      onRoutes(routes, failedCount);
    } catch (error) {
      if (requestId === routeRequestIdRef.current) {
        console.error('[GoogleMapsTownshipView] Walking route request failed.', error);
        onRoutes(null, 1);
      }
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

      if (fromPin && toPin) {
        const bounds = new maps.LatLngBounds();
        bounds.extend({ lat: fromPin.lat, lng: fromPin.lng });
        bounds.extend({ lat: toPin.lat, lng: toPin.lng });
        map.fitBounds(bounds, 40);
        drawWalkingRoutes(maps, map, fromPin, toPin, (routes, failedCount) => {
          if (onRoadRoutes) onRoadRoutes(routes, failedCount);
          routes?.slice(0, 3).forEach((route, index) => {
            const roadPolyline = new maps.Polyline({
              path: route.path,
              geodesic: true,
              strokeColor: index === 0 ? '#2864A6' : index === 1 ? '#f59e0b' : '#10b981',
              strokeOpacity: index === 0 ? 0.9 : 0.4,
              strokeWeight: index === 0 ? 5 : 3,
              map,
              zIndex: index === 0 ? 15 : 10 - index,
            });
            polylinesRef.current.push(roadPolyline);
          });
          if (!routes?.[0]?.path) return;
          const bounds = new maps.LatLngBounds();
          routes[0].path.forEach(point => bounds.extend(point));
          map.fitBounds(bounds, 40);
        });
      }
      return;
    }

    // ── Full mode: routes + nodes + hazards ───────────────────────────────────
    // 1. Draw Routes
    if (fromPin && toPin) {
      const bounds = new maps.LatLngBounds();
      bounds.extend({ lat: fromPin.lat, lng: fromPin.lng });
      bounds.extend({ lat: toPin.lat, lng: toPin.lng });
      const startMarker = new maps.Marker({
        position: { lat: fromPin.lat, lng: fromPin.lng },
        map,
        title: 'Start location',
        label: { text: 'S', color: '#ffffff', fontWeight: 'bold' },
        zIndex: 30,
      });
      const endMarker = new maps.Marker({
        position: { lat: toPin.lat, lng: toPin.lng },
        map,
        title: 'Destination',
        label: { text: 'D', color: '#ffffff', fontWeight: 'bold' },
        zIndex: 30,
      });
      markersRef.current.push(startMarker, endMarker);
      map.fitBounds(bounds, 40);

      drawWalkingRoutes(maps, map, fromPin, toPin, (routes, failedCount) => {
        if (onRoadRoutes) onRoadRoutes(routes, failedCount);
        routes?.forEach((route, index) => {
          const routeId = route.routeId || ['A', 'B', 'C'][index];
          const isRouteSelected = selectedRoute === routeId;
          const roadPolyline = new maps.Polyline({
            path: route.path,
            geodesic: true,
            strokeColor: routeId === 'A' ? '#10b981' : routeId === 'B' ? '#f59e0b' : '#2864a6',
            strokeOpacity: isRouteSelected ? 0.95 : 0.35,
            strokeWeight: isRouteSelected ? 6 : 3,
            map,
            zIndex: isRouteSelected ? 10 : 2,
          });
          polylinesRef.current.push(roadPolyline);
        });
      }, true);
    } else {
      ['A', 'B', 'C'].forEach(routeId => {
        const isRouteSelected = selectedRoute === routeId;
        const roadPolyline = new maps.Polyline({
          path: ROUTE_GPS_PATHS[routeId],
          geodesic: true,
          strokeColor: routeId === 'A' ? '#10b981' : routeId === 'B' ? '#f59e0b' : '#2864a6',
          strokeOpacity: isRouteSelected ? 0.95 : 0.35,
          strokeWeight: isRouteSelected ? 6 : 3,
          map,
          zIndex: isRouteSelected ? 10 : 2,
        });
        polylinesRef.current.push(roadPolyline);
      });
    }

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
  }, [loadState, theme, selectedRoute, activeLamps, currentCheckpointNode, hazards, onSelectHazard, fromPin, toPin, onRoadRoutes]);

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
          hideRoutes={Boolean(fromPin && toPin)}
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

    </div>
  );
}

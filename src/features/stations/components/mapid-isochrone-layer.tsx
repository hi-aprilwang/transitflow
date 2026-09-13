"use client";

import { useEffect, useCallback } from "react";
import type { Map as MapLibreMap, GeoJSONSource } from "maplibre-gl";
import { useStationUIStore } from "@/features/stations/store/station-ui-store";

interface MapidIsochroneLayerProps {
  map: MapLibreMap | null;
}

const SOURCE_ID = "mapid-isochrone-source";
const FILL_LAYER_ID = "mapid-isochrone-fill";
const LINE_LAYER_ID = "mapid-isochrone-line";

const ISOCHRONE_COLORS: Record<number, { fill: string; stroke: string }> = {
  5: { fill: "#10b981", stroke: "#059669" }, // Emerald 5-min walk
  10: { fill: "#3b82f6", stroke: "#2563eb" }, // Blue 10-min walk
  15: { fill: "#8b5cf6", stroke: "#7c3aed" }, // Violet 15-min walk
};

export function MapidIsochroneLayer({ map }: MapidIsochroneLayerProps) {
  const activeIsochroneGeoJSON = useStationUIStore(
    (s) => s.activeIsochroneGeoJSON,
  );
  const isochroneMinutes = useStationUIStore((s) => s.isochroneMinutes);

  const removeLayersAndSource = useCallback((m: MapLibreMap) => {
    try {
      if (m.getLayer(LINE_LAYER_ID)) m.removeLayer(LINE_LAYER_ID);
      if (m.getLayer(FILL_LAYER_ID)) m.removeLayer(FILL_LAYER_ID);
      if (m.getSource(SOURCE_ID)) m.removeSource(SOURCE_ID);
    } catch {
      // Ignore errors during layer cleanup
    }
  }, []);

  const syncIsochrone = useCallback(() => {
    if (!map || !map.isStyleLoaded()) return;

    if (!activeIsochroneGeoJSON) {
      removeLayersAndSource(map);
      return;
    }

    const minutes = isochroneMinutes || 10;
    const colors = ISOCHRONE_COLORS[minutes] || ISOCHRONE_COLORS[10];

    try {
      const existingSource = map.getSource(SOURCE_ID) as GeoJSONSource;
      if (existingSource) {
        existingSource.setData(activeIsochroneGeoJSON);
      } else {
        map.addSource(SOURCE_ID, {
          type: "geojson",
          data: activeIsochroneGeoJSON,
        });

        // Insert fill beneath symbols/labels if available
        map.addLayer({
          id: FILL_LAYER_ID,
          type: "fill",
          source: SOURCE_ID,
          paint: {
            "fill-color": colors.fill,
            "fill-opacity": 0.25,
          },
        });

        map.addLayer({
          id: LINE_LAYER_ID,
          type: "line",
          source: SOURCE_ID,
          paint: {
            "line-color": colors.stroke,
            "line-width": 2.5,
            "line-dasharray": [3, 2],
          },
        });
      }

      // Update colors if layer exists
      if (map.getLayer(FILL_LAYER_ID)) {
        map.setPaintProperty(FILL_LAYER_ID, "fill-color", colors.fill);
      }
      if (map.getLayer(LINE_LAYER_ID)) {
        map.setPaintProperty(LINE_LAYER_ID, "line-color", colors.stroke);
      }
    } catch (err) {
      console.warn("[MapidIsochroneLayer] Error syncing layer:", err);
    }
  }, [map, activeIsochroneGeoJSON, isochroneMinutes, removeLayersAndSource]);

  useEffect(() => {
    syncIsochrone();
  }, [syncIsochrone]);

  // Re-attach layer when basemap style changes
  useEffect(() => {
    if (!map) return;
    const handleStyleData = () => {
      syncIsochrone();
    };
    map.on("styledata", handleStyleData);
    return () => {
      map.off("styledata", handleStyleData);
    };
  }, [map, syncIsochrone]);

  return null;
}

import { env } from "@/lib/env";

export type MapidBasemapId =
  | "street-2d"
  | "street-3d"
  | "light"
  | "dark"
  | "satellite";

export interface MapidBasemapOption {
  id: MapidBasemapId;
  name: string;
  description: string;
  styleSlug: string;
}

export const MAPID_BASEMAP_OPTIONS: MapidBasemapOption[] = [
  {
    id: "street-2d",
    name: "MAPID Street 2D",
    description: "Official 2D building footprints & street network",
    styleSlug: "street-2d-building",
  },
  {
    id: "street-3d",
    name: "MAPID Street 3D",
    description: "3D building extrusions & urban topography",
    styleSlug: "basic",
  },
  {
    id: "dark",
    name: "MAPID Dark",
    description: "Night operations & high-contrast telemetry",
    styleSlug: "dark",
  },
  {
    id: "light",
    name: "MAPID Light",
    description: "Clean minimalist daytime cartography",
    styleSlug: "light",
  },
  {
    id: "satellite",
    name: "MAPID Satellite",
    description: "High-resolution satellite imagery",
    styleSlug: "satellite",
  },
];

export const MAPID_DEFAULT_KEY = "6a7d3894610fe054a12def2a";

export function getEffectiveMapidKey(): string {
  return env.NEXT_PUBLIC_MAPID_API_KEY || MAPID_DEFAULT_KEY;
}

/**
 * Returns the fully qualified MAPID vector style URL with authenticated API key
 */
export function getMapidBasemapUrl(
  styleId: MapidBasemapId,
  apiKey = getEffectiveMapidKey(),
): string {
  const option =
    MAPID_BASEMAP_OPTIONS.find((b) => b.id === styleId) ||
    MAPID_BASEMAP_OPTIONS[0];
  return `https://basemap.mapid.io/styles/${option.styleSlug}/style.json?key=${apiKey}`;
}

export interface MapidIsochroneRequest {
  lat: number;
  lng: number;
  timeLimitSeconds?: number;
  distanceLimitMeters?: number;
  profile?: "foot" | "car" | "truck" | "motorcycle";
}

export interface MapidIsochroneResponse {
  polygons?: GeoJSON.Feature<GeoJSON.Polygon>[];
  message?: string;
}

/**
 * Fetches real-time pedestrian or vehicular isochrone reachability polygon from MAPID
 */
export async function fetchMapidIsochrone(
  req: MapidIsochroneRequest,
  apiKey = getEffectiveMapidKey(),
): Promise<GeoJSON.Feature<GeoJSON.Polygon> | null> {
  const profile = req.profile || "foot";
  const params = new URLSearchParams({
    key: apiKey,
    point: `${req.lat},${req.lng}`,
    profile,
  });

  if (req.timeLimitSeconds) {
    params.set("time_limit", String(req.timeLimitSeconds));
  }
  if (req.distanceLimitMeters) {
    params.set("distance_limit", String(req.distanceLimitMeters));
  }

  const url = `https://routing.mapid.io/isochrone?${params.toString()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`[MAPID Isochrone] HTTP ${res.status}: ${res.statusText}`);
      return null;
    }

    const data = (await res.json()) as MapidIsochroneResponse;
    if (data.polygons && data.polygons.length > 0) {
      const feat = data.polygons[0];
      return {
        type: "Feature",
        geometry: feat.geometry,
        properties: {
          ...feat.properties,
          profile,
          timeLimitSeconds: req.timeLimitSeconds,
          provider: "MAPID Routing Engine",
        },
      };
    }
    return null;
  } catch (err) {
    console.error("[MAPID Isochrone] Network error:", err);
    return null;
  }
}

/**
 * Decodes Google Encoded Polyline format (precision 5) into GeoJSON [lng, lat] coordinate pairs
 */
export function decodeMapidPolyline(
  str: string,
  precision = 5,
): [number, number][] {
  let index = 0;
  let lat = 0;
  let lng = 0;
  const coordinates: [number, number][] = [];
  const factor = Math.pow(10, precision);

  while (index < str.length) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push([lng / factor, lat / factor]);
  }
  return coordinates;
}

export interface MapidRouteRequest {
  start: [number, number]; // [lng, lat]
  end: [number, number]; // [lng, lat]
  profile?: "foot" | "car" | "truck" | "motorcycle";
}

export interface MapidRouteResult {
  distanceMeters: number;
  durationSeconds: number;
  coordinates: [number, number][]; // [[lng, lat], ...]
  bbox?: [number, number, number, number];
}

/**
 * Computes pedestrian or multimodal street-network route via MAPID routing engine
 */
export async function fetchMapidRoute(
  req: MapidRouteRequest,
  apiKey = getEffectiveMapidKey(),
): Promise<MapidRouteResult | null> {
  const profile = req.profile || "foot";
  const url = `https://routing.mapid.io/?key=${apiKey}`;

  const body = {
    points: [req.start, req.end],
    profile,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`[MAPID Routing] HTTP ${res.status}: ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    if (data.paths && data.paths.length > 0) {
      const path = data.paths[0];
      const coordinates = decodeMapidPolyline(path.points);
      return {
        distanceMeters: Math.round(path.distance || 0),
        durationSeconds: Math.round((path.time || 0) / 1000),
        coordinates,
        bbox: path.bbox,
      };
    }
    return null;
  } catch (err) {
    console.error("[MAPID Routing] Network error:", err);
    return null;
  }
}

export interface MapidLocationResult {
  displayName: string;
  shortName: string;
  lat: number;
  lng: number;
  type: string;
}

/**
 * Forward geocoding query using MAPID's Nominatim server
 */
export async function searchMapidLocation(
  query: string,
  apiKey = getEffectiveMapidKey(),
): Promise<MapidLocationResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const params = new URLSearchParams({
    q: trimmed,
    format: "json",
    countrycodes: "id",
    key: apiKey,
    limit: "5",
  });

  const url = `https://nominatim.mapid.io/search?${params.toString()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return [];
    const data = await res.json();

    if (!Array.isArray(data)) return [];

    interface NominatimItem {
      display_name?: string;
      lat: string;
      lon: string;
      type?: string;
    }

    return (data as NominatimItem[]).map((item) => {
      const parts = (item.display_name || "").split(",");
      const shortName = parts[0]?.trim() || item.display_name || "Location";
      return {
        displayName: item.display_name || "Unknown location",
        shortName,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type || "place",
      };
    });
  } catch (err) {
    console.warn("[MAPID Geocoding] Search failed:", err);
    return [];
  }
}

/**
 * Calculates geodesic area of a polygon in hectares
 */
export function calculatePolygonAreaHectares(polygon: GeoJSON.Polygon): number {
  const ring = polygon.coordinates[0];
  if (!ring || ring.length < 4) return 0;

  const R = 6378137; // Earth radius in meters
  let area = 0;

  for (let i = 0; i < ring.length - 1; i++) {
    const [p1Lng, p1Lat] = ring[i];
    const [p2Lng, p2Lat] = ring[i + 1];
    const radP1Lat = (p1Lat * Math.PI) / 180;
    const radP2Lat = (p2Lat * Math.PI) / 180;
    const radP1Lng = (p1Lng * Math.PI) / 180;
    const radP2Lng = (p2Lng * Math.PI) / 180;

    area += (radP2Lng - radP1Lng) * (2 + Math.sin(radP1Lat) + Math.sin(radP2Lat));
  }

  area = Math.abs((area * R * R) / 2.0);
  // Convert square meters to hectares (1 hectare = 10,000 m²)
  return Math.round((area / 10000) * 10) / 10;
}

/**
 * Estimates pedestrian population in catchment area (Jakarta avg ~145 people/hectare)
 */
export function estimateCatchmentPopulation(
  areaHectares: number,
  densityPerHectare = 145,
): number {
  return Math.round(areaHectares * densityPerHectare);
}

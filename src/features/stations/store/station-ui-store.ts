import { create } from "zustand";
import type { MapidBasemapId } from "@/lib/mapid/mapid-service";

export interface LayerToggles {
  crowdDensity: boolean;
  exitGates: boolean;
  temporaryBufferZone: boolean;
  aiRecommendations: boolean;
  vciHeatmap: boolean;
  rainMode: boolean;
  forecast: boolean;
  mapidIsochrone: boolean;
}

export interface FlyToTarget {
  lng: number;
  lat: number;
  stationId: string;
}

export const DEFAULT_LAYERS: LayerToggles = {
  crowdDensity: true,
  exitGates: true,
  temporaryBufferZone: false,
  aiRecommendations: false,
  vciHeatmap: false,
  rainMode: false,
  forecast: false,
  mapidIsochrone: false,
};

export interface StationUIState {
  searchQuery: string;
  selectedStationId: string | null;
  flyToTarget: FlyToTarget | null;
  layers: LayerToggles;
  is3DMode: boolean;
  mapidBasemap: MapidBasemapId;
  isochroneMinutes: 5 | 10 | 15 | null;
  activeIsochroneGeoJSON: GeoJSON.Feature<GeoJSON.Polygon> | null;
  setSearchQuery: (q: string) => void;
  selectStation: (id: string | null) => void;
  flyToStation: (target: FlyToTarget) => void;
  clearFlyTo: () => void;
  toggleLayer: (layer: keyof LayerToggles) => void;
  toggle3DMode: () => void;
  setLayers: (layers: Partial<LayerToggles>) => void;
  set3DMode: (is3D: boolean) => void;
  setMapidBasemap: (style: MapidBasemapId) => void;
  setIsochrone: (
    minutes: 5 | 10 | 15 | null,
    geojson: GeoJSON.Feature<GeoJSON.Polygon> | null,
  ) => void;
  clearIsochrone: () => void;
  resetLayers: () => void;
}

export const useStationUIStore = create<StationUIState>((set) => ({
  searchQuery: "",
  selectedStationId: null,
  flyToTarget: null,
  layers: { ...DEFAULT_LAYERS },
  is3DMode: false,
  mapidBasemap: "street-2d",
  isochroneMinutes: null,
  activeIsochroneGeoJSON: null,
  setSearchQuery: (q) => set({ searchQuery: q }),
  selectStation: (id) => set({ selectedStationId: id }),
  flyToStation: (target) =>
    set({ flyToTarget: target, selectedStationId: target.stationId }),
  clearFlyTo: () => set({ flyToTarget: null }),
  toggleLayer: (layer) =>
    set((state) => ({
      layers: { ...state.layers, [layer]: !state.layers[layer] },
    })),
  toggle3DMode: () => set((state) => ({ is3DMode: !state.is3DMode })),
  setLayers: (updated) =>
    set((state) => ({ layers: { ...state.layers, ...updated } })),
  set3DMode: (is3D) => set({ is3DMode: is3D }),
  setMapidBasemap: (style) => set({ mapidBasemap: style }),
  setIsochrone: (minutes, geojson) =>
    set({
      isochroneMinutes: minutes,
      activeIsochroneGeoJSON: geojson,
      layers: {
        ...useStationUIStore.getState().layers,
        mapidIsochrone: geojson != null,
      },
    }),
  clearIsochrone: () =>
    set({
      isochroneMinutes: null,
      activeIsochroneGeoJSON: null,
      layers: {
        ...useStationUIStore.getState().layers,
        mapidIsochrone: false,
      },
    }),
  resetLayers: () =>
    set({
      layers: { ...DEFAULT_LAYERS },
      is3DMode: false,
      selectedStationId: null,
      mapidBasemap: "street-2d",
      isochroneMinutes: null,
      activeIsochroneGeoJSON: null,
    }),
}));

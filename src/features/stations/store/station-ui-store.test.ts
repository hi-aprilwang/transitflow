import { describe, it, expect, beforeEach } from "vitest";
import { useStationUIStore, DEFAULT_LAYERS } from "./station-ui-store";

describe("useStationUIStore", () => {
  beforeEach(() => {
    useStationUIStore.getState().resetLayers();
  });

  it("initializes with default layers and 2D mode", () => {
    const state = useStationUIStore.getState();
    expect(state.is3DMode).toBe(false);
    expect(state.layers.crowdDensity).toBe(true);
    expect(state.layers.vciHeatmap).toBe(false);
    expect(state.layers.rainMode).toBe(false);
  });

  it("updates layers in bulk via setLayers", () => {
    useStationUIStore.getState().setLayers({
      vciHeatmap: true,
      rainMode: true,
      temporaryBufferZone: true,
    });

    const state = useStationUIStore.getState();
    expect(state.layers.vciHeatmap).toBe(true);
    expect(state.layers.rainMode).toBe(true);
    expect(state.layers.temporaryBufferZone).toBe(true);
    expect(state.layers.crowdDensity).toBe(true); // preserved
  });

  it("sets 3D mode directly", () => {
    useStationUIStore.getState().set3DMode(true);
    expect(useStationUIStore.getState().is3DMode).toBe(true);

    useStationUIStore.getState().set3DMode(false);
    expect(useStationUIStore.getState().is3DMode).toBe(false);
  });

  it("resets all layers and 3D mode back to baseline", () => {
    useStationUIStore.getState().set3DMode(true);
    useStationUIStore.getState().setLayers({
      vciHeatmap: true,
      rainMode: true,
    });
    useStationUIStore.getState().selectStation("ST-DUK");

    useStationUIStore.getState().resetLayers();

    const state = useStationUIStore.getState();
    expect(state.is3DMode).toBe(false);
    expect(state.selectedStationId).toBeNull();
    expect(state.layers).toEqual(DEFAULT_LAYERS);
    expect(state.mapidBasemap).toBe("street-2d");
    expect(state.isochroneMinutes).toBeNull();
    expect(state.activeIsochroneGeoJSON).toBeNull();
  });

  it("updates MAPID basemap selection", () => {
    useStationUIStore.getState().setMapidBasemap("dark");
    expect(useStationUIStore.getState().mapidBasemap).toBe("dark");

    useStationUIStore.getState().setMapidBasemap("satellite");
    expect(useStationUIStore.getState().mapidBasemap).toBe("satellite");
  });

  it("sets and clears MAPID isochrone state", () => {
    const mockPolygon: GeoJSON.Feature<GeoJSON.Polygon> = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [106.82, -6.2],
            [106.83, -6.2],
            [106.83, -6.21],
            [106.82, -6.21],
            [106.82, -6.2],
          ],
        ],
      },
      properties: { profile: "foot" },
    };

    useStationUIStore.getState().setIsochrone(10, mockPolygon);
    let state = useStationUIStore.getState();
    expect(state.isochroneMinutes).toBe(10);
    expect(state.activeIsochroneGeoJSON).toEqual(mockPolygon);
    expect(state.layers.mapidIsochrone).toBe(true);

    useStationUIStore.getState().clearIsochrone();
    state = useStationUIStore.getState();
    expect(state.isochroneMinutes).toBeNull();
    expect(state.activeIsochroneGeoJSON).toBeNull();
    expect(state.layers.mapidIsochrone).toBe(false);
  });
});

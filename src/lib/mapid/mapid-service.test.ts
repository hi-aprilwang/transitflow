import { describe, it, expect } from "vitest";
import {
  getMapidBasemapUrl,
  MAPID_BASEMAP_OPTIONS,
  decodeMapidPolyline,
  calculatePolygonAreaHectares,
  estimateCatchmentPopulation,
} from "./mapid-service";

describe("MAPID Service", () => {
  it("generates correct MAPID basemap URLs for all styles with API key", () => {
    for (const opt of MAPID_BASEMAP_OPTIONS) {
      const url = getMapidBasemapUrl(opt.id, "test-key-123");
      expect(url).toBe(
        `https://basemap.mapid.io/styles/${opt.styleSlug}/style.json?key=test-key-123`,
      );
    }
  });

  it("decodes encoded polyline correctly", () => {
    // Encoded polyline for two points: (38.5, -120.2) and (40.7, -120.95)
    // Standard Google polyline string: "_p~iF~ps|U_ulLnnqC"
    const encoded = "_p~iF~ps|U_ulLnnqC";
    const coords = decodeMapidPolyline(encoded);
    expect(coords).toHaveLength(2);
    expect(coords[0][0]).toBeCloseTo(-120.2, 3);
    expect(coords[0][1]).toBeCloseTo(38.5, 3);
    expect(coords[1][0]).toBeCloseTo(-120.95, 3);
    expect(coords[1][1]).toBeCloseTo(40.7, 3);
  });

  it("calculates polygon area in hectares accurately", () => {
    // 0.01 deg x 0.01 deg near equator is approx ~1.11 km x ~1.11 km = ~123 hectares
    const polygon: GeoJSON.Polygon = {
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
    };
    const hectares = calculatePolygonAreaHectares(polygon);
    expect(hectares).toBeGreaterThan(100);
    expect(hectares).toBeLessThan(150);
  });

  it("estimates catchment population based on area", () => {
    const pop = estimateCatchmentPopulation(100, 145);
    expect(pop).toBe(14500);
  });
});

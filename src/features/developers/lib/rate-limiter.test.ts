import { describe, it, expect } from "vitest";
import { createBucket, tryConsume, retryAfterSec } from "./rate-limiter";
import { API_ENDPOINTS, SIGNALS, latencySeries, uptimeSeries, exitStatusGeoJson } from "../fixtures/dev-fixtures";

const NOW = 1_750_000_000_000;

describe("rate-limiter", () => {
  it("allows requests up to capacity", () => {
    const bucket = createBucket(3, 10);
    expect(tryConsume(bucket, NOW)).toBe(true);
    expect(tryConsume(bucket, NOW)).toBe(true);
    expect(tryConsume(bucket, NOW)).toBe(true);
    expect(tryConsume(bucket, NOW)).toBe(false);
  });

  it("refills tokens over time", () => {
    const bucket = createBucket(1, 1); // 1 token/sec
    expect(tryConsume(bucket, NOW)).toBe(true);
    expect(tryConsume(bucket, NOW + 500)).toBe(false);
    expect(tryConsume(bucket, NOW + 1_000)).toBe(true);
  });

  it("reports retry-after seconds", () => {
    const bucket = createBucket(1, 1);
    tryConsume(bucket, NOW);
    expect(retryAfterSec(bucket, NOW)).toBeGreaterThanOrEqual(1);
  });
});

describe("dev fixtures", () => {
  it("exposes gateway and MAPID platform endpoints", () => {
    expect(API_ENDPOINTS).toHaveLength(8);
    expect(API_ENDPOINTS[1].path).toContain("exit-status");
    expect(API_ENDPOINTS.some((e) => e.id === "mapid-isochrone")).toBe(true);
    expect(API_ENDPOINTS.some((e) => e.id === "mapid-basemap")).toBe(true);
  });

  it("builds exit-status GeoJSON", () => {
    const geojson = exitStatusGeoJson("SUD-E");
    expect(geojson.type).toBe("FeatureCollection");
    expect(geojson.features[0].properties.channel_id).toBe("SUD-E");
  });

  it("seeds 6 signals and triggers at threshold", () => {
    expect(SIGNALS).toHaveLength(6);
    expect(SIGNALS.some((s) => s.vciScore >= 85)).toBe(true);
  });

  it("latency series stays under 60ms", () => {
    const series = latencySeries(60);
    expect(series).toHaveLength(60);
    expect(Math.max(...series)).toBeLessThan(60);
  });

  it("uptime series stays near 99.99%", () => {
    const series = uptimeSeries(60);
    expect(series).toHaveLength(60);
    expect(series.every((v) => v >= 99.9)).toBe(true);
  });
});

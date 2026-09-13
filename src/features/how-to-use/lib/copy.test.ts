import { describe, it, expect } from "vitest";
import { COPY, type FeatureId, type Locale } from "./copy";

const EXPECTED_FEATURE_IDS: FeatureId[] = [
  "dashboard",
  "commandCenter",
  "cctv",
  "kiosks",
  "survey",
  "aiIngestion",
  "portal",
  "national",
  "developers",
  "basemaps",
  "catchments",
  "routing",
  "search",
  "tour",
];

const LOCALES: Locale[] = ["en", "id"];

describe("How to Use Copy Data Integrity", () => {
  it.each(LOCALES)("provides complete content for %s locale", (locale) => {
    const data = COPY[locale];
    expect(data).toBeDefined();
    expect(data.title.trim().length).toBeGreaterThan(0);
    expect(data.subtitle.trim().length).toBeGreaterThan(0);
    expect(data.cta.trim().length).toBeGreaterThan(0);
    expect(data.languageLabel.trim().length).toBeGreaterThan(0);
    expect(data.benefitsHeading.trim().length).toBeGreaterThan(0);
    expect(data.stepsHeading.trim().length).toBeGreaterThan(0);
    expect(data.openLabel.trim().length).toBeGreaterThan(0);
    expect(data.groups.length).toBeGreaterThan(0);
  });

  it.each(LOCALES)("contains all 14 expected features for %s locale", (locale) => {
    const data = COPY[locale];
    const foundFeatureIds = data.groups.flatMap((g) => g.features.map((f) => f.id));
    expect(foundFeatureIds.sort()).toEqual([...EXPECTED_FEATURE_IDS].sort());
  });

  it.each(LOCALES)("ensures every feature has benefits and step-by-step instructions in %s", (locale) => {
    const data = COPY[locale];
    for (const group of data.groups) {
      expect(group.role.trim().length).toBeGreaterThan(0);
      expect(group.blurb.trim().length).toBeGreaterThan(0);
      for (const feature of group.features) {
        expect(feature.name.trim().length).toBeGreaterThan(0);
        expect(feature.summary.trim().length).toBeGreaterThan(0);
        expect(feature.benefits.length).toBeGreaterThanOrEqual(1);
        for (const benefit of feature.benefits) {
          expect(benefit.trim().length).toBeGreaterThan(0);
        }
        expect(feature.steps.length).toBeGreaterThanOrEqual(1);
        for (const step of feature.steps) {
          expect(step.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });
});

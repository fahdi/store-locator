import { getDistanceKm, isWithinRadius, filterWithinRadius } from "./spatial-utils";

describe("spatial-utils", () => {
  const center = { lat: 25.2854, lon: 51.5310 }; // Doha Corniche

  test("getDistanceKm between nearby points", () => {
    const point = { lat: 25.2859, lon: 51.5315 };
    const d = getDistanceKm(center, point);
    expect(d).toBeGreaterThan(0);
    expect(d).toBeLessThan(0.2); // ~100–200 meters
  });

  test("isWithinRadius correctly detects proximity", () => {
    const near = { lat: 25.286, lon: 51.532 };
    const far = { lat: 25.3, lon: 51.55 };
    expect(isWithinRadius(near, center, 500)).toBe(true);
    expect(isWithinRadius(far, center, 500)).toBe(false);
  });

  test("filterWithinRadius filters store data correctly", () => {
    const stores = [
      { id: 1, name: "A", latitude: 25.285, longitude: 51.531 },
      { id: 2, name: "B", latitude: 25.295, longitude: 51.540 },
      { id: 3, name: "C", latitude: 25.400, longitude: 51.600 },
    ];

    const nearby = filterWithinRadius(stores, center, 2000);
    expect(nearby.map((s) => s.id)).toContain(1);
    expect(nearby.map((s) => s.id)).toContain(2);
    expect(nearby.map((s) => s.id)).not.toContain(3);
  });
});

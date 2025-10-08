/**
 * src/utils/spatial-utils.ts
 * Geospatial helper functions for Doha City dataset.
 */

export interface Coordinate {
  lat: number;
  lon: number;
}

/**
 * Calculate Haversine distance between two coordinates (in kilometers).
 */
export function getDistanceKm(a: Coordinate, b: Coordinate): number {
  const R = 6371; // Earth radius (km)
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Return whether a coordinate is inside a circular radius (in meters)
 */
export function isWithinRadius(
  point: Coordinate,
  center: Coordinate,
  radiusMeters: number
): boolean {
  const distance = getDistanceKm(point, center) * 1000;
  return distance <= radiusMeters;
}

/**
 * Return all coordinates within a radius from the center
 */
export function filterWithinRadius<T extends { latitude: number; longitude: number }>(
  items: T[],
  center: Coordinate,
  radiusMeters: number
): T[] {
  return items.filter((item) =>
    isWithinRadius({ lat: item.latitude, lon: item.longitude }, center, radiusMeters)
  );
}

/**
 * Convert degrees to radians
 */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

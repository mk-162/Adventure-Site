import { describe, it, expect } from "vitest";
import {
  calculateDistance,
  calculateDrivingTime,
  formatDistance,
} from "../travel-utils";

describe("calculateDistance", () => {
  it("returns 0 for the same point", () => {
    expect(calculateDistance(51.5, -0.1, 51.5, -0.1)).toBe(0);
  });

  it("computes a reasonable distance between Cardiff and Swansea", () => {
    // Cardiff: 51.4816, -3.1791; Swansea: 51.6214, -3.9436
    const km = calculateDistance(51.4816, -3.1791, 51.6214, -3.9436);
    expect(km).toBeGreaterThan(50);
    expect(km).toBeLessThan(70);
  });
});

describe("calculateDrivingTime", () => {
  it("formats sub-hour durations in minutes", () => {
    expect(calculateDrivingTime(10)).toMatch(/^~\d+ min$/);
  });

  it("formats multi-hour durations with hours and minutes", () => {
    const result = calculateDrivingTime(200);
    expect(result).toMatch(/^~\d+h( \d+min)?$/);
  });
});

describe("formatDistance", () => {
  it("renders sub-kilometre distances in metres", () => {
    expect(formatDistance(0.5)).toBe("500m");
  });

  it("renders kilometre distances with one decimal", () => {
    expect(formatDistance(12.345)).toBe("12.3km");
  });
});

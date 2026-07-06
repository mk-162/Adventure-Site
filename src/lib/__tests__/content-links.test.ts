import { describe, expect, it } from "vitest";
import { normalizeContentHref, renderContentLink } from "../content-links";

describe("normalizeContentHref", () => {
  it("leaves external links and anchors untouched", () => {
    expect(normalizeContentHref("https://example.com")).toBe("https://example.com");
    expect(normalizeContentHref("mailto:hi@example.com")).toBe("mailto:hi@example.com");
    expect(normalizeContentHref("#faq")).toBe("#faq");
  });

  it("maps legacy /activity/{slug} to hub pages", () => {
    expect(normalizeContentHref("/activity/coasteering")).toBe("/coasteering");
    expect(normalizeContentHref("/activity/unknown-thing")).toBe("/activities");
  });

  it("maps legacy /operators to the directory", () => {
    expect(normalizeContentHref("/operators")).toBe("/directory");
  });

  it("rewrites legacy things-to-do URLs within the launch scope", () => {
    expect(normalizeContentHref("/anglesey/things-to-do")).toBe("/anglesey");
    expect(normalizeContentHref("/anglesey/things-to-do/kayaking")).toBe("/anglesey/kayaking");
    expect(normalizeContentHref("/snowdonia/things-to-do/zip-lining")).toBe("/snowdonia");
  });

  it("drops links to unlaunched regions", () => {
    expect(normalizeContentHref("/carmarthenshire")).toBeNull();
    expect(normalizeContentHref("/north-wales/hiking")).toBeNull();
    expect(normalizeContentHref("/wye-valley")).toBeNull();
    expect(normalizeContentHref("/general")).toBeNull();
  });

  it("downgrades unlaunched combos to the region page", () => {
    expect(normalizeContentHref("/snowdonia/zip-lining")).toBe("/snowdonia");
    expect(normalizeContentHref("/gower/climbing")).toBe("/gower");
  });

  it("keeps launched combos and region subpages", () => {
    expect(normalizeContentHref("/snowdonia/hiking")).toBe("/snowdonia/hiking");
    expect(normalizeContentHref("/gower/surfing")).toBe("/gower/surfing");
    expect(normalizeContentHref("/snowdonia/stay")).toBe("/snowdonia/stay");
  });

  it("passes through non-region internal routes", () => {
    expect(normalizeContentHref("/answers/some-answer")).toBe("/answers/some-answer");
    expect(normalizeContentHref("/guides/hiking-gear")).toBe("/guides/hiking-gear");
    expect(normalizeContentHref("/directory/zip-world")).toBe("/directory/zip-world");
  });

  it("preserves query strings and fragments on kept links", () => {
    expect(normalizeContentHref("/snowdonia/hiking#routes")).toBe("/snowdonia/hiking#routes");
  });
});

describe("renderContentLink", () => {
  it("renders an anchor for valid targets", () => {
    expect(renderContentLink("Hiking", "/snowdonia/hiking", "c")).toBe(
      '<a href="/snowdonia/hiking" class="c">Hiking</a>'
    );
  });

  it("falls back to plain text for dead targets", () => {
    expect(renderContentLink("Carmarthenshire", "/carmarthenshire", "c")).toBe("Carmarthenshire");
  });
});

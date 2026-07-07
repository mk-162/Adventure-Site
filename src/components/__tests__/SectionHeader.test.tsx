import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { SectionHeader } from "@/components/ui/section-header";

describe("SectionHeader", () => {
  it("renders the title inside an h2", () => {
    const html = renderToString(<SectionHeader title="Top Adventures" />);
    expect(html).toContain("<h2");
    expect(html).toContain("Top Adventures");
    expect(html).toContain("text-primary");
  });

  it("renders the eyebrow with the accent-strong tracked style", () => {
    const html = renderToString(
      <SectionHeader eyebrow="Explore" title="Regions" />
    );
    expect(html).toContain("Explore");
    expect(html).toContain("text-accent-strong");
    expect(html).toContain("uppercase");
  });

  it("renders an action link when provided", () => {
    const html = renderToString(
      <SectionHeader
        title="Operators"
        action={{ label: "View all", href: "/operators" }}
      />
    );
    expect(html).toContain("View all");
    expect(html).toContain('href="/operators"');
  });

  it("omits the subtitle when not provided", () => {
    const html = renderToString(<SectionHeader title="Bare" />);
    expect(html).not.toContain("max-w-2xl");
  });
});

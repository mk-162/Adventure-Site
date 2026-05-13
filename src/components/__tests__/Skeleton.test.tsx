import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { Skeleton, SkeletonList } from "@/components/ui/Skeleton";

describe("Skeleton", () => {
  it("renders a div with the base animate-pulse class", () => {
    const html = renderToString(<Skeleton />);
    expect(html).toContain("animate-pulse");
    expect(html).toContain("rounded-md");
    expect(html.startsWith("<div")).toBe(true);
  });

  it("merges a custom className with the defaults", () => {
    const html = renderToString(<Skeleton className="h-10 w-10" />);
    expect(html).toContain("animate-pulse");
    expect(html).toContain("h-10");
    expect(html).toContain("w-10");
  });
});

describe("SkeletonList", () => {
  it("renders the requested number of skeleton rows", () => {
    const html = renderToString(<SkeletonList count={5} />);
    // Each row gets its own animate-pulse div.
    const matches = html.match(/animate-pulse/g) ?? [];
    expect(matches.length).toBe(5);
  });

  it("defaults to 3 rows when count is omitted", () => {
    const html = renderToString(<SkeletonList />);
    const matches = html.match(/animate-pulse/g) ?? [];
    expect(matches.length).toBe(3);
  });
});

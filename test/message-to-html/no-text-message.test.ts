import { messageToHtml } from "$dist";
import { describe, it, expect } from "vitest";

describe("no text", () => {
  it("should process message with no text", () => {
    const html = messageToHtml({});

    expect(html).toBe("");
  });
});

import { messageToHtml } from "telegram-html";
import { describe, it, expect, vi } from "vitest";

vi.setConfig({ testTimeout: 500 });

describe("no text", () => {
  it("should process message with no text", () => {
    const html = messageToHtml({});

    expect(html).toBe("");
  });
});

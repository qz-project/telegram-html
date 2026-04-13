import { messageToHtml } from "telegram-html";
import { describe, it, expect, vi } from "vitest";

vi.setConfig({ testTimeout: 500 });

describe("should escape special characters", () => {
  it("with entity", () => {
    const html = messageToHtml({
      entities: [
        {
          length: 1,
          offset: 0,
          type: "bold",
        },
        {
          length: 1,
          offset: 1,
          type: "italic",
        },
        {
          length: 1,
          offset: 2,
          type: "underline",
        },
        {
          length: 1,
          offset: 3,
          type: "code",
        },
        {
          length: 1,
          offset: 4,
          type: "spoiler",
        },
      ],
      text: `<>&"'`,
    });

    expect(html).toBe(
      `<b class="tg-bold">&#x3C;</b><i class="tg-italic">></i><span class="tg-underline">&#x26;</span><code class="tg-code">"</code><span class="tg-spoiler">'</span>`,
    );
  });

  it("without entity", () => {
    const html = messageToHtml({ text: `<>&"'` });

    expect(html).toBe(`&#x3C;>&#x26;"'`);
  });
});

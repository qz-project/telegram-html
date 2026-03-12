import { messageToHtml } from "telegram-html";
import { describe, it, expect } from "vitest";

describe("multiple entities", () => {
  it("should parse multiple entities in single text", () => {
    const html = messageToHtml({
      entities: [
        {
          length: 4,
          offset: 8,
          type: "bold",
        },
        {
          length: 6,
          offset: 13,
          type: "italic",
        },
        {
          length: 13,
          offset: 20,
          type: "strikethrough",
        },
        {
          length: 9,
          offset: 34,
          type: "code",
        },
      ],
      text: "This is bold italic strikethrough monospace",
    });

    expect(html).toBe(
      'This is <b class="tg-bold">bold</b> <i class="tg-italic">italic</i> <del class="tg-strikethrough">strikethrough</del> <code class="tg-code">monospace</code>',
    );
  });
});

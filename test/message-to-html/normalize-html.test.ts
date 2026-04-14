import { messageToHtml } from "$dist";
import { describe, it, expect } from "vitest";

describe("should normalize html", () => {
  it("invalid HTML nesting", () => {
    const html = messageToHtml({
      entities: [
        {
          length: 10,
          offset: 0,
          type: "bold",
        },
        {
          length: 10,
          offset: 3,
          type: "italic",
        },
      ],
      text: `Hello, world!`,
    });

    expect(html).toBe(
      '<b class="tg-bold">Hel<i class="tg-italic">lo, wor</i></b><i class="tg-italic">ld!</i>',
    );
  });
});

import { messageToHtml } from "telegram-html";
import { describe, it, expect } from "vitest";

describe("option", () => {
  it("classPrefix", () => {
    const html = messageToHtml(
      {
        entities: [{ length: 9, offset: 8, type: "bold" }],
        text: "This is bold text",
      },
      { classPrefix: "custom-" },
    );

    expect(html).toBe('This is <b class="custom-bold">bold text</b>');
  });

  it("withClass: false", () => {
    const html = messageToHtml(
      {
        entities: [
          { length: 4, offset: 8, type: "bold" },
          { length: 7, offset: 14, type: "spoiler" },
          {
            custom_emoji_id: "1048596",
            length: 2,
            offset: 37,
            type: "custom_emoji",
          },
        ],
        text: "This is bold, spoiler, and delicious 🎂",
      },
      { withClass: false },
    );

    expect(html).toBe(
      'This is <b>bold</b>, spoiler, and delicious <span data-emoji-id="1048596">🎂</span>',
    );
  });

  it("preserveEntityData: true", () => {
    const html = messageToHtml(
      {
        entities: [
          { length: 4, offset: 8, type: "bold" },
          { length: 7, offset: 14, type: "spoiler" },
          {
            custom_emoji_id: "1048596",
            length: 2,
            offset: 37,
            type: "custom_emoji",
          },
        ],
        text: "This is bold, spoiler, and delicious 🎂",
      },
      { preserveEntityData: true },
    );

    expect(html).toBe(
      'This is <b class="tg-bold">bold</b>, <span class="tg-spoiler">spoiler</span>, and delicious <span class="tg-custom-emoji" data-emoji-id="1048596">🎂</span>',
    );
  });
});

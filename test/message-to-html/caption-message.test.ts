import type { Message } from "telegram-html";
import { messageToHtml } from "telegram-html";
import { describe, it, expect, vi } from "vitest";

vi.setConfig({ testTimeout: 500 });

const message: Message = {
  caption: "This is caption bold italic spoiler",
  caption_entities: [
    {
      length: 4,
      offset: 16,
      type: "bold",
    },
    {
      length: 6,
      offset: 21,
      type: "italic",
    },
    {
      length: 7,
      offset: 28,
      type: "spoiler",
    },
  ],
  chat: {
    first_name: "Qz",
    id: 423_623_658,
    type: "private",
    username: "quadratz",
  },
  date: 1_726_135_217,
  from: {
    first_name: "Qz",
    id: 423_623_658,
    is_bot: false,
    language_code: "en",
    username: "quadratz",
  },
  message_id: 1_780_179,
  photo: [
    {
      file_id:
        "AgACAgUAAxkBAAEbKdNm4ruxAw6vn68lbhZKr0T49xWzxgACd8UxG5vUEFeGdxW4pkSkIAEAAwIAA20AAzYE",
      file_size: 321,
      file_unique_id: "AQADd8UxG5vUEFdy",
      height: 71,
      width: 80,
    },
  ],
};

const expectation =
  'This is caption <b class="tg-bold">bold</b> <i class="tg-italic">italic</i> <span class="tg-spoiler">spoiler</span>';

describe("caption message", () => {
  it("should parse caption entities", () => {
    const html = messageToHtml(message);

    expect(html).toBe(expectation);
  });
});

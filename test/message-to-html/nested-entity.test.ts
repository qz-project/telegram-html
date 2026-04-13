import { messageToHtml } from "telegram-html";
import { describe, it, expect, vi } from "vitest";

vi.setConfig({ testTimeout: 500 });

describe("should parse nested entity", () => {
  it("#1", () => {
    const html = messageToHtml({
      entities: [
        {
          length: 2,
          offset: 10,
          type: "bold",
        },
        {
          length: 8,
          offset: 12,
          type: "bold",
        },
        {
          length: 8,
          offset: 12,
          type: "italic",
        },
        {
          length: 10,
          offset: 20,
          type: "italic",
        },
        {
          length: 9,
          offset: 20,
          type: "bold",
        },
        {
          length: 4,
          offset: 20,
          type: "underline",
        },
        {
          length: 8,
          offset: 30,
          type: "spoiler",
        },
        {
          length: 7,
          offset: 30,
          type: "italic",
        },
      ],
      text: "Nobody is coming to save you. Get up. Be your own hero.",
    });

    expect(html).toBe(
      'Nobody is <b class="tg-bold">co</b><b class="tg-bold"><i class="tg-italic">ming to </i></b><i class="tg-italic"><b class="tg-bold"><span class="tg-underline">save</span> you.</b> </i><span class="tg-spoiler"><i class="tg-italic">Get up.</i> </span>Be your own hero.',
    );
  });

  it("#2", () => {
    const html = messageToHtml({
      entities: [
        {
          length: 10,
          offset: 0,
          type: "blockquote",
        },
        {
          length: 4,
          offset: 0,
          type: "italic",
        },
        {
          length: 4,
          offset: 0,
          type: "bold",
        },
        {
          length: 6,
          offset: 4,
          type: "italic",
        },
        {
          length: 6,
          offset: 4,
          type: "bold",
        },
      ],
      text: "aaaabbbbbb",
    });

    expect(html).toBe(
      '<blockquote class="tg-blockquote"><b class="tg-bold"><i class="tg-italic">aaaa</i></b><b class="tg-bold"><i class="tg-italic">bbbbbb</i></b></blockquote>',
    );
  });

  it("#3", () => {
    const html = messageToHtml({
      entities: [
        {
          length: 10,
          offset: 0,
          type: "blockquote",
        },
        {
          length: 4,
          offset: 0,
          type: "bold",
        },
        {
          length: 6,
          offset: 4,
          type: "bold",
        },
        {
          length: 6,
          offset: 4,
          type: "italic",
        },
      ],
      text: "boldItalic",
    });

    expect(html).toBe(
      '<blockquote class="tg-blockquote"><b class="tg-bold">bold</b><b class="tg-bold"><i class="tg-italic">Italic</i></b></blockquote>',
    );
  });
});

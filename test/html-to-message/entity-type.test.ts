import { htmlToMessage } from "$dist";
import { describe, it, expect } from "vitest";

describe("entity type", () => {
  it("blockquote", () => {
    const message = htmlToMessage(
      "This is blockquote\n<blockquote>When a clown moves into a palace, he doesn't become a king. The palace becomes a circus.\n— Turkish Proverb</blockquote>",
    );

    expect(message).toStrictEqual({
      entities: [{ length: 106, offset: 19, type: "blockquote" }],
      text: "This is blockquote\nWhen a clown moves into a palace, he doesn't become a king. The palace becomes a circus.\n— Turkish Proverb",
    });
  });

  describe("bold", () => {
    it("b tag", () => {
      const message = htmlToMessage("This is <b>bold text</b>");

      expect(message).toStrictEqual({
        entities: [{ length: 9, offset: 8, type: "bold" }],
        text: "This is bold text",
      });
    });

    it("strong tag", () => {
      const message = htmlToMessage("This is <strong>bold text</strong>");

      expect(message).toStrictEqual({
        entities: [{ length: 9, offset: 8, type: "bold" }],
        text: "This is bold text",
      });
    });
  });

  it("bot_command", () => {
    const message = htmlToMessage(
      'This is bot_command <span class="tg-bot-command">/start@bot</span>',
    );

    expect(message).toStrictEqual({
      entities: [],
      text: "This is bot_command /start@bot",
    });
  });

  it("cashtag", () => {
    const message = htmlToMessage('This is cashtag <span class="tg-cashtag">$IDR</span>');

    expect(message).toStrictEqual({
      entities: [],
      text: "This is cashtag $IDR",
    });
  });

  it("code", () => {
    const message = htmlToMessage("This is code <code>monowidth string</code>");

    expect(message).toStrictEqual({
      entities: [{ length: 16, offset: 13, type: "code" }],
      text: "This is code monowidth string",
    });
  });

  describe("custom_emoji", () => {
    it("with data-emoji-id", () => {
      const message = htmlToMessage(
        'This is custom_emoji <span class="tg-custom-emoji" data-emoji-id="1048596">🎂</span>',
      );

      expect(message).toStrictEqual({
        entities: [
          {
            custom_emoji_id: "1048596",
            length: 2,
            offset: 21,
            type: "custom_emoji",
          },
        ],
        text: "This is custom_emoji 🎂",
      });
    });

    it("missing data-emoji-id", () => {
      const message = htmlToMessage('This is custom_emoji <span class="tg-custom-emoji">🎂</span>');

      expect(message).toStrictEqual({ entities: [], text: "This is custom_emoji 🎂" });
    });
  });

  describe("date_time", () => {
    it("should return date_time entity", () => {
      const message = htmlToMessage(
        '<time datetime="2026-08-17T03:00:00.000Z" data-time-format="wDT">10.00 tomorrow</time>',
      );

      expect(message).toStrictEqual({
        entities: [
          {
            date_time_format: "wDT",
            length: 14,
            offset: 0,
            type: "date_time",
            unix_time: 1_786_935_600,
          },
        ],
        text: "10.00 tomorrow",
      });
    });

    it("should return no entity due to missing datetime attribute", () => {
      const message = htmlToMessage('<time data-time-format="wDT">10.00 tomorrow</time>');
      expect(message).toStrictEqual({ entities: [], text: "10.00 tomorrow" });
    });

    it("should return no entity due to missing data-time-format attribute", () => {
      const message = htmlToMessage(
        '<time datetime="2026-08-17T03:00:00.000Z">10.00 tomorrow</time>',
      );
      expect(message).toStrictEqual({ entities: [], text: "10.00 tomorrow" });
    });
  });

  it("email", () => {
    const message = htmlToMessage(
      'This is email <a href="mailto:mailme@proton.me">mailme@proton.me</a>',
    );

    expect(message).toStrictEqual({
      entities: [],
      text: "This is email mailme@proton.me",
    });
  });

  it("expandable_blockquote", () => {
    const message = htmlToMessage(
      `This is expandable_blockquote\n<span class="tg-expandable-blockquote">When a clown moves into a palace, he doesn't become a king. The palace becomes a circus.\n— Turkish Proverb</span>`,
    );

    expect(message).toStrictEqual({
      entities: [{ length: 106, offset: 30, type: "expandable_blockquote" }],
      text: "This is expandable_blockquote\nWhen a clown moves into a palace, he doesn't become a king. The palace becomes a circus.\n— Turkish Proverb",
    });
  });

  it("hashtag", () => {
    const message = htmlToMessage('This is <span class="tg-hashtag">#hashtag</span>');

    expect(message).toStrictEqual({
      entities: [],
      text: "This is #hashtag",
    });
  });

  describe("italic", () => {
    it("i tag", () => {
      const message = htmlToMessage("This is <i>italic text</i>");

      expect(message).toStrictEqual({
        entities: [{ length: 11, offset: 8, type: "italic" }],
        text: "This is italic text",
      });
    });

    it("em tag", () => {
      const message = htmlToMessage("This is <em>italic text</me>");

      expect(message).toStrictEqual({
        entities: [{ length: 11, offset: 8, type: "italic" }],
        text: "This is italic text",
      });
    });
  });

  it("mention", () => {
    const message = htmlToMessage('This is mention <a href="https://t.me/username">@username</a>');

    expect(message).toStrictEqual({
      entities: [],
      text: "This is mention @username",
    });
  });

  it("phone_number", () => {
    const message = htmlToMessage(
      'This is phone number <a href="tel:+1-130-205-112-358-1">+1-130-205-112-358-1</a>',
    );

    expect(message).toStrictEqual({
      entities: [],
      text: "This is phone number +1-130-205-112-358-1",
    });
  });

  describe("pre", () => {
    it("with code language", () => {
      const message = htmlToMessage(
        'This is pre-code\n<pre><code class="language-ts">console.log("hello world");\nconsole.log("good bye world");</code></pre>',
      );

      expect(message).toStrictEqual({
        entities: [{ language: "ts", length: 58, offset: 17, type: "pre" }],
        text: 'This is pre-code\nconsole.log("hello world");\nconsole.log("good bye world");',
      });
    });

    it("without code language", () => {
      const message = htmlToMessage(
        "This is pre\n<pre>monowidth block\nmonowidth block\nmonowidth block</pre>",
      );

      expect(message).toStrictEqual({
        entities: [{ length: 47, offset: 12, type: "pre" }],
        text: "This is pre\nmonowidth block\nmonowidth block\nmonowidth block",
      });
    });
  });

  it("spoiler", () => {
    const message = htmlToMessage('This is spoiler <span class="tg-spoiler">DO NOT BE EVIL</span>');

    expect(message).toStrictEqual({
      entities: [{ length: 14, offset: 16, type: "spoiler" }],
      text: "This is spoiler DO NOT BE EVIL",
    });
  });

  describe("strikethrough", () => {
    it("del tag", () => {
      const message = htmlToMessage("This is <del>strikethrough text</del>");

      expect(message).toStrictEqual({
        entities: [{ length: 18, offset: 8, type: "strikethrough" }],
        text: "This is strikethrough text",
      });
    });

    it("s tag", () => {
      const message = htmlToMessage("This is <s>strikethrough text</s>");

      expect(message).toStrictEqual({
        entities: [{ length: 18, offset: 8, type: "strikethrough" }],
        text: "This is strikethrough text",
      });
    });
  });

  it("text_link", () => {
    const message = htmlToMessage('This is text_link <a href="https://grammy.dev/">grammy</a>');

    expect(message).toStrictEqual({
      entities: [
        {
          length: 6,
          offset: 18,
          type: "text_link",
          url: "https://grammy.dev/",
        },
      ],
      text: "This is text_link grammy",
    });
  });

  it("text_mention", () => {
    const message = htmlToMessage(
      'This is <a href="tg://user?id=1048596" data-user="{&quot;first_name&quot;:&quot;No&quot;,&quot;id&quot;:1048596,&quot;is_bot&quot;:false,&quot;language_code&quot;:&quot;en&quot;,&quot;last_name&quot;:&quot;Name&quot;}">text_mention</a>',
    );

    expect(message).toStrictEqual({
      entities: [
        {
          length: 12,
          offset: 8,
          type: "text_mention",
          user: {
            first_name: "No",
            id: 1_048_596,
            is_bot: false,
            language_code: "en",
            last_name: "Name",
          },
        },
      ],
      text: "This is text_mention",
    });
  });

  describe("underline", () => {
    it("from class name", () => {
      const message = htmlToMessage('This is <span class="tg-underline">underline text</span>');

      expect(message).toStrictEqual({
        entities: [{ length: 14, offset: 8, type: "underline" }],
        text: "This is underline text",
      });
    });

    it("from tag name", () => {
      const message = htmlToMessage("This is <u>underline text</u>");

      expect(message).toStrictEqual({
        entities: [{ length: 14, offset: 8, type: "underline" }],
        text: "This is underline text",
      });
    });
  });

  it("url", () => {
    const message = htmlToMessage('This is url <a href="telegram.org">telegram.org</a>');

    expect(message).toStrictEqual({
      entities: [],
      text: "This is url telegram.org",
    });
  });
});

import { messageToHtml } from "$dist";
import { describe, it, expect } from "vitest";

describe("entity type", () => {
  it("blockquote", () => {
    const html = messageToHtml({
      entities: [{ length: 106, offset: 19, type: "blockquote" }],
      text: "This is blockquote\nWhen a clown moves into a palace, he doesn't become a king. The palace becomes a circus.\n— Turkish Proverb",
    });

    expect(html).toBe(
      `This is blockquote\n<blockquote class="tg-blockquote">When a clown moves into a palace, he doesn't become a king. The palace becomes a circus.\n— Turkish Proverb</blockquote>`,
    );
  });

  it("bold", () => {
    const html = messageToHtml({
      entities: [{ length: 9, offset: 8, type: "bold" }],
      text: "This is bold text",
    });

    expect(html).toBe('This is <b class="tg-bold">bold text</b>');
  });

  it("bot_command", () => {
    const html = messageToHtml({
      entities: [{ length: 10, offset: 20, type: "bot_command" }],
      text: "This is bot_command /start@bot",
    });

    expect(html).toBe('This is bot_command <span class="tg-bot-command">/start@bot</span>');
  });

  it("cashtag", () => {
    const html = messageToHtml({
      entities: [{ length: 8, offset: 16, type: "cashtag" }],
      text: "This is cashtag $IDR",
    });

    expect(html).toBe('This is cashtag <span class="tg-cashtag">$IDR</span>');
  });

  it("code", () => {
    const html = messageToHtml({
      entities: [{ length: 16, offset: 13, type: "code" }],
      text: "This is code monowidth string",
    });

    expect(html).toBe('This is code <code class="tg-code">monowidth string</code>');
  });

  it("custom_emoji", () => {
    const html = messageToHtml({
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

    expect(html).toBe(
      'This is custom_emoji <span class="tg-custom-emoji" data-emoji-id="1048596">🎂</span>',
    );
  });

  it("date_time", () => {
    const html = messageToHtml({
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

    expect(html).toBe(
      '<time class="tg-date-time" datetime="2026-08-17T03:00:00.000Z" data-time-format="wDT">10.00 tomorrow</time>',
    );
  });

  it("email", () => {
    const html = messageToHtml({
      entities: [{ length: 16, offset: 14, type: "email" }],
      text: "This is email mailme@proton.me",
    });

    expect(html).toBe(
      'This is email <a href="mailto:mailme@proton.me" class="tg-email">mailme@proton.me</a>',
    );
  });

  it("expandable_blockquote", () => {
    const html = messageToHtml({
      entities: [{ length: 106, offset: 30, type: "expandable_blockquote" }],
      text: "This is expandable_blockquote\nWhen a clown moves into a palace, he doesn't become a king. The palace becomes a circus.\n— Turkish Proverb",
    });

    expect(html).toBe(
      `This is expandable_blockquote\n<blockquote class="tg-expandable-blockquote">When a clown moves into a palace, he doesn't become a king. The palace becomes a circus.\n— Turkish Proverb</blockquote>`,
    );
  });

  it("hashtag", () => {
    const html = messageToHtml({
      entities: [{ length: 8, offset: 8, type: "hashtag" }],
      text: "This is #hashtag",
    });

    expect(html).toBe('This is <span class="tg-hashtag">#hashtag</span>');
  });

  it("italic", () => {
    const html = messageToHtml({
      entities: [{ length: 11, offset: 8, type: "italic" }],
      text: "This is italic text",
    });

    expect(html).toBe('This is <i class="tg-italic">italic text</i>');
  });

  it("mention", () => {
    const html = messageToHtml({
      entities: [{ length: 9, offset: 16, type: "mention" }],
      text: "This is mention @username",
    });

    expect(html).toBe(
      'This is mention <a href="https://t.me/username" class="tg-mention">@username</a>',
    );
  });

  it("phone_number", () => {
    const html = messageToHtml({
      entities: [{ length: 20, offset: 21, type: "phone_number" }],
      text: "This is phone number +1-130-205-112-358-1",
    });

    expect(html).toBe(
      'This is phone number <a href="tel:+1-130-205-112-358-1" class="tg-phone-number">+1-130-205-112-358-1</a>',
    );
  });

  describe("pre", () => {
    it("with code language", () => {
      const html = messageToHtml({
        entities: [{ language: "ts", length: 58, offset: 17, type: "pre" }],
        text: 'This is pre-code\nconsole.log("hello world");\nconsole.log("good bye world");',
      });

      expect(html).toBe(
        'This is pre-code\n<pre class="tg-pre-code"><code class="language-ts">console.log("hello world");\nconsole.log("good bye world");</code></pre>',
      );
    });

    it("without code language", () => {
      const html = messageToHtml({
        entities: [{ length: 47, offset: 12, type: "pre" }],
        text: "This is pre\nmonowidth block\nmonowidth block\nmonowidth block",
      });

      expect(html).toBe(
        'This is pre\n<pre class="tg-pre">monowidth block\nmonowidth block\nmonowidth block</pre>',
      );
    });
  });

  it("spoiler", () => {
    const html = messageToHtml({
      entities: [{ length: 14, offset: 16, type: "spoiler" }],
      text: "This is spoiler DO NOT BE EVIL",
    });

    expect(html).toBe('This is spoiler <span class="tg-spoiler">DO NOT BE EVIL</span>');
  });

  it("strikethrough", () => {
    const html = messageToHtml({
      entities: [{ length: 18, offset: 8, type: "strikethrough" }],
      text: "This is strikethrough text",
    });

    expect(html).toBe('This is <del class="tg-strikethrough">strikethrough text</del>');
  });

  it("text_link", () => {
    const html = messageToHtml({
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

    expect(html).toBe(
      'This is text_link <a href="https://grammy.dev/" class="tg-text-link">grammy</a>',
    );
  });

  it("text_mention", () => {
    const html = messageToHtml({
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

    expect(html).toBe(
      'This is <a href="tg://user?id=1048596" class="tg-text-mention">text_mention</a>',
    );
  });

  it("underline", () => {
    const html = messageToHtml({
      entities: [{ length: 14, offset: 8, type: "underline" }],
      text: "This is underline text",
    });

    expect(html).toBe('This is <span class="tg-underline">underline text</span>');
  });

  it("url", () => {
    const html = messageToHtml({
      entities: [{ length: 12, offset: 12, type: "url" }],
      text: "This is url telegram.org",
    });

    expect(html).toBe('This is url <a href="telegram.org" class="tg-url">telegram.org</a>');
  });

  describe("unknown entity", () => {
    it("with type", () => {
      const html = messageToHtml({
        // @ts-expect-error For testing
        entities: [{ length: 3, offset: 0, type: "unknown" }],
        text: "foo",
      });

      expect(html).toBe('<span class="tg-unknown">foo</span>');
    });

    it("no type", () => {
      const html = messageToHtml({
        // @ts-expect-error For testing
        entities: [{ length: 3, offset: 0 }],
        text: "foo",
      });

      expect(html).toBe("foo");
    });
  });
});

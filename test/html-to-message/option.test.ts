import { htmlToMessage } from "$dist";
import { describe, it, expect } from "vitest";

describe("option", () => {
  it("classPrefix", () => {
    const html = htmlToMessage('This is <span class="custom-underline">underline text</span>', {
      classPrefix: "custom-",
    });

    expect(html).toStrictEqual({
      entities: [{ length: 14, offset: 8, type: "underline" }],
      text: "This is underline text",
    });
  });

  describe("skipAutoEntities: false", () => {
    it("bot_command", () => {
      const message = htmlToMessage(
        'This is bot_command <span class="tg-bot-command">/start@bot</span>',
        { skipAutoEntities: false },
      );

      expect(message).toStrictEqual({
        entities: [{ length: 10, offset: 20, type: "bot_command" }],
        text: "This is bot_command /start@bot",
      });
    });

    it("cashtag", () => {
      const message = htmlToMessage('This is cashtag <span class="tg-cashtag">$IDR</span>', {
        skipAutoEntities: false,
      });

      expect(message).toStrictEqual({
        entities: [{ length: 4, offset: 16, type: "cashtag" }],
        text: "This is cashtag $IDR",
      });
    });

    it("email", () => {
      const message = htmlToMessage(
        'This is email <a href="mailto:mailme@proton.me">mailme@proton.me</a>',
        { skipAutoEntities: false },
      );

      expect(message).toStrictEqual({
        entities: [{ length: 16, offset: 14, type: "email" }],
        text: "This is email mailme@proton.me",
      });
    });

    it("hashtag", () => {
      const message = htmlToMessage('This is <span class="tg-hashtag">#hashtag</span>', {
        skipAutoEntities: false,
      });

      expect(message).toStrictEqual({
        entities: [{ length: 8, offset: 8, type: "hashtag" }],
        text: "This is #hashtag",
      });
    });

    it("mention", () => {
      const message = htmlToMessage(
        'This is mention <a href="https://t.me/username">@username</a>',
        { skipAutoEntities: false },
      );

      expect(message).toStrictEqual({
        entities: [{ length: 9, offset: 16, type: "mention" }],
        text: "This is mention @username",
      });
    });

    it("phone_number", () => {
      const message = htmlToMessage(
        'This is phone number <a href="tel:+1-130-205-112-358-1">+1-130-205-112-358-1</a>',
        { skipAutoEntities: false },
      );

      expect(message).toStrictEqual({
        entities: [{ length: 20, offset: 21, type: "phone_number" }],
        text: "This is phone number +1-130-205-112-358-1",
      });
    });

    it("url", () => {
      const message = htmlToMessage('This is url <a href="telegram.org">telegram.org</a>', {
        skipAutoEntities: false,
      });

      expect(message).toStrictEqual({
        entities: [{ length: 12, offset: 12, type: "url" }],
        text: "This is url telegram.org",
      });
    });
  });
});

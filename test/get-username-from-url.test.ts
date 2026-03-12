import type { HtmlToMessageOptions } from "telegram-html";
import { htmlToMessage } from "telegram-html";
import { describe, it, expect } from "vitest";

const options: HtmlToMessageOptions = {
  skipAutoEntities: false,
};

describe("getUsernameFromUrl", () => {
  it("should returns username", () => {
    expect(htmlToMessage('<a href="https://t.me/quadratz">@quadratz</a>', options)).toStrictEqual({
      entities: [{ length: 9, offset: 0, type: "mention" }],
      text: "@quadratz",
    });
  });

  it("username should contain between 4 and 32 characters long", () => {
    // 3 characters
    expect(htmlToMessage('<a href="https://t.me/qua">@qua</a>', options)).toStrictEqual({
      entities: [{ length: 4, offset: 0, type: "text_link", url: "https://t.me/qua" }],
      text: "@qua",
    });
    // 4 characters
    expect(htmlToMessage('<a href="https://t.me/quad">@quad</a>', options)).toStrictEqual({
      entities: [{ length: 5, offset: 0, type: "mention" }],
      text: "@quad",
    });
    // 32 characters
    expect(
      htmlToMessage(
        '<a href="https://t.me/a123456789012345678901234567890z">@a123456789012345678901234567890z</a>',
        { skipAutoEntities: false },
      ),
    ).toStrictEqual({
      entities: [{ length: 33, offset: 0, type: "mention" }],
      text: "@a123456789012345678901234567890z",
    });
    // 33 characters
    expect(
      htmlToMessage(
        '<a href="https://t.me/a123456789012345678901234567890yz">@a123456789012345678901234567890yz</a>',
        { skipAutoEntities: false },
      ),
    ).toStrictEqual({
      entities: [
        {
          length: 34,
          offset: 0,
          type: "text_link",
          url: "https://t.me/a123456789012345678901234567890yz",
        },
      ],
      text: "@a123456789012345678901234567890yz",
    });
  });

  it("username should not contain two or more consecutive underscores", () => {
    // One underscore
    expect(htmlToMessage('<a href="https://t.me/qua_dratz">@qua_dratz</a>', options)).toStrictEqual(
      { entities: [{ length: 10, offset: 0, type: "mention" }], text: "@qua_dratz" },
    );
    // Two underscores
    expect(
      htmlToMessage('<a href="https://t.me/qua__dratz">@qua__dratz</a>', options),
    ).toStrictEqual({
      entities: [{ length: 11, offset: 0, type: "text_link", url: "https://t.me/qua__dratz" }],
      text: "@qua__dratz",
    });
    // Three underscores
    expect(
      htmlToMessage('<a href="https://t.me/qua___dratz">@qua___dratz</a>', options),
    ).toStrictEqual({
      entities: [{ length: 12, offset: 0, type: "text_link", url: "https://t.me/qua___dratz" }],
      text: "@qua___dratz",
    });
  });

  it("username should start with a letter", () => {
    expect(
      htmlToMessage('<a href="https://t.me/1quadratz">@1quadratz</a>', {
        skipAutoEntities: false,
      }),
    ).toStrictEqual({
      entities: [{ length: 10, offset: 0, type: "text_link", url: "https://t.me/1quadratz" }],
      text: "@1quadratz",
    });
  });

  it("username middle characters should be letters, digits, or underscores", () => {
    expect(
      htmlToMessage('<a href="https://t.me/qu1adratz">@qu1adratz</a>', {
        skipAutoEntities: false,
      }),
    ).toStrictEqual({
      entities: [{ length: 10, offset: 0, type: "mention" }],
      text: "@qu1adratz",
    });

    expect(
      htmlToMessage('<a href="https://t.me/qu-adratz">@qu-adratz</a>', {
        skipAutoEntities: false,
      }),
    ).toStrictEqual({
      entities: [{ length: 10, offset: 0, type: "text_link", url: "https://t.me/qu-adratz" }],
      text: "@qu-adratz",
    });
  });

  it("username should end a letter or digit", () => {
    expect(
      htmlToMessage('<a href="https://t.me/quadratz0">@quadratz0</a>', {
        skipAutoEntities: false,
      }),
    ).toStrictEqual({
      entities: [{ length: 10, offset: 0, type: "mention" }],
      text: "@quadratz0",
    });

    expect(
      htmlToMessage('<a href="https://t.me/quadratz_">@quadratz_</a>', {
        skipAutoEntities: false,
      }),
    ).toStrictEqual({
      entities: [{ length: 10, offset: 0, type: "text_link", url: "https://t.me/quadratz_" }],
      text: "@quadratz_",
    });
  });

  it("should recognize telegram.dog", () => {
    expect(
      htmlToMessage('<a href="https://telegram.dog/quadratz">@quadratz</a>', {
        skipAutoEntities: false,
      }),
    ).toStrictEqual({
      entities: [{ length: 9, offset: 0, type: "mention" }],
      text: "@quadratz",
    });
  });

  it("should recognize telegram.me", () => {
    expect(
      htmlToMessage('<a href="https://telegram.me/quadratz">@quadratz</a>', {
        skipAutoEntities: false,
      }),
    ).toStrictEqual({
      entities: [{ length: 9, offset: 0, type: "mention" }],
      text: "@quadratz",
    });
  });

  it("should allow username as subdomain only for t.me", () => {
    expect(
      htmlToMessage('<a href="https://quadratz.t.me">@quadratz</a>', {
        skipAutoEntities: false,
      }),
    ).toStrictEqual({
      entities: [{ length: 9, offset: 0, type: "mention" }],
      text: "@quadratz",
    });

    expect(
      htmlToMessage('<a href="https://quadratz.telegram.me">@quadratz</a>', {
        skipAutoEntities: false,
      }),
    ).toStrictEqual({
      entities: [{ length: 9, offset: 0, type: "text_link", url: "https://quadratz.telegram.me" }],
      text: "@quadratz",
    });

    expect(
      htmlToMessage('<a href="https://quadratz.telegram.dog">@quadratz</a>', {
        skipAutoEntities: false,
      }),
    ).toStrictEqual({
      entities: [{ length: 9, offset: 0, type: "text_link", url: "https://quadratz.telegram.dog" }],
      text: "@quadratz",
    });
  });

  it("invalid paths", () => {
    expect(
      htmlToMessage('<a href="https://quadratz.t.me/path?text=hello">@quadratz</a>', {
        skipAutoEntities: false,
      }),
    ).toStrictEqual({
      entities: [
        { length: 9, offset: 0, type: "text_link", url: "https://quadratz.t.me/path?text=hello" },
      ],
      text: "@quadratz",
    });
    expect(
      htmlToMessage('<a href="https://t.me/quadratz?text=hello">@quadratz</a>', {
        skipAutoEntities: false,
      }),
    ).toStrictEqual({
      entities: [
        { length: 9, offset: 0, type: "text_link", url: "https://t.me/quadratz?text=hello" },
      ],
      text: "@quadratz",
    });
    expect(
      htmlToMessage('<a href="tg://resolve?domain=hello">@quadratz</a>', {
        skipAutoEntities: false,
      }),
    ).toStrictEqual({
      entities: [{ length: 9, offset: 0, type: "text_link", url: "tg://resolve?domain=hello" }],
      text: "@quadratz",
    });
    expect(
      htmlToMessage('<a href="https://my.quadratz.telegram.me">@quadratz</a>', {
        skipAutoEntities: false,
      }),
    ).toStrictEqual({
      entities: [
        { length: 9, offset: 0, type: "text_link", url: "https://my.quadratz.telegram.me" },
      ],
      text: "@quadratz",
    });
    expect(
      htmlToMessage('<a href="https://quadratz.t.me/sendMessage">@quadratz</a>', {
        skipAutoEntities: false,
      }),
    ).toStrictEqual({
      entities: [
        {
          length: 9,
          offset: 0,
          type: "text_link",
          url: "https://quadratz.t.me/sendMessage",
        },
      ],
      text: "@quadratz",
    });
  });
});

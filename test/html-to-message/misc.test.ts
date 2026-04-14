import { htmlToMessage } from "$dist";
import { it, expect, describe } from "vitest";

describe("misc", () => {
  it("should ignore any irrelevant className attributes", () => {
    expect(
      htmlToMessage('<b class="tg-unknown">bold</b>', { skipAutoEntities: false }),
    ).toStrictEqual({
      entities: [{ length: 4, offset: 0, type: "bold" }],
      text: "bold",
    });

    expect(htmlToMessage('<b class="text-xl">bold</b>')).toStrictEqual({
      entities: [{ length: 4, offset: 0, type: "bold" }],
      text: "bold",
    });
  });

  it("should return no entities when the href is missing", () => {
    expect(htmlToMessage("<a>hello</a>")).toStrictEqual({ entities: [], text: "hello" });
  });

  it("should not return text_mention entity when multiple parameters are in the url", () => {
    expect(
      htmlToMessage(`<a href="tg://user?id=123&text=hello" data-user="{}">quadratz</a>`),
    ).toStrictEqual({
      entities: [{ length: 8, offset: 0, type: "text_link", url: "tg://user?id=123&text=hello" }],
      text: "quadratz",
    });
  });
});

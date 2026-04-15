import type { Element } from "hast";
import { getAttribute } from "hast-util-get-attribute";
import { select } from "hast-util-select";
import { toText } from "hast-util-to-text";
import { unescape } from "html-escaper";
import parseUrl from "parse-url";
import type { MergedOptions, RenderElementResult } from "$src/types/hast-to-message.ts";
import type { User } from "@grammyjs/types";
import { getUsernameFromUrl } from "./get-username-from-url";

function renderElement(opt: {
  node: Element;
  offset: number;
  options: MergedOptions;
}): RenderElementResult {
  const { node, offset } = opt;
  const userOptions = opt.options;
  /** The plain-text value of the current node. */
  const nodeText = toText(node);
  /** The length of the current node text value. */
  const { length } = nodeText;
  const classNames = getAttribute(node, "className")?.split(" ");

  if (classNames) {
    const classEntity = classNames.find((el) => el.startsWith(userOptions.classPrefix));
    const entityName = classEntity?.slice(userOptions.classPrefix.length) ?? "";

    if (!userOptions.skipAutoEntities) {
      switch (entityName) {
        case "bot-command": {
          return { entity: { length, offset, type: "bot_command" } };
        }
        case "cashtag": {
          return { entity: { length, offset, type: "cashtag" } };
        }
        case "hashtag": {
          return { entity: { length, offset, type: "hashtag" } };
        }
        default: {
          break;
        }
      }
    }

    switch (entityName) {
      case "custom-emoji": {
        const emojiId = getAttribute(node, "dataEmojiId");
        if (typeof emojiId === "string") {
          return { entity: { custom_emoji_id: emojiId, length, offset, type: "custom_emoji" } };
        }
        break;
      }
      case "expandable-blockquote": {
        return { entity: { length, offset, type: "expandable_blockquote" } };
      }
      case "spoiler": {
        return { entity: { length, offset, type: "spoiler" } };
      }
      case "underline": {
        return { entity: { length, offset, type: "underline" } };
      }
      default: {
        break;
      }
    }
  }

  switch (node.tagName) {
    case "blockquote": {
      return { entity: { length, offset, type: "blockquote" } };
    }

    case "b":
    case "strong": {
      return { entity: { length, offset, type: "bold" } };
    }

    case "code": {
      return { entity: { length, offset, type: "code" } };
    }

    case "time": {
      const isoString = getAttribute(node, "datetime");
      const timeFormat = getAttribute(node, "dataTimeFormat");
      if (typeof isoString === "string" && typeof timeFormat === "string") {
        // Divide by 1000 because js uses milliseconds.
        const unixTime = Math.floor(new Date(isoString).getTime() / 1000);
        return {
          entity: {
            // It's user's responsibility to ensure the format is correct.
            date_time_format: unescape(timeFormat) as "",
            length,
            offset,
            type: "date_time",
            unix_time: unixTime,
          },
        };
      }
      break;
    }

    case "a": {
      const maybeUrl = getAttribute(node, "href");
      if (typeof maybeUrl !== "string") {
        break;
      }
      const url = decodeURI(maybeUrl);

      // Whether it is compatible to "email" entity.
      if (
        url.startsWith("mailto:") &&
        // 7 is the length of "mailto:".
        url.slice(7) === nodeText
      ) {
        if (userOptions.skipAutoEntities) {
          break;
        }
        return { entity: { length, offset, type: "email" } };
      }

      // Whether it is compatible to "mention" entity.
      const maybeUsername = getUsernameFromUrl(url);
      if (typeof maybeUsername === "string" && `@${maybeUsername}` === nodeText) {
        if (userOptions.skipAutoEntities) {
          break;
        }
        return { entity: { length, offset, type: "mention" } };
      }

      // Whether it is compatible to "phone_number" entity.
      if (
        url.startsWith("tel:") &&
        // 4 is the length of "tel:"
        url.slice(4) === nodeText
      ) {
        if (userOptions.skipAutoEntities) {
          break;
        }
        return { entity: { length, offset, type: "phone_number" } };
      }

      // Whether it is compatible to "text_mention" entity.
      const dataUser = getAttribute(node, "dataUser");
      if (url.startsWith("tg://user?id=") && typeof dataUser === "string") {
        const { query } = parseUrl(url, true);
        if (Object.keys(query).length === 1) {
          const user = JSON.parse(unescape(dataUser)) as User;
          return { entity: { length, offset, type: "text_mention", user } };
        }
      }

      // Whether it is compatible to "url" entity.
      if (url === nodeText) {
        if (userOptions.skipAutoEntities) {
          break;
        }
        return { entity: { length, offset, type: "url" } };
      }

      // It is a "text_link" entity then.
      return { entity: { length, offset, type: "text_link", url } };
    }

    case "i":
    case "em": {
      return { entity: { length, offset, type: "italic" } };
    }

    case "pre": {
      const codeNode = select('[class^="language-"]', node);
      if (codeNode === undefined) {
        return {
          entity: { length, offset, type: "pre" },
          skipChildrenNode: true,
          text: nodeText,
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const className = getAttribute(codeNode, "className")!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const classLanguage = className.split(" ").find((el) => el.startsWith("language-"))!;
      // 9 is the length of "language-"
      const language = classLanguage.slice(9);

      return {
        entity: { language, length, offset, type: "pre" },
        skipChildrenNode: true,
        text: nodeText,
      };
    }

    case "s":
    case "del": {
      return { entity: { length, offset, type: "strikethrough" } };
    }

    case "u": {
      return { entity: { length, offset, type: "underline" } };
    }

    default: {
      break;
    }
  }

  return { entity: undefined };
}

export { renderElement };

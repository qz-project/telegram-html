import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { escape } from "html-escaper";
import type { ReadonlyDeep } from "type-fest";
import { CONTINUE, SKIP, visit } from "unist-util-visit";
import type { MessageEntity } from "@/types/message-entity.ts";
import type { HtmlMarker, MergedOptions } from "@/types/message-to-hast.ts";
import { MarkerType } from "./create-html-marker.ts";
import { sanitizeUrl } from "./sanitize-url.ts";

/**
 * Regex to match continuous sequence of closing HTML tags at the end of a
 * string.
 */
const RE_CLOSING_TAG = /((?:<\/\s*[\w-]+\s*>)+)$/;

/**
 * Splits an HTML string into its opening content and closing tags.
 */
function extractHtmlParts(html: string): {
  startHtml: string;
  endHtml: string;
} {
  const match = RE_CLOSING_TAG.exec(html);

  if (match) {
    const endHtml = match[1];
    const startHtml = html.slice(0, -endHtml.length);

    return { endHtml, startHtml };
  }

  return { endHtml: "", startHtml: html };
}

function renderer(text: string, classPrefix: string, entity: ReadonlyDeep<MessageEntity>): string {
  switch (entity.type) {
    case "blockquote": {
      return `<blockquote class="${classPrefix}blockquote">`;
    }

    case "bold": {
      return `<b class="${classPrefix}bold">`;
    }

    case "bot_command": {
      return `<span class="${classPrefix}bot-command">`;
    }

    case "cashtag": {
      return `<span class="${classPrefix}cashtag">`;
    }

    case "code": {
      return `<code class="${classPrefix}code">`;
    }

    case "custom_emoji": {
      const emojiId = escape(entity.custom_emoji_id);
      return `<span class="${classPrefix}custom-emoji" data-emoji-id="${emojiId}">`;
    }

    case "date_time": {
      // Multiply by 1000 because js date uses milliseconds.
      const isoString = new Date(entity.unix_time * 1000).toISOString();
      const timeFormat = escape(entity.date_time_format);
      return `<time class="${classPrefix}date-time" datetime="${isoString}" data-time-format="${timeFormat}">`;
    }

    case "email": {
      const href = sanitizeUrl(`mailto:${text}`);
      return `<a href="${href}" class="${classPrefix}email">`;
    }

    case "expandable_blockquote": {
      return `<blockquote class="${classPrefix}expandable-blockquote">`;
    }

    case "hashtag": {
      return `<span class="${classPrefix}hashtag">`;
    }

    case "italic": {
      return `<i class="${classPrefix}italic">`;
    }

    case "mention": {
      const username = text.replace("@", "");
      const href = sanitizeUrl(`https://t.me/${username}`);
      return `<a href="${href}" class="${classPrefix}mention">`;
    }

    case "phone_number": {
      const href = sanitizeUrl(`tel:${text}`);
      return `<a href="${href}" class="${classPrefix}phone-number">`;
    }

    case "pre": {
      const codeLanguage = entity.language;
      if (typeof codeLanguage === "string") {
        return `<pre class="${classPrefix}pre-code"><code class="language-${escape(codeLanguage)}">`;
      }
      return `<pre class="${classPrefix}pre">`;
    }

    case "spoiler": {
      return `<span class="${classPrefix}spoiler">`;
    }

    case "strikethrough": {
      return `<del class="${classPrefix}strikethrough">`;
    }

    case "text_link": {
      const href = sanitizeUrl(entity.url);
      return `<a href="${href}" class="${classPrefix}text-link">`;
    }

    case "text_mention": {
      const user = JSON.stringify(entity.user);
      const userId = entity.user.id.toString();
      const href = sanitizeUrl(`tg://user?id=${userId}`);
      return `<a href="${href}" class="${classPrefix}text-mention" data-user="${escape(user)}">`;
    }

    case "underline": {
      return `<span class="${classPrefix}underline">`;
    }

    case "url": {
      const href = sanitizeUrl(text);
      return `<a href="${href}" class="${classPrefix}url">`;
    }

    // Unknown entity type.
    default: {
      const unknownEntity = entity as unknown;

      if (
        unknownEntity !== null &&
        typeof unknownEntity === "object" &&
        "type" in unknownEntity &&
        typeof unknownEntity.type === "string"
      ) {
        return `<span class="${classPrefix}${unknownEntity.type}" data-tg-entity="${escape(JSON.stringify(entity))}">`;
      }

      return "";
    }
  }
}

/**
 * Renders the HTML string for a specific marker (start or end).
 */
function renderMarker(marker: HtmlMarker, options: MergedOptions): string {
  const { text, entity } = marker.wrapper;
  const renderedHtml = renderer(text, options.classPrefix, entity);
  const tree = fromHtml(renderedHtml, { fragment: true });

  visit(tree, "element", (node, index, parent) => {
    if (!options.withClass) {
      delete node.properties.className;
    }

    if (!options.preserveEntityData) {
      delete node.properties.dataTgEmojiId;
      delete node.properties.dataUser;
      delete node.properties.dataTgEntity;
    }

    // Unwrap empty spans (spans with no attributes)
    if (
      Object.keys(node.properties).length === 0 &&
      node.tagName === "span" &&
      parent &&
      typeof index === "number"
    ) {
      parent.children.splice(index, 1, ...node.children);
      return [SKIP, index];
    }

    return CONTINUE;
  });

  const { startHtml, endHtml } = extractHtmlParts(toHtml(tree));

  return marker.type === MarkerType.START ? startHtml : endHtml;
}

export { renderMarker };

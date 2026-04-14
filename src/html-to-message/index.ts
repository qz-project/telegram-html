import { fromHtml } from "hast-util-from-html";
import { hastToMessage } from "$src/hast-to-message/index.ts";
import type { HtmlToMessageOptions } from "$src/types/html-to-message.ts";
import type { Message } from "$src/types/message.ts";

/**
 * Converts HTML into Telegram Message.
 *
 * @example
 * ```ts
 * const html = htmlToMessage('<b class="tg-bold">bold text</b>')
 * ```
 */
function htmlToMessage(html: string, options?: HtmlToMessageOptions): Message {
  const tree = fromHtml(html, { fragment: true });
  return hastToMessage(tree, options);
}

export { htmlToMessage };

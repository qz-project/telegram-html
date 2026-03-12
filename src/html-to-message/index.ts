import { fromHtml } from "hast-util-from-html";
import { hastToMessage } from "@/hast-to-message/index.ts";
import type { HtmlToMessageOptions } from "@/types/html-to-message.ts";
import type { Message } from "@/types/message.ts";

/**
 * Converts HTML into Telegram Message.
 *
 * @example
 * ```ts
 * const html = htmlToMessage('<b class="tg-bold">bold text</b>')
 * ```
 */
// oxlint-disable-next-line typescript/prefer-readonly-parameter-types
function htmlToMessage(html: string, options?: HtmlToMessageOptions): Message {
  const tree = fromHtml(html, { fragment: true });
  return hastToMessage(tree, options);
}

export { htmlToMessage };

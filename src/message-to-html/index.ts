import type { Nodes } from "hast";
import { toHtml } from "hast-util-to-html";
import { messageToHast } from "@/message-to-hast/index.ts";
import type { MessageToHtmlOptions } from "@/types/message-to-html.ts";
import type { Message } from "@/types/message.ts";

/**
 * Converts a Telegram message into semantic HTML.
 *
 * @param message - The Telegram Message object.
 * @param options - Configuration options.
 * @returns HTML string.
 *
 * @example
 * ```ts
 * const html = messageToHtml({
 *   text: "This is bold text",
 *   entities: [{ offset: 8, length: 9, type: "bold" }],
 * })
 * console.log(html) // 'This is <b class="tg-bold">bold text</b>'
 * ```
 */
// oxlint-disable-next-line typescript/prefer-readonly-parameter-types
function messageToHtml(message: Message, options?: MessageToHtmlOptions): string {
  const hast = messageToHast(message, options);
  return toHtml(hast as Nodes);
}

export { messageToHtml };

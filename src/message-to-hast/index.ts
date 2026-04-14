import { fromHtml } from "hast-util-from-html";
import { escape as htmlEscaper } from "html-escaper";
import type { ReadonlyDeep } from "type-fest";
import type { Root } from "@/index.ts";
import type { Entity, MergedOptions, MessageToHastOptions } from "@/types/message-to-hast.ts";
import type { Message } from "@/types/message.ts";
import { createHtmlMarkers } from "./create-html-marker.ts";
import { DEFAULT_OPTIONS } from "./default-options.ts";
import { getEntities } from "./get-entities.ts";
import { renderMarker } from "./render-marker.ts";
import { sortEntities } from "./sort-entities.ts";

/**
 * Converts a Telegram message into [hast](https://github.com/syntax-tree/hast).
 *
 * @param message - The Telegram Message object.
 * @param options - Configuration options.
 * @returns hast.
 *
 * @example
 * ```ts
 * messageToHast({
 *   text: "This is bold text",
 *   entities: [{ offset: 8, length: 9, type: "bold" }],
 * })
 * ```
 */
function messageToHast(message: Message, options?: MessageToHastOptions): Root;
function messageToHast(
  message: ReadonlyDeep<Message>,
  options_: ReadonlyDeep<MessageToHastOptions> = {},
): Root {
  const msgText: string = message.text ?? message.caption ?? "";

  // Combine user options with defaults.
  const options = { ...DEFAULT_OPTIONS, ...options_ } as MergedOptions;

  const entities: Entity[] = getEntities(message, msgText);
  sortEntities(entities);

  const htmlParts: string[] = [];
  let cursorPosition = 0;

  // Iterate over start/end markers to build the HTML string.
  for (const marker of createHtmlMarkers(entities)) {
    // Append plain text between the last cursor and current marker.
    if (marker.position > cursorPosition) {
      const plainText = msgText.slice(cursorPosition, marker.position);
      htmlParts.push(htmlEscaper(plainText));
    }

    // Append the HTML tag.
    const htmlTag = renderMarker(marker, options);

    htmlParts.push(htmlTag);

    cursorPosition = marker.position;
  }

  // Append any remaining text after the last entity.
  if (cursorPosition < msgText.length) {
    const remainingText = msgText.slice(cursorPosition);
    htmlParts.push(htmlEscaper(remainingText));
  }

  const rawHtml = htmlParts.join("");

  // Fix invalid HTML nesting (e.g. <b><i>...</b></i>).
  return fromHtml(rawHtml, { fragment: true });
}

export { messageToHast };

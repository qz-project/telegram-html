// Keep in sync with https://github.com/grammyjs/types

import type { MessageEntity } from "./message-entity.ts";

/**
 * Represents **partial** [Telegram message](https://core.telegram.org/bots/api#message).
 *
 * Only the following properties are relevant: `text`, `entities`, `caption`, and
 * `caption_entities`. Other properties are **ignored**.
 */
interface Message {
  /** The actual UTF-8 text of the message (for text messages) */
  text?: string;
  /** Special entities like usernames, URLs, bot commands, etc. in the text (for text messages) */
  entities?: MessageEntity[];
  /** Caption for media such as animation, audio, document, photo, video, or voice */
  caption?: string;
  /** Special entities like usernames, URLs, bot commands, etc. in the caption (for messages with a caption) */
  caption_entities?: MessageEntity[];
  // Allows for additional properties not explicitly defined.
  [key: string]: unknown;
}

export type { Message };

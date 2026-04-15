import type { MessageEntity } from "@grammyjs/types";

/** Represents **partial** [Telegram message](https://core.telegram.org/bots/api#message) */
interface Message {
  /** The actual UTF-8 text of the message */
  text?: string;
  /** Special entities like usernames, URLs, bot commands, etc. in the text */
  entities?: MessageEntity[];
  /** Caption for the animation, audio, document, paid media, photo, video or voice */
  caption?: string;
  /**
   * For messages with a caption, special entities like usernames, URLs, bot commands, etc. that
   * appear in the caption
   */
  caption_entities?: MessageEntity[];
  /** Other properties */
  [key: string]: unknown;
}

export type { Message };

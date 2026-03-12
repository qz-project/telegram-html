// Keep in sync with https://github.com/grammyjs/types

/**
 * Possible types of entities in a message.
 */
type EntityType =
  | "blockquote"
  | "bold"
  | "bot_command"
  | "cashtag"
  | "code"
  | "custom_emoji"
  | "date_time"
  | "email"
  | "expandable_blockquote"
  | "hashtag"
  | "italic"
  | "mention"
  | "phone_number"
  | "pre"
  | "spoiler"
  | "strikethrough"
  | "text_link"
  | "text_mention"
  | "underline"
  | "url";

/**
 * Base interface for all message entities.
 */
interface AbstractEntity {
  /**
   * Type of the entity.
   *
   * Possible values are:
   * - `blockquote`: Block quotation
   * - `bold`: Bold text
   * - `bot_command`: Bot command (e.g., /start@jobs_bot)
   * - `cashtag`: Cashtag (e.g., $USD)
   * - `code`: Monowidth string
   * - `custom_emoji`: Inline custom emoji stickers
   * - `date_time`: Formatted date and time
   * - `email`: Email address (e.g., do-not-reply@telegram.org)
   * - `expandable_blockquote`: Collapsed-by-default block quotation
   * - `hashtag`: Hashtag (e.g., #hashtag)
   * - `italic`: Italic text
   * - `mention`: Mention (e.g., \@username)
   * - `phone_number`: Phone number (e.g., +1-212-555-0123)
   * - `pre`: Monowidth block
   * - `spoiler`: Spoiler message
   * - `strikethrough`: Strikethrough text
   * - `text_link`: Clickable text URL
   * - `text_mention`: Mention for users without usernames
   * - `underline`: Underlined text
   * - `url`: URL (e.g., https://telegram.org)
   */
  type: EntityType;
  /** Offset in UTF-16 code units to the start of the entity. */
  offset: number;
  /** Length of the entity in UTF-16 code units. */
  length: number;
}

/**
 * Represents a formatted date and time entity.
 */
interface DateTimeEntity extends AbstractEntity {
  type: "date_time";
  /** For `date_time` only, the Unix time associated with the entity. */
  unix_time: number;
  /**
   * For `date_time` only, the string that defines the formatting of the date and time. See
   * [date-time entity formatting][1] for more details.
   *
   * [1]: https://core.telegram.org/bots/api#date-time-entity-formatting
   */
  date_time_format: "r" | `${"w" | ""}${"d" | "D" | ""}${"t" | "T" | ""}`;
}

/**
 * Represents a preformatted text entity.
 */
interface PreEntity extends AbstractEntity {
  type: Extract<EntityType, "pre">;
  /** Programming language of the preformatted text. */
  language?: string;
}

/**
 * Represents a text link entity.
 */
interface TextLinkEntity extends AbstractEntity {
  type: Extract<EntityType, "text_link">;
  /** URL to be opened after user taps on the text. */
  url: string;
}

/** Represents a Telegram user or bot. */
interface User {
  /** Unique identifier for this user or bot. */
  id: number;
  /** `true`, if this user is a bot */
  is_bot: boolean;
  /** User's or bot's first name */
  first_name: string;
  /** User's or bot's last name */
  last_name?: string;
  /** User's or bot's username */
  username?: string;
  /** [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) of the user's language */
  language_code?: string;
  /** `true`, if this user is a Telegram Premium user */
  is_premium?: true;
  /** `true`, if this user added the bot to the attachment menu */
  added_to_attachment_menu?: true;
}

/**
 * Represents a text mention entity.
 */
interface TextMentionEntity extends AbstractEntity {
  type: Extract<EntityType, "text_mention">;
  /** User mentioned in the text. */
  user: User;
}

/**
 * Represents a custom emoji entity.
 * @see https://telegram.org/blog/custom-emoji
 */
interface CustomEmojiEntity extends AbstractEntity {
  type: Extract<EntityType, "custom_emoji">;
  /**
   * Unique identifier of the custom emoji.
   * Use [getCustomEmojiStickers](https://core.telegram.org/bots/api#getcustomemojistickers) to get full information about the sticker.
   */
  custom_emoji_id: string;
}

/**
 * Represents a common (similar) entity type.
 */
interface CommonEntity extends AbstractEntity {
  type: Extract<
    EntityType,
    | "blockquote"
    | "bold"
    | "bot_command"
    | "cashtag"
    | "code"
    | "email"
    | "expandable_blockquote"
    | "hashtag"
    | "italic"
    | "mention"
    | "phone_number"
    | "spoiler"
    | "strikethrough"
    | "underline"
    | "url"
  >;
}

/**
 * Represents one special entity in a text message, such as hashtags, usernames,
 * URLs, etc.
 *
 * @link https://core.telegram.org/bots/api#messageentity.
 */
type MessageEntity =
  | CommonEntity
  | CustomEmojiEntity
  | DateTimeEntity
  | PreEntity
  | TextLinkEntity
  | TextMentionEntity;

export type { MessageEntity, User };

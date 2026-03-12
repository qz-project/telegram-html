import type { MessageEntity } from "./message-entity.ts";

interface HastToMessageOptions {
  /**
   * The prefix used for class names.
   *
   * By default, elements with a class name starting with `tg-` are identified as Telegram entities.
   * For example, an element with the class `tg-custom-emoji` will be converted into a
   * `custom_emoji` entity type.
   *
   * Change this option if you are using a different prefix, such as `telegram-`.
   *
   * @default "tg-"
   */
  classPrefix?: string;
  /**
   * Skip entities that the Telegram server detects automatically.
   *
   * When `true` (the default), entities like hashtags, URLs, emails, etc. are skipped. Telegram
   * parses these on its own, so sending them is not needed and only adds extra size.
   *
   * Set to `false` to include all entities.
   *
   * @default true
   */
  skipAutoEntities?: boolean;
}

interface HastToMessageResult {
  text: string;
  entities: MessageEntity[];
}

type MergedOptions = Readonly<Required<HastToMessageOptions>>;

type RenderElementResult =
  | { entity: MessageEntity | undefined }
  | { text: string; skipChildrenNode: true; entity: MessageEntity | undefined };

export type { HastToMessageOptions, HastToMessageResult, MergedOptions, RenderElementResult };

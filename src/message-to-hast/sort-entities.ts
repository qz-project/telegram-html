import type { MessageEntity } from "@grammyjs/types";
import type { Entity } from "$src/types/message-to-hast.ts";

/**
 * Priority definition for overlapping entities. Lower value = Higher priority
 * (Outer tag).
 *
 * https://github.com/tdlib/td/blob/e597838871547131ef92332fca601f5effba4e8a/td/telegram/MessageEntity.cpp#L69-L91
 * (Outdated) https://github.com/telegraf/entity/blob/5ec6c5ff5037c45d7a726aa2f4ba57401ad25ffc/mod.ts#L10C1-L30C3
 */
const TYPE_PRIORITY = {
  blockquote: 0,
  bold: 90,
  bot_command: 50,
  cashtag: 50,
  code: 20,
  custom_emoji: 99,
  date_time: 30,
  email: 50,
  expandable_blockquote: 0,
  hashtag: 50,
  italic: 91,
  mention: 50,
  phone_number: 50,
  pre: 11,
  spoiler: 94,
  strikethrough: 93,
  text_link: 49,
  text_mention: 49,
  underline: 92,
  url: 50,
} as const satisfies Record<MessageEntity["type"], number>;

/**
 * Sorts entities based on Telegram's rendering priority rules.
 *
 * WARNING: This function performs an in-place sort, mutating the original
 * array.
 */
function sortEntities(entities: Entity[]): void {
  entities.sort((a, b) => {
    // 1. Position: Ascending (earlier starts first)
    if (a.entity.offset !== b.entity.offset) {
      return a.entity.offset - b.entity.offset;
    }
    // 2. Length: Descending (longer (outer) starts first)
    if (a.entity.length !== b.entity.length) {
      return b.entity.length - a.entity.length;
    }
    // 3. Type Priority: Ascending value (lower number = higher priority/outer
    // Tag)
    return TYPE_PRIORITY[a.entity.type] - TYPE_PRIORITY[b.entity.type];
  });
}

export { sortEntities };

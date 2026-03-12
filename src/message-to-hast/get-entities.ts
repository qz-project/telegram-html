import type { ReadonlyDeep } from "type-fest";
import type { MessageEntity } from "@/types/message-entity.ts";
import type { WrapperEntity } from "@/types/message-to-hast.ts";
import type { Message } from "@/types/message.ts";

/**
 * Extracts entities and their corresponding text segments.
 */
function getEntities(msg: ReadonlyDeep<Message>, msgText: string): ReadonlyDeep<WrapperEntity>[] {
  const rawEntities: readonly ReadonlyDeep<MessageEntity>[] =
    msg.entities ?? msg.caption_entities ?? [];

  return rawEntities.map((entity) => ({
    entity,
    text: msgText.slice(entity.offset, entity.offset + entity.length),
  }));
}

export { getEntities };

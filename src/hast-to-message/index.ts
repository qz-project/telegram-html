import type { ReadonlyDeep } from "type-fest";
import { CONTINUE, SKIP, visit } from "unist-util-visit";
import type { Root } from "@/index.ts";
import type { HastToMessageOptions, MergedOptions } from "@/types/hast-to-message.ts";
import type { MessageEntity } from "@/types/message-entity.ts";
import type { Message } from "@/types/message.ts";
import { DEFAULT_OPTIONS } from "./default-options.ts";
import { renderElement } from "./render-element.ts";

/**
 * Converts [hast](https://github.com/syntax-tree/hast) into Telegram Message.
 */
// oxlint-disable-next-line typescript/prefer-readonly-parameter-types
function hastToMessage(hast: Root, options?: HastToMessageOptions): Message;
function hastToMessage(
  tree_: ReadonlyDeep<Root>,
  userOpt_?: ReadonlyDeep<HastToMessageOptions>,
): Message {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const tree = tree_ as Root;
  const options: MergedOptions = { ...DEFAULT_OPTIONS, ...userOpt_ };

  let text = "";
  const entities: MessageEntity[] = [];

  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types
  visit(tree, (node) => {
    // oxlint-disable-next-line typescript/switch-exhaustiveness-check
    switch (node.type) {
      case "element": {
        const result = renderElement({ node, offset: text.length, options });
        if (result.entity) {
          entities.push(result.entity);
        }
        if ("skipChildrenNode" in result) {
          text += result.text;
          return SKIP;
        }
        break;
      }
      case "text": {
        text += node.value;
        break;
      }
      default: {
        break;
      }
    }
    return CONTINUE;
  });

  return { entities, text };
}

export { hastToMessage };

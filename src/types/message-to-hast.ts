import type { ReadonlyDeep, RequiredDeep } from "type-fest";
import type { MarkerType } from "$src/message-to-hast/create-html-marker.ts";
import type { MessageEntity } from "./message-entity.ts";

type MergedOptions = ReadonlyDeep<RequiredDeep<MessageToHastOptions>>;
type DefaultOptions = ReadonlyDeep<RequiredDeep<MessageToHastOptions>>;

interface HtmlMarker {
  readonly type: MarkerType;
  readonly position: number;
  readonly wrapper: WrapperEntity;
  readonly id: number;
}

interface WrapperEntity {
  readonly text: string;
  readonly entity: ReadonlyDeep<MessageEntity>;
}

/**
 * Configuration options for `messageToHast`.
 */
interface MessageToHastOptions {
  /**
   * Option to add `class` attribute to the generated HTML.
   *
   * By default, the generated HTML is embedded with extra classes prefixed with `tg-` (or your
   * configured {@linkcode classPrefix}) to make it easy for you to select elements for CSS styling.
   *
   * When this is set to `false`, the `class` attribute will be removed from the generated HTML
   * tags.
   *
   * Since the class attribute is missing, some entities that are transformed into `span` tags will
   * be transformed into plain text instead since you cannot select those elements anyway.
   *
   * For example, `<b class="tg-bold">Hello</b> <span class="tg-hashtag">#hashtag</span>` will
   * become `<b>Hello</b> #hashtag`.
   *
   * This will significantly reduce the HTML size, but most entities cannot be transformed back into
   * Telegram entities because the required information is missing.
   *
   * If you set this to `false`, you may be interested in setting {@linkcode preserveEntityData} to
   * `false` too.
   *
   * @default true
   */
  withClass?: boolean;

  /**
   * Prefix for generated HTML class names.
   *
   * @default "tg-"
   */
  classPrefix?: string;

  /**
   * Preserve Telegram message entity data in HTML output.
   *
   * By default, generated HTML can't be fully converted back to Telegram entities. Set to `true` to
   * enable conversion, but note that HTML size will increase.
   *
   * @default false
   */
  preserveEntityData?: boolean;
}

type Entity = ReadonlyDeep<{
  /** The text content of the entity. */
  text: string;
  /** Message entity. */
  entity: MessageEntity;
}>;

export type {
  DefaultOptions,
  HtmlMarker,
  MergedOptions,
  MessageToHastOptions,
  WrapperEntity,
  Entity,
};

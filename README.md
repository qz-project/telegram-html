# telegram-html

[![npm Badge](https://img.shields.io/npm/v/telegram-html?label=&color=050619&style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOCAyOCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsbGVkYnk9ImFsM2VyeHB6YnN5YXhjbjE3cnJmeWs1N2I2YTl5eW8iIGNsYXNzPSJjc3MtMW5pMmpzYSI+PHRpdGxlIGlkPSJhbDNlcnhwemJzeWF4Y24xN3JyZnlrNTdiNmE5eXlvIj5ucG08L3RpdGxlPjxwYXRoIGQ9Ik0yNS45NDMgMEgyLjA1N0MuOTIgMCAwIC45MiAwIDIuMDU3djIzLjg4NkMwIDI3LjA4LjkyIDI4IDIuMDU3IDI4aDIzLjg4NkMyNy4wOCAyOCAyOCAyNy4wOCAyOCAyNS45NDNWMi4wNTdDMjggLjkyIDI3LjA4IDAgMjUuOTQzIDB6IiBmaWxsPSIjQ0IwMDAwIj48L3BhdGg+PHBhdGggZD0iTTUuOTY0IDIyLjM2NWg4LjA4MmwuMDEtMTIuMTAzaDQuMDMxbC0uMDEgMTIuMTEzaDQuMDQxbC4wMS0xNi4xNDNMNS45ODUgNi4yMWwtLjAyMSAxNi4xNTR6IiBmaWxsPSIjZmZmIj48L3BhdGg+PC9zdmc+)](https://www.npmjs.com/package/telegram-html)
[![GitHub Badge](https://img.shields.io/badge/Source-050619?style=for-the-badge&logo=github)](https://github.com/qz-project/telegram-html)

Convert [Telegram Bot API message][tg-msg] entity into HTML, or [hast][], and vice versa.

## Installation

```bash
# npm
npm install telegram-html

# pnpm
pnpm add telegram-html

# Bun
bun add telegram-html

# Deno
deno add npm:telegram-html
```

## Usage

### Convert Telegram Message to HTML

#### Example

```ts
messageToHtml(
  {
    text: "This is bold text",
    entities: [{ type: "bold", offset: 8, length: 9 }],
  },
  { preserveEntityData: true },
);
```

#### Output

```html
This is <b class="tg-bold">bold text</b>
```

#### API

```ts
function messageToHtml(message: Message, options?: MessageToHtmlOptions): string;
```

This function converts a [Telegram message][tg-msg] into a semantic HTML string. It returns HTML
string and accepts two arguments:

- **message** (required)

  The [Telegram message](tg-msg) to process.

- **options** (optional)

  Same options as [`messageToHast`](#convert-telegram-message-to-hast).

### Convert Telegram Message to hast

#### Example

```ts
messageToHast(
  {
    text: "This is bold text",
    entities: [{ type: "bold", offset: 8, length: 9 }],
  },
  { preserveEntityData: true },
);
```

#### Output

**Note:** Some irrelevant properties like [`position`][unist-node] and [`data`][unist-node] have
been omitted to keep it short.

```json
{
  "type": "root",
  "children": [
    {
      "type": "text",
      "value": "This is "
    },
    {
      "type": "element",
      "tagName": "b",
      "properties": {
        "className": ["tg-bold"]
      },
      "children": [
        {
          "type": "text",
          "value": "bold text"
        }
      ]
    }
  ]
}
```

#### API

```ts
function messageToHast(message: Message, options?: MessageToHastOptions): Root;
```

This function converts [Telegram message][tg-msg] into [hast][]. It returns
[hast Root](https://github.com/syntax-tree/hast?tab=readme-ov-file#root) and accepts two arguments:

- **message** (required)

  The [Telegram message](tg-msg) to process.

- **options** (optional)

  Configuration for the conversion. It has three options:
  - **`withClass`** (optional, boolean, default: `true`)

    Adds a class attribute to the generated HTML tags.

    By default, classes are prefixed with `tg-` (e.g., `tg-bold`, `tg-custom-emoji`). If set to
    `false`, classes are removed. Some entities (like hashtags) will become plain text because they
    cannot be styled without classes.

  - **`classPrefix`** (optional, string, default: `tg-`)

    The prefix used for the HTML class names.

  - **`preserveEntityData`** (optional, boolean, default: `false`)

    Preserve original [Telegram entity][tg-entity] data in the HTML.

    Set this to `true` if you need to convert the HTML back to [Telegram entity][tg-entity] later.

    **Note:** This increases the HTML size.

### Convert HTML to Telegram Message

#### Example

```ts
htmlToMessage("This is <b>bold text</b>", { skipAutoEntities: false });
```

#### Output

```json
{
  "text": "This is bold text",
  "entities": [{ "type": "bold", "offset": 8, "length": 9 }]
}
```

#### API

```ts
function htmlToMessage(html: string, options?: HtmlToMessageOptions): Message;
```

This function converts HTML into [Telegram message][tg-msg]. It returns [Telegram message][tg-msg]
and provides two parameters:

- **html** (required)

  The HTML string to process.

- **options** (optional)

  The configuration option. It has the exact same options as
  [hastToMessage](#convert-hast-to-telegram-message).

### Convert hast to Telegram Message

#### Example

```ts
hastToMessage(
  {
    type: "root",
    children: [
      { type: "text", value: "This is " },
      {
        type: "element",
        tagName: "b",
        properties: { className: ["telegram-bold"] },
        children: [{ type: "text", value: "bold text" }],
      },
    ],
  },
  { classPrefix: "telegram-", skipAutoEntities: false },
);
```

#### Output

```json
{
  "text": "This is bold text",
  "entities": [{ "type": "bold", "offset": 8, "length": 9 }]
}
```

#### API

```ts
function hastToMessage(hast: Root, options?: HastToMessageOptions): Message;
```

Converts [hast][] into a [Telegram message][tg-msg]. It returns [Telegram message][tg-msg] and
accepts two arguments:

- **hast** (required)

  The [hast][hast] to process.

- **options** (optional)

  Configuration for the conversion. It has two options:
  - **`classPrefix`** (optional, string, default: `tg-`)

    The prefix used to identify [Telegram entity][tg-entity].

    By default, elements with a class name starting with `tg-` are identified as [Telegram
    entity][tg-entity]. For example, an element with the class `tg-custom-emoji` will be converted
    into a `custom_emoji` entity type.

    Change this option if you are using a different prefix, such as `telegram-`.

- **`skipAutoEntities`** (optional, boolean, default to `true`)

  Skip entities that the Telegram server detects automatically.

  When `true` (the default), entities like hashtags, URLs, emails, etc. are skipped. Telegram parses
  these on its own, so sending them is not needed and only adds extra size.

  Set to `false` to include all entities.

## FAQ

### How to convert a Telegram Message into Markdown and vice versa?

`telegram-html` does not provide a way to convert [Telegram Message][tg-msg] into Markdown.

However, since HTML is widely supported, you can use
[`messageToHtml`](#convert-telegram-message-to-html) to convert the [Telegram Message][tg-msg] into
HTML first, then convert HTML to Markdown using third-party package and vice versa.

### How to modify the output?

`telegram-html` provides conversion to [hast][]. That way, it brings you the flexibility to modify
them.

After you are done, you can convert the [hast][] into HTML using
[`toHtml`](https://github.com/syntax-tree/hast-util-to-html), or into a [Telegram message][tg-msg]
using [`hastToMessage`](#convert-hast-to-telegram-message).

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

[MIT](./LICENSE)

[hast]: https://github.com/syntax-tree/hast
[tg-msg]: https://core.telegram.org/bots/api#message
[tg-entity]: https://core.telegram.org/bots/api#messageentity
[unist-node]: https://github.com/syntax-tree/unist?tab=readme-ov-file#node

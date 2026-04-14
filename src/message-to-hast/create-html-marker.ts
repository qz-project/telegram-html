import type { ReadonlyDeep } from "type-fest";
import type { HtmlMarker, WrapperEntity } from "$src/types/message-to-hast.ts";

enum MarkerType {
  START = -1,
  END = 1,
}

/** Converts entities into a flat list of start and end markers. */
function createHtmlMarkers(
  entities: readonly WrapperEntity[],
): readonly ReadonlyDeep<HtmlMarker>[] {
  const markers: HtmlMarker[] = [];

  const { length } = entities;
  for (let i = 0; i < length; i++) {
    const wrapper = entities[i];

    markers.push(
      // Start marker.
      {
        id: i,
        position: wrapper.entity.offset,
        type: MarkerType.START,
        wrapper,
      },
      // End marker.
      {
        id: i,
        position: wrapper.entity.offset + wrapper.entity.length,
        type: MarkerType.END,
        wrapper,
      },
    );
  }

  return markers.toSorted((a, b) => {
    // Sort by position (asc).
    if (a.position !== b.position) {
      return a.position - b.position;
    }

    // Sort by type (ends before starts).
    if (a.type !== b.type) {
      return b.type - a.type;
    }

    // Then ID (asc for "start" type, desc for "end" type).
    return a.type === MarkerType.START ? a.id - b.id : b.id - a.id;
  });
}

export { createHtmlMarkers, MarkerType };

import type { Pattern } from "./types.ts";
import { stripsHTML } from "./strips.ts";

/** Strips on the brand colour. The renderer sets the ground to the accent. */
export const stripsBrand: Pattern = {
  id: "strips-brand",
  unavailable: ({ m }) => (m.full?.length ? null : "no full-page capture"),
  render: stripsHTML,
};

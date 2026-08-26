/**
 * Every call-to-action on the site wears the same pill: fully rounded, small
 * type, and padding tight enough that the label carries it rather than the
 * box. Kept here so the shape stays in step across pages instead of drifting
 * per section.
 */
const BUTTON_BASE =
  "inline-block rounded-full px-6 py-3 text-sm font-medium transition-colors";

/** Brand green — the default for anything asking the visitor to act. */
export const BUTTON_PRIMARY = `${BUTTON_BASE} bg-[#398561] text-white hover:bg-[#45a074]`;

/** White on dark — for pills sitting inside an already-green or photo panel. */
export const BUTTON_LIGHT = `${BUTTON_BASE} bg-white text-black hover:bg-gray-200`;

// X/Twitter reads its own tag when one is present. Reusing the Open Graph
// image emits `twitter:image` explicitly rather than relying on every crawler
// falling back to `og:image`.
export { alt, contentType, default, size } from "./opengraph-image";

// Declared here rather than re-exported: Next parses route segment config
// statically, so it has to be a literal in this file.
export const dynamic = "force-static";

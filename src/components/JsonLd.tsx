/**
 * Emits a Schema.org block as JSON-LD.
 *
 * JSON-LD has to reach the crawler in the server-rendered HTML, so this stays
 * a server component and writes the script tag directly. The payload is built
 * from our own constants, never from user input, and `JSON.stringify` escaping
 * is hardened below for the one sequence that could break out of the tag.
 */
export default function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD has no React-safe equivalent: a text child would be
      // HTML-escaped and the block would stop parsing as JSON. The payload is
      // built from our own compile-time constants, never from request or user
      // input. The one sequence that could break out of the tag is a literal
      // "</script>" inside a string value, and escaping "<" defuses it while
      // keeping the JSON valid.
      // biome-ignore lint/security/noDangerouslySetInnerHtml: required for JSON-LD; payload is trusted and escaped
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

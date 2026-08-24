import { ImageResponse } from "next/og";
import { PARENT_ORGANIZATION, SITE_TAGLINE } from "@/lib/site";

// Applies to every route that does not define its own image, so one file
// covers the whole site.
export const alt = `RIVAL ITS — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generated at build time rather than shipped as a static file, so the card
// never drifts out of sync with the brand copy in `lib/site`.
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "96px",
        background: "#121317",
        // A wash of the brand green off the top-left keeps the card from
        // reading as a plain black rectangle in a crowded social feed.
        backgroundImage:
          "radial-gradient(circle at 0% 0%, #398561 0%, rgba(57,133,97,0) 55%)",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 168,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        RIVAL ITS
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 54,
          color: "rgba(255,255,255,0.82)",
          lineHeight: 1.2,
        }}
      >
        {SITE_TAGLINE}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 56,
          alignItems: "center",
          fontSize: 32,
          color: "#5fbf8d",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 14,
            height: 14,
            borderRadius: 999,
            background: "#398561",
            marginRight: 20,
          }}
        />
        {PARENT_ORGANIZATION}
      </div>
    </div>,
    size,
  );
}

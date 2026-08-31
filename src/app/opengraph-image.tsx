import fs from "node:fs";
import path from "node:path";
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

/**
 * Satori has no filesystem or network access while it rasterises, so both
 * assets have to be inlined as data URIs. They live in `_og/`: an
 * underscore-prefixed folder is a private folder to the app router, so the
 * files are never routed and never copied into the export.
 *
 * The backdrop is pre-cropped to exactly 1200x630 and the logo is a
 * transparent PNG — satori decodes neither webp nor an off-size crop — so
 * nothing has to be resized at render time.
 */
function inline(file: string, mime: string): string {
  const bytes = fs.readFileSync(path.join(process.cwd(), "src/app/_og", file));
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

const BACKDROP = inline("backdrop.jpg", "image/jpeg");
const LOGO = inline("logo.png", "image/png");

/** One full-bleed overlay stacked on top of the photo. */
const layer = (background: string) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: size.width,
      height: size.height,
      display: "flex",
      ...(background.startsWith("linear-gradient")
        ? { backgroundImage: background }
        : { background }),
    }}
  />
);

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0f12",
      }}
    >
      {/* The rover photo, faded back by the layers below it so it reads as
          texture — the logo is the subject of the card, not the rover.
          Every fade is a linear-gradient on purpose: satori draws
          radial-gradient with its alpha channel thrown away, so an rgba()
          radial comes out as a flat opaque rectangle that hides the photo
          completely. */}
      {/* biome-ignore lint/performance/noImgElement: satori rasterises this,
          next/image has no meaning here */}
      <img
        src={BACKDROP}
        alt=""
        width={size.width}
        height={size.height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
        }}
      />
      {/* Flat scrim: drops the photo to a whisper so white type stays legible
          wherever it lands. */}
      {layer("rgba(13,15,18,0.7)")}
      {/* Top and bottom fade to solid, so the card has no visible photo edge. */}
      {layer(
        "linear-gradient(180deg, #0d0f12 0%, rgba(13,15,18,0.2) 40%, rgba(13,15,18,0.5) 70%, rgba(13,15,18,0.96) 100%)",
      )}
      {/* Same on the sides, weighted right — that is where the rover's white
          body sits, and it would otherwise fight the logo for attention. */}
      {layer(
        "linear-gradient(90deg, #0d0f12 0%, rgba(13,15,18,0.12) 26%, rgba(13,15,18,0.18) 58%, rgba(13,15,18,0.6) 86%, #0d0f12 100%)",
      )}
      {/* A wash of the brand green off the top-left keeps the card from
          reading as a plain black rectangle in a crowded social feed. */}
      {layer(
        "linear-gradient(135deg, rgba(57,133,97,0.5) 0%, rgba(57,133,97,0) 42%)",
      )}

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 2602x723 in the source; 640 wide keeps that ratio. */}
        {/* biome-ignore lint/performance/noImgElement: satori rasterises this,
            next/image has no meaning here */}
        <img src={LOGO} alt="RIVAL ITS" width={640} height={178} />
        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 46,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 30,
            alignItems: "center",
            fontSize: 28,
            color: "#5fbf8d",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#398561",
              marginRight: 18,
            }}
          />
          {PARENT_ORGANIZATION}
        </div>
      </div>
    </div>,
    size,
  );
}

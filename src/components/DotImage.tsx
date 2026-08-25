"use client";

import { useCallback, useEffect, useRef } from "react";

type Props = {
  /** Source artwork. Needs a transparent background — alpha drives the dots. */
  src: string;
  /** Described by the surrounding copy, so this is decorative by default. */
  alt?: string;
  className?: string;
  /** Dot colours, cycled by a positional hash so the mix stays stable. */
  palette?: { body: string[]; edge: string[] };
};

/** Longest edge of the sampling buffer. Bigger reads finer, costs more. */
const SAMPLE_SIZE = 720;
/** Alpha (0-255) a source pixel needs before it earns a dot. */
const ALPHA_FLOOR = 28;
/** Grid pitch in CSS pixels: the smaller, the denser the stipple. */
const PITCH = 4;
/** Share of the box left empty around the artwork. */
const INSET = 0.06;

/**
 * Source luminance below this reads as a drawn edge rather than a lit face.
 * The render is pale panels separated by dark outlines, so this splits the
 * artwork into its silhouette and its interior.
 */
const EDGE_CUT = 0.55;

/**
 * Hues and how often each should turn up. Colours are picked by an even hash
 * over the palette, so weighting is just repetition. Blue carries the interior
 * and the warm accents ride the edges, which is what gives the stipple its
 * sense of a lit, three-dimensional object.
 */
const BODY_HUES: [color: string, weight: number][] = [
  ["#3f79d6", 6], // blue
  ["#4a90e2", 4], // brighter blue
  ["#2f5cb3", 3], // deep blue
  ["#6aa9ee", 2], // pale blue
  ["#4fbf87", 1], // green
];

const EDGE_HUES: [color: string, weight: number][] = [
  ["#f2c14e", 5], // yellow
  ["#ef8fae", 4], // pink
  ["#8fb8f0", 3], // pale blue
  ["#9b6fd6", 1], // purple
  ["#4fbf87", 1], // green
];

const weighted = (hues: [string, number][]) =>
  hues.flatMap(([color, weight]) =>
    Array.from({ length: weight }, () => color),
  );

const DEFAULT_PALETTE = {
  body: weighted(BODY_HUES),
  edge: weighted(EDGE_HUES),
};

/**
 * Deterministic 0-1 noise from a grid cell. Math.random would reshuffle every
 * dot on each resize, which reads as flicker rather than as the same artwork.
 */
function hashNoise(x: number, y: number, salt: number): number {
  let h = (x * 374761393 + y * 668265263 + salt * 2246822519) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

/** A four-pointed spark — the dot shape the reference artwork uses. */
function spark(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const waist = r * 0.28;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x + waist, y - waist, x + r, y);
  ctx.quadraticCurveTo(x + waist, y + waist, x, y + r);
  ctx.quadraticCurveTo(x - waist, y + waist, x - r, y);
  ctx.quadraticCurveTo(x - waist, y - waist, x, y - r);
  ctx.fill();
}

/**
 * Redraws an image as a field of coloured dots on a canvas. The source is
 * sampled once, cropped to its opaque bounding box, then stippled to fit the
 * element — so the artwork fills the frame no matter how much empty margin the
 * original file carries.
 */
export default function DotImage({
  src,
  alt = "",
  className,
  palette = DEFAULT_PALETTE,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Sampled alpha map of the source, kept across resizes. */
  const sampleRef = useRef<{
    alpha: Uint8ClampedArray;
    /** Per-pixel luminance, used to tell drawn edges from lit faces. */
    luma: Uint8ClampedArray;
    width: number;
    height: number;
    /** Opaque bounds within the sample, in sample pixels. */
    box: { x: number; y: number; width: number; height: number };
  } | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const sample = sampleRef.current;
    if (!canvas || !sample) return;

    const { clientWidth: cssWidth, clientHeight: cssHeight } = canvas;
    if (cssWidth === 0 || cssHeight === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const { alpha, luma, width: sw, box } = sample;

    // Contain the opaque bounds inside the inset frame.
    const frameW = cssWidth * (1 - INSET * 2);
    const frameH = cssHeight * (1 - INSET * 2);
    const scale = Math.min(frameW / box.width, frameH / box.height);
    const drawnW = box.width * scale;
    const drawnH = box.height * scale;
    const originX = (cssWidth - drawnW) / 2;
    const originY = (cssHeight - drawnH) / 2;

    for (let y = 0; y < drawnH; y += PITCH) {
      for (let x = 0; x < drawnW; x += PITCH) {
        const sx = Math.round(box.x + x / scale);
        const sy = Math.round(box.y + y / scale);
        const index = sy * sw + sx;
        const a = alpha[index];
        if (a < ALPHA_FLOOR) continue;

        const gx = Math.round(x / PITCH);
        const gy = Math.round(y / PITCH);
        const coverage = a / 255;
        const isEdge = luma[index] / 255 < EDGE_CUT;

        // Faces thin out so the interior stays airy; edges keep nearly every
        // dot, which is what holds the silhouette together.
        const keep = isEdge ? 0.92 : coverage * 0.45 + 0.3;
        if (hashNoise(gx, gy, 1) > keep) continue;

        const jitter = PITCH * 0.45;
        const px = originX + x + (hashNoise(gx, gy, 2) - 0.5) * jitter;
        const py = originY + y + (hashNoise(gx, gy, 3) - 0.5) * jitter;

        const hues = isEdge ? palette.edge : palette.body;
        const tint = hashNoise(gx, gy, 4);
        ctx.fillStyle = hues[Math.floor(tint * hues.length) % hues.length];
        ctx.globalAlpha = isEdge
          ? 0.85 + hashNoise(gx, gy, 6) * 0.15
          : 0.4 + coverage * 0.35;
        spark(
          ctx,
          px,
          py,
          PITCH * ((isEdge ? 0.36 : 0.3) + hashNoise(gx, gy, 5) * 0.3),
        );
      }
    }
    ctx.globalAlpha = 1;
  }, [palette]);

  useEffect(() => {
    let cancelled = false;
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = src;

    const sampleImage = () => {
      if (cancelled) return;
      const ratio = SAMPLE_SIZE / Math.max(image.width, image.height);
      const sw = Math.max(1, Math.round(image.width * Math.min(ratio, 1)));
      const sh = Math.max(1, Math.round(image.height * Math.min(ratio, 1)));

      const buffer = document.createElement("canvas");
      buffer.width = sw;
      buffer.height = sh;
      const bufferCtx = buffer.getContext("2d", { willReadFrequently: true });
      if (!bufferCtx) return;
      bufferCtx.drawImage(image, 0, 0, sw, sh);

      const { data } = bufferCtx.getImageData(0, 0, sw, sh);
      const alpha = new Uint8ClampedArray(sw * sh);
      const luma = new Uint8ClampedArray(sw * sh);
      let minX = sw;
      let minY = sh;
      let maxX = -1;
      let maxY = -1;
      for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
        const a = data[i + 3];
        alpha[p] = a;
        luma[p] =
          0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        if (a < ALPHA_FLOOR) continue;
        const x = p % sw;
        const y = (p - x) / sw;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }

      // A fully transparent (or fully opaque) source still needs a valid box.
      const box =
        maxX < minX || maxY < minY
          ? { x: 0, y: 0, width: sw, height: sh }
          : {
              x: minX,
              y: minY,
              width: maxX - minX + 1,
              height: maxY - minY + 1,
            };

      sampleRef.current = { alpha, luma, width: sw, height: sh, box };
      draw();
    };

    if (image.complete && image.naturalWidth > 0) sampleImage();
    else image.onload = sampleImage;

    return () => {
      cancelled = true;
      image.onload = null;
    };
  }, [src, draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => draw());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role={alt ? "img" : "presentation"}
      aria-label={alt || undefined}
    />
  );
}

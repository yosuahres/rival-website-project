import type { NextConfig } from "next";

// Long-lived immutable caching for static assets in /public.
// NOTE: these files are cached for a year by browsers/CDNs, so when you
// replace one you must also change its filename (e.g. videoprofil-v2.mp4)
// otherwise visitors keep serving the old copy from their cache.
const IMMUTABLE = "public, max-age=31536000, s-maxage=31536000, immutable";

// Baseline hardening applied to every response.
const SECURITY_HEADERS = [
  // Stop browsers from MIME-sniffing a response into an executable type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only same-origin pages may frame us, which blocks clickjacking.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Send the full URL to ourselves, only the origin to third parties.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // We never ask for these, so deny them outright.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Cache rendered pages in the client-side Router Cache so navigating
  // back to the home page doesn't remount/refetch the whole tree.
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        source: "/videos/:path*",
        headers: [
          { key: "Cache-Control", value: IMMUTABLE },
          // Lets browsers range-request the video instead of pulling it whole.
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
      {
        source: "/:dir(images|archive)/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE }],
      },
    ];
  },
  images: {
    unoptimized: true,
    // Cache optimized images for a year instead of the 4h default.
    minimumCacheTTL: 31536000,
    // Next 16 only serves qualities named here (default [75]); 50 is for the
    // decorative competition backdrops that sit under a heavy overlay.
    qualities: [50, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "**supabase.in",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
};

export default nextConfig;

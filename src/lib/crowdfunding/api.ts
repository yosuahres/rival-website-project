import { withBasePath } from "@/lib/base-path";

/**
 * Builds the URL for one of the crowdfunding route handlers.
 *
 * Two things `fetch` will not do for us: it knows nothing about `basePath`,
 * and with `trailingSlash: true` Next answers `/api/x` with a 308 to
 * `/api/x/`. Folding both in here keeps every call a single hop, which
 * matters for the multipart proof upload — a redirected request has to
 * replay a body that has already been consumed.
 */
export function apiUrl(path: string, params?: Record<string, string>): string {
  const query = params ? `?${new URLSearchParams(params)}` : "";
  return `${withBasePath(path.replace(/\/?$/, "/"))}${query}`;
}

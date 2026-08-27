export default function imageLoader({ src }: { src: string }): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return src.startsWith("/") ? `${basePath}${src}` : src;
}

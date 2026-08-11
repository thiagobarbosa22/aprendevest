const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
]);

/**
 * Extracts a YouTube video id from a watch/short/embed/youtu.be URL.
 * Returns null for anything that isn't a recognizable YouTube video URL,
 * so callers never embed an untrusted or malformed src.
 */
export function toYoutubeVideoId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (!YOUTUBE_HOSTS.has(parsed.hostname)) return null;

  if (parsed.hostname === "youtu.be") {
    const id = parsed.pathname.slice(1).split("/")[0];
    return id || null;
  }
  if (parsed.pathname === "/watch") {
    return parsed.searchParams.get("v");
  }
  const embedMatch = parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/);
  return embedMatch?.[1] ?? null;
}

export function toYoutubeEmbedUrl(url: string): string | null {
  const id = toYoutubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

export function toYoutubeThumbnailUrl(url: string): string | null {
  const id = toYoutubeVideoId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

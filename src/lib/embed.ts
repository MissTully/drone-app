const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/

export function youtubeNocookieEmbedUrl(videoId: string): string | null {
  if (!YOUTUBE_ID_PATTERN.test(videoId)) return null
  return `https://www.youtube-nocookie.com/embed/${videoId}`
}

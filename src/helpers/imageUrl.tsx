import request from "../services/request";

export function buildImageUrl(photoUrl?: string | null) {
  if (!photoUrl) return null;

  if (photoUrl.startsWith("http")) return photoUrl;

  const origin = request.defaults.baseURL?.replace(/\/api\/v1\/?$/, "");
  return `${origin}${photoUrl}`;
}

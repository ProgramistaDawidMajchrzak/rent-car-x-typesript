export function toApiError(error, fallback = "Request failed.") {
  const detail =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.response?.data?.title;

  if (detail) return new Error(detail);

  const errors = error?.response?.data?.errors;
  if (errors && typeof errors === "object") {
    const firstKey = Object.keys(errors)[0];
    const firstMsg = Array.isArray(errors[firstKey]) ? errors[firstKey][0] : errors[firstKey];
    if (firstMsg) return new Error(firstMsg);
  }

  return new Error(fallback);
}

export function extractJwtToken(data) {
  if (!data) return null;
  if (typeof data === "string") return data;
  return data.jwtToken || data.token || data.accessToken || null;
}

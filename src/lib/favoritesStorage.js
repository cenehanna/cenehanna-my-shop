export const FAVORITES_KEY = "favorites";
export const FAVORITES_UPDATED_EVENT = "favorite-updated";

export function parseFavoriteIds(raw = "[]") {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return [
      ...new Set(parsed.map((id) => String(id).trim()).filter(Boolean)),
    ];
  } catch {
    return [];
  }
}

export function readFavoriteIds() {
  if (typeof window === "undefined") return [];
  return parseFavoriteIds(localStorage.getItem(FAVORITES_KEY) || "[]");
}

export function writeFavoriteIds(ids) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(parseFavoriteIds(JSON.stringify(ids))),
  );
  window.dispatchEvent(new Event(FAVORITES_UPDATED_EVENT));
}

"use client";

import { useState, useEffect } from "react";
import {
  FAVORITES_UPDATED_EVENT,
  readFavoriteIds,
  writeFavoriteIds,
} from "@/lib/favoritesStorage";
import { useStorageSync } from "@/hooks/useStorageSync";

export function useFavorite(productId) {
  const [isFavorite, setIsFavorite] = useState(false);
  const normalizedProductId = productId ? String(productId) : null;

  useStorageSync(() => {
    if (!normalizedProductId) return;
    setIsFavorite(readFavoriteIds().includes(normalizedProductId));
  }, FAVORITES_UPDATED_EVENT);

  const toggleFavorite = (e) => {
    if (e) e.stopPropagation();
    if (!normalizedProductId) return;

    try {
      const savedFavorites = readFavoriteIds();
      const updatedFavorites = isFavorite
        ? savedFavorites.filter((id) => id !== normalizedProductId)
        : [...savedFavorites, normalizedProductId];

      writeFavoriteIds(updatedFavorites);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Помилка збереження favorites:", error);
    }
  };

  return { isFavorite, toggleFavorite };
}

"use server";

import prisma from "@/lib/prisma";
import {
  orderProductsByIds,
  productCardSelect,
  toProductCardData,
} from "@/lib/productSelect";
import { parseFavoriteIds } from "@/lib/favoritesStorage";

export async function getProductsByIds(ids) {
  const normalizedIds = parseFavoriteIds(JSON.stringify(ids ?? []));
  if (normalizedIds.length === 0) {
    return [];
  }

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: normalizedIds } },
      select: productCardSelect,
    });

    return orderProductsByIds(products, normalizedIds).map(toProductCardData);
  } catch (error) {
    console.error("Помилка завантаження товарів за ID:", error);
    return [];
  }
}

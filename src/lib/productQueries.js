import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { productCardSelect, toProductCardData } from "@/lib/productSelect";

const FIVE_MINUTES = 300;

export function getProductListOrderBy(sort) {
  if (sort === "price-asc") return { price: "asc" };
  if (sort === "price-desc") return { price: "desc" };
  return { createdAt: "desc" };
}

export const getHomeNewArrivals = unstable_cache(
  async () => {
    const products = await prisma.product.findMany({
      where: { parentId: null },
      select: productCardSelect,
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    return products.map(toProductCardData);
  },
  ["home-new-arrivals"],
  { revalidate: FIVE_MINUTES, tags: ["products"] },
);

export const getLatestProducts = unstable_cache(
  async (limit = 21) => {
    const products = await prisma.product.findMany({
      where: { parentId: null },
      select: productCardSelect,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return products.map(toProductCardData);
  },
  ["latest-products-catalog"],
  { revalidate: FIVE_MINUTES, tags: ["products"] },
);

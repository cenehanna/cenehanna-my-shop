import { unstable_cache } from "next/cache";
import { collectDescendantCategoryIds } from "@/lib/categoryTree";
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

export const getHeroProductColumns = unstable_cache(
  async () => {
    const [categories, categoryProductCounts] = await Promise.all([
      prisma.category.findMany({
        select: { id: true, name: true, slug: true, parentId: true },
      }),
      prisma.product.groupBy({
        by: ["categoryId"],
        where: { parentId: null },
        _count: { _all: true },
      }),
    ]);

    const productCountsByCategoryId = new Map(
      categoryProductCounts.map(({ categoryId, _count }) => [
        categoryId,
        _count._all,
      ]),
    );

    const rootCategories = categories
      .filter((category) => !category.parentId)
      .map((category) => {
        const descendantIds = collectDescendantCategoryIds(
          categories,
          category.id,
        );
        const productCount = descendantIds.reduce(
          (total, id) => total + (productCountsByCategoryId.get(id) ?? 0),
          0,
        );

        return { ...category, descendantIds, productCount };
      })
      .filter((category) => category.productCount > 0)
      .sort(
        (a, b) =>
          b.productCount - a.productCount || a.name.localeCompare(b.name),
      )
      .slice(0, 3);

    return Promise.all(
      rootCategories.map(async (category) => {
        const products = await prisma.product.findMany({
          where: {
            parentId: null,
            categoryId: { in: category.descendantIds },
          },
          select: productCardSelect,
          orderBy: [{ createdAt: "desc" }, { articleId: "desc" }],
          take: 10,
        });

        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          products: products.map(toProductCardData),
        };
      }),
    );
  },
  ["hero-product-columns"],
  { revalidate: FIVE_MINUTES, tags: ["products", "categories"] },
);

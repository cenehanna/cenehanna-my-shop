import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

const ONE_HOUR = 3600;

export const getAllCategoriesFlat = unstable_cache(
  async () =>
    prisma.category.findMany({
      select: { id: true, name: true, slug: true, parentId: true },
      orderBy: { name: "asc" },
    }),
  ["categories-flat"],
  { revalidate: ONE_HOUR, tags: ["categories"] },
);

export const getHeaderCategories = unstable_cache(
  async () => {
    try {
      return await prisma.category.findMany({
        where: {
          parentId: null,
          children: { some: {} },
        },
        include: {
          children: {
            select: {
              id: true,
              name: true,
              slug: true,
              children: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  _count: { select: { products: true } },
                },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      });
    } catch (error) {
      console.error("Помилка завантаження категорій для хедера:", error);
      return [];
    }
  },
  ["categories-header"],
  { revalidate: ONE_HOUR, tags: ["categories"] },
);

export const getCatalogFilterCategories = unstable_cache(
  async () =>
    prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { name: "asc" },
    }),
  ["categories-catalog-filters"],
  { revalidate: ONE_HOUR, tags: ["categories"] },
);

export const getFeaturedCategoriesWithImages = unstable_cache(
  async (limit = 5) => {
    try {
      const rootCategories = await prisma.category.findMany({
        where: { parentId: null },
        take: limit,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });

      if (!rootCategories.length) return [];

      const allCategories = await prisma.category.findMany({
        select: { id: true, parentId: true },
      });

      const categoriesByParentId = new Map();
      for (const cat of allCategories) {
        const pId = cat.parentId ?? null;
        const list = categoriesByParentId.get(pId) ?? [];
        list.push(cat.id);
        categoriesByParentId.set(pId, list);
      }

      function getDescendantIds(rootId) {
        const ids = [rootId];
        const queue = [rootId];
        while (queue.length > 0) {
          const current = queue.shift();
          const children = categoriesByParentId.get(current) ?? [];
          for (const childId of children) {
            if (!ids.includes(childId)) {
              ids.push(childId);
              queue.push(childId);
            }
          }
        }
        return ids;
      }

      return await Promise.all(
        rootCategories.map(async (cat) => {
          const familyCategoryIds = getDescendantIds(cat.id);
          const firstProduct = await prisma.product.findFirst({
            where: {
              categoryId: { in: familyCategoryIds },
            },
            orderBy: { createdAt: "asc" },
            select: { images: true },
          });

          return {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            image: firstProduct?.images?.[0] || "/placeholder.svg",
          };
        }),
      );
    } catch (error) {
      console.error("Error fetching featured categories:", error);
      return [];
    }
  },
  ["featured-categories-home"],
  { revalidate: ONE_HOUR, tags: ["categories", "products"] },
);

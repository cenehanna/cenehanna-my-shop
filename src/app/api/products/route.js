import { NextResponse } from "next/server";
import { getAllCategoriesFlat } from "@/lib/categoryQueries";
import {
  collectDescendantCategoryIds,
  resolveCategoryByPath,
} from "@/lib/categoryTree";
import prisma from "@/lib/prisma";
import { getProductListOrderBy } from "@/lib/productQueries";
import { productCardSelect, toProductCardData } from "@/lib/productSelect";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const limit = Math.min(
    Number.parseInt(searchParams.get("limit") || "20", 10),
    50,
  );
  const sort = searchParams.get("sort") || "newest";
  const excludeId = searchParams.get("excludeId");
  const categoryPath =
    searchParams.get("categoryPath")?.split("/").filter(Boolean) ?? [];

  const orderBy = getProductListOrderBy(sort);
  const skip = (page - 1) * limit;
  let categoryIds;

  if (categoryPath.length > 0) {
    const categories = await getAllCategoriesFlat();
    const selectedCategory = resolveCategoryByPath(categories, categoryPath);

    if (!selectedCategory) {
      return NextResponse.json({ products: [], hasMore: false });
    }

    categoryIds = collectDescendantCategoryIds(categories, selectedCategory.id);
  }

  const where = {
    parentId: null,
    ...(categoryIds ? { categoryId: { in: categoryIds } } : {}),
    ...(excludeId ? { id: { not: excludeId } } : {}),
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      select: productCardSelect,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json(
    {
      products: products.map(toProductCardData),
      hasMore: skip + products.length < totalCount,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}

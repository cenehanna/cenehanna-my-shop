import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ScrollToTopBtn from "@/components/ui/ScrollToTop/ScrollToTop";
import { getBreadcrumbItems } from "@/lib/breadcrumbs";
import { getAllCategoriesFlat } from "@/lib/categoryQueries";
import {
  buildCatalogFilterCategories,
  buildCategoryWithParents,
  collectDescendantCategoryIds,
  resolveCategoryByPath,
} from "@/lib/categoryTree";
import prisma from "@/lib/prisma";
import { getProductListOrderBy } from "@/lib/productQueries";
import { productCardSelect, toProductCardData } from "@/lib/productSelect";
import styles from "../catalog.module.css";
import FilterPanel from "../FilterPanel/FilterPanel";
import ProductGrid from "../ProductGrid/ProductGrid";

const PRODUCTS_PER_DESKTOP_ROW = 3;
const DESKTOP_ROWS_PER_PAGE = 6;
const PRODUCT_LIMIT = PRODUCTS_PER_DESKTOP_ROW * DESKTOP_ROWS_PER_PAGE;

function parsePrice(value) {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : undefined;
}

async function getProducts(
  sort,
  categoryPath,
  flatCategories,
  page,
  minPrice,
  maxPrice,
  colors,
) {
  const orderBy = getProductListOrderBy(sort);
  let categoryIds;

  if (categoryPath.length > 0) {
    const selectedCategory = resolveCategoryByPath(
      flatCategories,
      categoryPath,
    );
    if (!selectedCategory)
      return { products: [], totalCount: 0, totalPages: 0 };

    categoryIds = collectDescendantCategoryIds(
      flatCategories,
      selectedCategory.id,
    );
  }

  const where = {
    parentId: null,
    ...(categoryIds ? { categoryId: { in: categoryIds } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
      : {}),
    ...(colors.length > 0
      ? { colourGroupName: { in: colors } }
      : {}),
  };
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      select: productCardSelect,
      orderBy,
      skip: (page - 1) * PRODUCT_LIMIT,
      take: PRODUCT_LIMIT,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(toProductCardData),
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / PRODUCT_LIMIT)),
  };
}

export default async function CatalogPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const categoryPath = resolvedParams?.slug ?? [];
  const sort = resolvedSearchParams?.sort || "newest";
  const minPrice = parsePrice(resolvedSearchParams?.minPrice);
  const maxPrice = parsePrice(resolvedSearchParams?.maxPrice);
  const colors = Array.isArray(resolvedSearchParams?.color)
    ? resolvedSearchParams.color
    : resolvedSearchParams?.color
      ? [resolvedSearchParams.color]
      : [];
  const currentPage = Math.max(
    1,
    Number.parseInt(resolvedSearchParams?.page || "1", 10) || 1,
  );

  const [flatCategories, colorOptions] = await Promise.all([
    getAllCategoriesFlat(),
    prisma.product.findMany({
      where: { parentId: null },
      distinct: ["colourGroupName"],
      select: { colourGroupName: true },
      orderBy: { colourGroupName: "asc" },
    }),
  ]);
  const availableColors = colorOptions
    .map(({ colourGroupName }) => ({
      value: colourGroupName,
      label: colourGroupName.trim(),
    }))
    .filter(({ label }) => label);
  const filterCategories = buildCatalogFilterCategories(flatCategories);
  const { products, totalCount, totalPages } = await getProducts(
    sort,
    categoryPath,
    flatCategories,
    currentPage,
    minPrice,
    maxPrice,
    colors,
  );

  const selectedCategory = resolveCategoryByPath(flatCategories, categoryPath);
  const category = selectedCategory
    ? buildCategoryWithParents(flatCategories, selectedCategory.id)
    : null;
  const categoryName = selectedCategory?.name ?? null;
  const breadcrumbs = getBreadcrumbItems({ category });

  return (
    <div>
      <ScrollToTopBtn />
      <Breadcrumbs items={breadcrumbs} />
      <div className={styles.pageContainer}>
        <div className={styles.catalogPage}>
          <FilterPanel colors={availableColors} />
          <ProductGrid
            products={products}
            categories={filterCategories}
            categoryName={categoryName}
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            sort={sort}
            categoryPath={categoryPath}
            minPrice={minPrice}
            maxPrice={maxPrice}
            colors={colors}
            colorOptions={availableColors}
          />
        </div>
      </div>
    </div>
  );
}

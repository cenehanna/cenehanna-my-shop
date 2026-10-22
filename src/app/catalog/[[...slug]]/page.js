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
  categoryIds,
  page,
  minPrice,
  maxPrice,
  colors,
  productTypes,
) {
  const orderBy = getProductListOrderBy(sort);

  const where = {
    parentId: null,
    ...(categoryIds !== undefined ? { categoryId: { in: categoryIds } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
      : {}),
    ...(colors.length > 0 ? { colourGroupName: { in: colors } } : {}),
    ...(productTypes.length > 0
      ? { productTypeName: { in: productTypes } }
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
  const productTypes = Array.isArray(resolvedSearchParams?.productType)
    ? resolvedSearchParams.productType
    : resolvedSearchParams?.productType
      ? [resolvedSearchParams.productType]
      : [];
  const currentPage = Math.max(
    1,
    Number.parseInt(resolvedSearchParams?.page || "1", 10) || 1,
  );

  const flatCategories = await getAllCategoriesFlat();
  const selectedCategory = resolveCategoryByPath(flatCategories, categoryPath);
  const categoryIds =
    categoryPath.length === 0
      ? undefined
      : selectedCategory
        ? collectDescendantCategoryIds(flatCategories, selectedCategory.id)
        : [];
  const baseWhere = {
    parentId: null,
    ...(categoryIds !== undefined ? { categoryId: { in: categoryIds } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
      : {}),
  };
  const [productTypeCounts, colorCounts] =
    categoryIds?.length === 0
      ? [[], []]
      : await Promise.all([
          prisma.product.groupBy({
            by: ["productTypeName"],
            where: {
              ...baseWhere,
              ...(colors.length > 0 ? { colourGroupName: { in: colors } } : {}),
            },
            _count: { _all: true },
            orderBy: { productTypeName: "asc" },
          }),
          prisma.product.groupBy({
            by: ["colourGroupName"],
            where: {
              ...baseWhere,
              ...(productTypes.length > 0
                ? { productTypeName: { in: productTypes } }
                : {}),
            },
            _count: { _all: true },
            orderBy: { colourGroupName: "asc" },
          }),
        ]);
  const { products, totalCount, totalPages } = await getProducts(
    sort,
    categoryIds,
    currentPage,
    minPrice,
    maxPrice,
    colors,
    productTypes,
  );

  const filterCategories = buildCatalogFilterCategories(flatCategories);
  const category = selectedCategory
    ? buildCategoryWithParents(flatCategories, selectedCategory.id)
    : null;
  const categoryName = selectedCategory?.name ?? null;
  const breadcrumbs = getBreadcrumbItems({ category });
  const availableProductTypes = productTypeCounts.map(
    ({ productTypeName, _count }) => ({
      value: productTypeName,
      label: productTypeName,
      count: _count._all,
    }),
  );
  for (const selectedType of productTypes) {
    if (!availableProductTypes.some(({ value }) => value === selectedType)) {
      availableProductTypes.push({
        value: selectedType,
        label: selectedType,
        count: 0,
      });
    }
  }
  const availableColors = colorCounts
    .filter(({ colourGroupName }) => colourGroupName.trim())
    .map(({ colourGroupName, _count }) => ({
      value: colourGroupName,
      label: colourGroupName.trim(),
      count: _count._all,
    }));
  for (const selectedColor of colors) {
    if (!availableColors.some(({ value }) => value === selectedColor)) {
      availableColors.push({
        value: selectedColor,
        label: selectedColor.trim(),
        count: 0,
      });
    }
  }

  return (
    <div>
      <ScrollToTopBtn />
      <Breadcrumbs items={breadcrumbs} />
      <div className={styles.pageContainer}>
        <div className={styles.catalogPage}>
          <FilterPanel
            colors={availableColors}
            productTypes={availableProductTypes}
          />
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
            productTypes={productTypes}
            productTypeOptions={availableProductTypes}
          />
        </div>
      </div>
    </div>
  );
}

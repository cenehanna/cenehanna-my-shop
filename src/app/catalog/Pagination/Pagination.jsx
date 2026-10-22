import Link from "next/link";
import styles from "./Pagination.module.css";


function buildCatalogHref(
  page,
  sort,
  categoryPath = [],
  minPrice,
  maxPrice,
  colors = [],
  productTypes = [],
) {
  const params = new URLSearchParams();

  if (sort && sort !== "newest") {
    params.set("sort", sort);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  if (minPrice !== undefined) {
    params.set("minPrice", String(minPrice));
  }

  if (maxPrice !== undefined) {
    params.set("maxPrice", String(maxPrice));
  }

  for (const color of colors) {
    params.append("color", color);
  }

  for (const productType of productTypes) {
    params.append("productType", productType);
  }

  const basePath =
    categoryPath.length > 0 ? `/catalog/${categoryPath.join("/")}` : "/catalog";
  const queryString = params.toString();

  return queryString ? `${basePath}?${queryString}` : basePath;
}

// Допоміжна функція для генерації масиву сторінок з еліпсисами
function getPageItems(currentPage, totalPages) {
  // Якщо сторінок 7 або менше — показуємо всі без еліпсисів
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 1. Початок каталогу (до 5-ї сторінки включно): 1 2 3 4 5 ... totalPages
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-right", totalPages];
  }

  // 2. Кінець каталогу (наприклад, для 10 сторінок це 7, 8, 9, 10): 1 ... 6 7 8 9 10
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis-left",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // 3. Середина каталогу: 1 ... 4 5 6 ... 10
  return [
    1,
    "ellipsis-left",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-right",
    totalPages,
  ];
}

export default function Pagination({
  currentPage,
  totalPages,
  sort,
  categoryPath = [],
  minPrice,
  maxPrice,
  colors = [],
  productTypes = [],
}) {
  if (totalPages <= 1) return null;

  const pageItems = getPageItems(currentPage, totalPages);
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    
    <nav className={styles.pagination} aria-label="Pagination">
      {/* Кнопка НАЗАД */}
      {isPrevDisabled ? (
        <span
          className={`${styles.pageLink} ${styles.navButton} ${styles.disabled}`}
          aria-disabled="true"
        >
          <span className={styles.chevron} aria-hidden="true">‹</span>
          <span className={styles.buttonText}>Previous</span>
        </span>
      ) : (
        <Link
          href={buildCatalogHref(
            currentPage - 1,
            sort,
            categoryPath,
            minPrice,
            maxPrice,
            colors,
            productTypes,
          )}
          className={`${styles.pageLink} ${styles.navButton}`}
          aria-label="Go to previous page"
        >
          <span className={styles.chevron} aria-hidden="true">‹</span>
          <span className={styles.buttonText}>Previous</span>
        </Link>
      )}

      {/* Цифри сторінок */}
      {pageItems.map((item, index) => {
        if (typeof item === "string" && item.startsWith("ellipsis")) {
          return (
            <span
              key={`${item}-${index}`}
              className={styles.ellipsis}
              aria-hidden="true"
            >
              ...
            </span>
          );
        }

        const pageNumber = item;
        const isActive = pageNumber === currentPage;

        return (
          <Link
            key={`page-${pageNumber}`}
            href={buildCatalogHref(
              pageNumber,
              sort,
              categoryPath,
              minPrice,
              maxPrice,
              colors,
              productTypes,
            )}
            className={`${styles.pageLink} ${isActive ? styles.active : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {pageNumber}
          </Link>
        );
      })}

      {/* Кнопка ДАЛІ */}
      {isNextDisabled ? (
        <span
          className={`${styles.pageLink} ${styles.navButton} ${styles.disabled}`}
          aria-disabled="true"
        >
          <span className={styles.buttonText}>Next</span>
          <span className={styles.chevron} aria-hidden="true">›</span>
        </span>
      ) : (
        <Link
          href={buildCatalogHref(
            currentPage + 1,
            sort,
            categoryPath,
            minPrice,
            maxPrice,
            colors,
            productTypes,
          )}
          className={`${styles.pageLink} ${styles.navButton}`}
          aria-label="Go to next page"
        >
          <span className={styles.buttonText}>Next</span>
          <span className={styles.chevron} aria-hidden="true">›</span>
        </Link>
      )}
    </nav>
  );
}
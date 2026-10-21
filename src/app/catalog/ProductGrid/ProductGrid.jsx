"use client";

import ProductCard from "@/components/ProductCard/ProductCard";
import MobileFilterMenu from "../MobileFilterMenu/MobileFilterMenu";
import Pagination from "../Pagination/Pagination";
import SortSelect from "../SortSelect/SortSelect";
import styles from "./ProductGrid.module.css";

export default function ProductGrid({
  products,
  categories,
  categoryName,
  totalCount,
  currentPage,
  totalPages,
  sort,
  categoryPath,
  minPrice,
  maxPrice,
  colors,
  colorOptions,
}) {
  return (
    <main className={styles.productsContainer}>
      <div className={styles.gridHeading}>
        <h1>{categoryName || "All Products"}</h1>
        <span className={styles.productsCount}>{totalCount} products</span>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filterButtonContainer}>
          <MobileFilterMenu categories={categories} colors={colorOptions} />
        </div>

        <SortSelect />
      </div>

      <div className={styles.grid}>
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            isPriority={index < 4}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        sort={sort}
        categoryPath={categoryPath}
        minPrice={minPrice}
        maxPrice={maxPrice}
        colors={colors}
      />
    </main>
  );
}

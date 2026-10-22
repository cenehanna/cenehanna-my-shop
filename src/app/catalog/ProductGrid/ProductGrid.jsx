"use client";

import ProductCard from "@/components/ProductCard/ProductCard";
import MobileFilterMenu from "../MobileFilterMenu/MobileFilterMenu";
import Pagination from "../Pagination/Pagination";
import SortSelect from "../SortSelect/SortSelect";
import ActiveFilterTags from "./ActiveFilterTags";
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
  productTypes,
  productTypeOptions,
}) {
  return (
    <main className={styles.productsContainer}>
      <div className={styles.gridHeading}>
        <h1>
          {categoryName || "All Products"}{" "}
          <span className={styles.headingCount}>({totalCount})</span>
        </h1>
      </div>

      <ActiveFilterTags
        colors={colorOptions}
        productTypes={productTypeOptions}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />

      <div className={styles.toolbar}>
        <div className={styles.filterButtonContainer}>
          <MobileFilterMenu
            categories={categories}
            colors={colorOptions}
            productTypes={productTypeOptions}
          />
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
        productTypes={productTypes}
      />
    </main>
  );
}

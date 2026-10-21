"use client";

import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./OtherProducts.module.css";

export default function OtherProducts({
  currentProductId,
  initialProducts = [],
  title = "You may also like",
}) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(2); // Оскільки перші 20 товарів уже прийшли з сервера
  const [hasMore, setHasMore] = useState(initialProducts.length >= 20);
  const [isLoading, setIsLoading] = useState(false);

  // Налаштовуємо тригер для підвантаження за 200px до кінця блоку
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  const fetchMoreProducts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });
      if (currentProductId) params.set("excludeId", currentProductId);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Не вдалося завантажити товари: ${res.status}`);
      }
      const data = await res.json();

      if (data.products && data.products.length > 0) {
        setProducts((prev) => [...prev, ...data.products]);
        setPage((prev) => prev + 1);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Помилка завантаження додаткових товарів:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentProductId, page, isLoading, hasMore]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      fetchMoreProducts();
    }
  }, [inView, hasMore, isLoading, fetchMoreProducts]);

  if (products.length === 0) return null;

  return (
    <section className="content">
      <h2 className="main-headings">{title}</h2>

      <div className={styles.newArrivals}>
        {products.map((product, index) => (
          <ProductCard
            key={`${product.id}-${index}`}
            product={product}
            isPriority={index < 8}
          />
        ))}
      </div>

      {/* Маркер-тригер для відстеження доскролу */}
      {hasMore && (
        <div ref={ref} className={styles.trigger}>
          {isLoading && (
            <div className={styles.loader}>Loading products...</div>
          )}
        </div>
      )}
    </section>
  );
}

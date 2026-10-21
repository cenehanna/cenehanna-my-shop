"use client";

import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getFavoriteProducts } from "@/app/actions/getFavoriteProducts";
import ProductCard from "@/components/ProductCard/ProductCard";
import Button from "@/components/ui";
import { readFavoriteIds, writeFavoriteIds } from "@/lib/favoritesStorage";
import styles from "./FavoritesPage.module.css";
import Image from "next/image";

export default function FavoritesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hadStaleIds, setHadStaleIds] = useState(false);

  const fetchFavorites = useCallback(async () => {
    try {
      const savedIds = readFavoriteIds();

      if (savedIds.length === 0) {
        setProducts([]);
        setHadStaleIds(false);
        return;
      }

      const fetchedProducts = await getFavoriteProducts(savedIds);
      const validIds = fetchedProducts.map((product) => product.id);

      if (validIds.length !== savedIds.length) {
        writeFavoriteIds(validIds);
        setHadStaleIds(savedIds.length > 0 && validIds.length === 0);
      } else {
        setHadStaleIds(false);
      }

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Помилка:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();

    window.addEventListener("favorite-updated", fetchFavorites);
    window.addEventListener("storage", fetchFavorites);

    return () => {
      window.removeEventListener("favorite-updated", fetchFavorites);
      window.removeEventListener("storage", fetchFavorites);
    };
  }, [fetchFavorites]);

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear your favorites list?")) {
      writeFavoriteIds([]);
      setProducts([]);
      setHadStaleIds(false);
      window.dispatchEvent(new Event("favorite-updated"));
    }
  };

  if (loading) {
    return (
      <div className={styles.content}>
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          Loading saved items...
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.content}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Image 
            src="/favoritesIllustration2.svg" 
            alt="heart" width={300} height={300}>
                      </Image>
          </div>
          <h2 className={styles.emptyTitle}>Your favorites list is empty</h2>
          <p className={styles.emptyText}>
            {hadStaleIds
              ? "Previously saved items are no longer available in the catalog. Add new items to your favorites."
              : "Save items you love so you won't lose them and can easily return to shop whenever you're ready."}
          </p>
          <Button
            as={Link}
            href="/catalog"
            shape="pill"
            variant="solid"
            className={styles.catalogButton}
          >
            View all
            <MoveRight size={20} className={styles.arrowIcon} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Favorites</h1>
          <p className={styles.subtitle}>
            Saved items: <strong>{products.length}</strong>
          </p>
        </div>
        <Button
          onClick={handleClearAll}
          shape="rounded"
          variant="outline"
          className={styles.clearButton}
        >
          Clear all
        </Button>
      </header>

      <div className={styles.grid}>
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            isPriority={index < 8}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "@/components/ui/ProductImage";
import { getFirstImage } from "@/lib/images";
import styles from "./Hero.module.css";

const ROTATION_INTERVAL = 12_000;
const SLIDE_DURATION = 500;

function ProductColumn({ category }) {
  const [products, setProducts] = useState(category.products);
  const [isSliding, setIsSliding] = useState(false);
  const slideTimeoutRef = useRef(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIsSliding(true);
      slideTimeoutRef.current = window.setTimeout(() => {
        setProducts((currentProducts) => [
          ...currentProducts.slice(1),
          currentProducts[0],
        ]);
        setIsSliding(false);
      }, SLIDE_DURATION);
    }, ROTATION_INTERVAL);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(slideTimeoutRef.current);
    };
  }, []);

  return (
    <section className={styles.card} aria-label={`${category.name} products`}>
      <div className={styles.productWindow}>
        <ul
          className={`${styles.productTrack} ${isSliding ? styles.sliding : ""}`}
        >
          {products.map((product) => (
            <li key={product.id} className={styles.productItem}>
              <Link
                href={`/product/${product.slug}`}
                className={styles.productLink}
              >
                <span className={styles.cardImage}>
                  <Image
                    src={getFirstImage(product.images)}
                    alt=""
                    fill
                    sizes="(max-width: 600px) 130px, (max-width: 1024px) 33vw, 170px"
                  />
                </span>
                <span className={styles.cardInfo}>
                  <span className={styles.cardName}>{product.title}</span>
                  <span className={styles.cardPrice}>
                    {product.price.toLocaleString("uk-UA")} UAH
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function HeroProductColumns({ categories = [] }) {
  if (categories.length === 0) return null;

  return (
    <div className={styles.cards}>
      {categories.map((category) => (
        <ProductColumn key={category.id} category={category} />
      ))}
    </div>
  );
}

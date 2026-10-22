"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "@/components/ui/ProductImage";
import { getFirstImage, getImage } from "@/lib/images";

import FavoriteButton from "./FavoriteButton/FavoriteButton";
import ProductBadge from "./ProductBadge/ProductBadge";
import styles from "./ProductCard.module.css";

const VIEWED_PRODUCTS_KEY = "viewed-products";
const MAX_VIEWED_PRODUCTS = 40;

export default function ProductCard({
  product,
  isPriority = false,
  variant = "default",
}) {
  const isCompact = variant === "compact";
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product);

  const imageSizes = "(max-width: 768px) 50vw, 25vw";
  const variants = product.variants?.length ? product.variants : [product];
  const uniqueVariants = [
    ...new Map(
      variants.map((variant) => [
        variant.colourGroupName?.trim().toLowerCase() || variant.id,
        variant,
      ]),
    ).values(),
  ];
  const hasSecondImage = selectedVariant.images?.length > 1;

  const handleProductClick = (variant) => {
    try {
      const savedProducts = JSON.parse(
        localStorage.getItem(VIEWED_PRODUCTS_KEY) || "[]",
      );
      const updatedProducts = [
        variant,
        ...savedProducts.filter((saved) => saved.id !== variant.id),
      ].slice(0, MAX_VIEWED_PRODUCTS);
      localStorage.setItem(
        VIEWED_PRODUCTS_KEY,
        JSON.stringify(updatedProducts),
      );
      window.dispatchEvent(new Event("viewed-products-updated"));
    } catch (error) {
      console.error("Не вдалося зберегти переглянутий товар:", error);
    }
  };

  return (
    <article
      className={`${styles.productCard} ${isCompact ? styles.compactCard : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.cardButtons}>
        <ProductBadge badges={product.badges} />
        <FavoriteButton productId={selectedVariant.id} />
      </div>

      <Link
        href={`/product/${selectedVariant.slug}`}
        onClick={() => handleProductClick(selectedVariant)}
      >
        <div className={styles.productImg}>
          <Image
            src={getFirstImage(
              selectedVariant.images?.length
                ? selectedVariant.images
                : product.images,
            )}
            alt={selectedVariant.title}
            fill
            sizes={imageSizes}
            className={styles.primaryImg}
            priority={isPriority}
          />

          {hasSecondImage && (
            <Image
              src={getImage(selectedVariant.images, 1)}
              alt={`${selectedVariant.title} - view 2`}
              fill
              sizes={imageSizes}
              className={`${styles.secondaryImg} ${isHovered ? styles.active : ""}`}
            />
          )}
        </div>
      </Link>

      <div className={styles.productInfo}>
        <h5>{selectedVariant.title}</h5>
        {!isCompact && <p>{product.description}</p>}
        <h4>{selectedVariant.price} UAH</h4>
        {!isCompact && uniqueVariants.length > 1 && (
          <div className={styles.variantSwatches}>
            {uniqueVariants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                className={`${styles.variantSwatch} ${selectedVariant.id === variant.id ? styles.selectedSwatch : ""}`}
                onClick={() => setSelectedVariant(variant)}
                onMouseEnter={() => setSelectedVariant(variant)}
                aria-label={variant.colourGroupName || variant.title}
                aria-pressed={selectedVariant.id === variant.id}
                title={variant.colourGroupName || variant.title}
              >
                <Image
                  src={getFirstImage(variant.images)}
                  alt=""
                  fill
                  sizes="32px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

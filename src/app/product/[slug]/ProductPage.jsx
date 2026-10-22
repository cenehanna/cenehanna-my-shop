"use client";

import { MessageCircleQuestionMark } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Accordion from "@/components/Accordion/Accordion";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ImageGallery from "@/components/ImageGallery/ImageGallery";
import OtherProducts from "@/components/OtherProducts/OtherProducts";
import ProductBadge from "@/components/ProductCard/ProductBadge/ProductBadge";
import ProductCarousel from "@/components/ProductCarousel/ProductCarousel";
import Image from "@/components/ui/ProductImage";
import { getBreadcrumbItems } from "@/lib/breadcrumbs";
import { getFirstImage } from "@/lib/images";
import Buttons from "./Buttons/Buttons";
import styles from "./product.module.css";

export default function ProductPage({ product, initialProducts }) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.id);
  const selectedVariant =
    product.variants?.find((variant) => variant.id === selectedVariantId) ??
    product;
  const displayProduct = { ...product, ...selectedVariant };
  const breadcrumbs = getBreadcrumbItems({ product });
  const categoryPath = [];
  for (let category = product.category; category; category = category.parent) {
    categoryPath.unshift(category.name);
  }
  const characteristics = [
    ["Category", categoryPath.join(" / ")],
    ["Color", displayProduct.colourGroupName],
    ["Pattern", displayProduct.graphicalAppearanceName],
  ].filter(([, value]) => typeof value === "string" && value.trim());

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />

      <div className={styles.productContainer}>
        <div className={styles.imagesContainer}>
          <div className={styles.images}>
            <ImageGallery
              product={displayProduct}
              selectedVariantId={selectedVariantId}
              onSelectVariant={setSelectedVariantId}
            >
              <div className={styles.accordions}>
                <Accordion className={styles.accordion} title="Description">
                  <p>{product.description}</p>
                </Accordion>
                <Accordion
                  className={styles.accordion}
                  title="Composition & Care"
                >
                  <p>{product.description}</p>
                </Accordion>
                <Accordion
                  className={styles.accordion}
                  title="Shipping & Returns"
                >
                  <p>{product.description}</p>
                </Accordion>
              </div>
            </ImageGallery>
          </div>
        </div>

        <div className={styles.infoContainer}>
          {product.badges?.length > 0 && (
            <div className={styles.badgesContainer}>
              <ProductBadge badges={product.badges} />
            </div>
          )}

          <h1 className={styles.title}>{displayProduct.title}</h1>
          {characteristics.length > 0 && (
            <dl className={styles.productCharacteristics}>
              {characteristics.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
          {product.variants?.length > 1 && (
            <div className={styles.detailVariants}>
              <span>Color: {selectedVariant.colourGroupName || ""}</span>
              <div className={styles.detailSwatches}>
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    className={`${styles.detailSwatch} ${selectedVariantId === variant.id ? styles.activeDetailSwatch : ""}`}
                    onClick={() => setSelectedVariantId(variant.id)}
                    aria-label={variant.colourGroupName || variant.title}
                    aria-pressed={selectedVariantId === variant.id}
                    title={variant.colourGroupName || variant.title}
                  >
                    <Image
                      src={getFirstImage(variant.images)}
                      alt=""
                      width={42}
                      height={52}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
          <h2 className={styles.price}>{displayProduct.price} UAH</h2>

          <Buttons product={displayProduct} />

          <Link href="#" className={styles.askMeLink}>
            <MessageCircleQuestionMark />
            Ask a question
          </Link>
        </div>
      </div>

      <ProductCarousel
        title="Similar Items"
        initialProducts={initialProducts.slice(0, 15)}
      />

      <OtherProducts
        currentProductId={product.id}
        initialProducts={initialProducts}
      />
    </div>
  );
}

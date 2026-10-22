"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import Image from "@/components/ui/ProductImage";
import { getFirstImage } from "@/lib/images";
import styles from "./ImageGallery.module.css";

export default function ImageGallery({
  product,
  selectedVariantId,
  onSelectVariant,
  children,
}) {
  const scrollRef = useRef(null);
  const smallImagesRef = useRef(null);
  const selectedVariantRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const variants = product?.variants?.length ? product.variants : [product];
  const totalVariants = variants.length;

  const currentVariantIndex = Math.max(
    0,
    variants.findIndex((variant) => variant.id === selectedVariantId),
  );

  // Keep the active thumbnail visible without scrolling the page.
  useEffect(() => {
    const container = smallImagesRef.current;
    const selected = selectedVariantRef.current;
    if (
      !container ||
      !selected ||
      selected.dataset.variantId !== String(selectedVariantId) ||
      container.clientHeight === 0
    ) {
      return;
    }

    const containerBounds = container.getBoundingClientRect();
    const selectedBounds = selected.getBoundingClientRect();

    if (selectedBounds.top < containerBounds.top) {
      container.scrollTo({
        top: container.scrollTop + selectedBounds.top - containerBounds.top,
        behavior: "smooth",
      });
    } else if (selectedBounds.bottom > containerBounds.bottom) {
      container.scrollTo({
        top:
          container.scrollTop + selectedBounds.bottom - containerBounds.bottom,
        behavior: "smooth",
      });
    }
  }, [selectedVariantId]);

  useEffect(
    () => () => {
      window.clearTimeout(scrollTimeoutRef.current);
    },
    [],
  );

  // Синхронізація свайпу зі станом
  useEffect(() => {
    if (!scrollRef.current) return;
    const slideWidth = scrollRef.current.clientWidth;
    if (slideWidth === 0) return;

    const target = slideWidth * currentVariantIndex;
    if (Math.abs(scrollRef.current.scrollLeft - target) > 1) {
      scrollRef.current.scrollTo({ left: target, behavior: "smooth" });
    }
  }, [currentVariantIndex]);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    window.clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(() => {
      const container = scrollRef.current;
      if (!container || container.clientWidth === 0) return;

      const newIndex = Math.round(container.scrollLeft / container.clientWidth);
      if (
        newIndex !== currentVariantIndex &&
        variants[newIndex] &&
        variants[newIndex].id !== selectedVariantId
      ) {
        onSelectVariant(variants[newIndex].id);
      }
    }, 120);
  };

  function selectVariantByOffset(offset) {
    if (totalVariants === 0) return;
    const nextIndex =
      (currentVariantIndex + offset + totalVariants) % totalVariants;
    onSelectVariant(variants[nextIndex].id);
  }

  const nextVariant = () => selectVariantByOffset(1);
  const prevVariant = () => selectVariantByOffset(-1);

  return (
    <>
      {/* МІНІАТЮРИ */}
      <div className={styles.smallImages} ref={smallImagesRef}>
        {variants.map((variant) => {
          const image = getFirstImage(variant.images);
          const isActive = variant.id === selectedVariantId;
          const hasRealImage = Boolean(variant.images?.[0]);

          return (
            <button
              key={variant.id}
              ref={isActive ? selectedVariantRef : null}
              data-variant-id={variant.id}
              type="button"
              className={`${styles.smallImage} ${isActive ? styles.border : ""}`}
              onClick={() => onSelectVariant(variant.id)}
              aria-label={variant.colourGroupName || variant.title}
              aria-pressed={isActive}
              title={variant.colourGroupName || variant.title}
            >
              <Image
                src={image}
                fill
                sizes="(max-width: 768px) 20vw, 10vw"
                alt={hasRealImage ? `${variant.title} - thumbnail` : "No image"}
                className={styles.galleryImage}
                onLoad={(e) =>
                  e.currentTarget.setAttribute("data-loaded", "true")
                }
              />
            </button>
          );
        })}
      </div>

      {/* ГОЛОВНЕ ЗОБРАЖЕННЯ ТА КОНТЕНТ */}
      <div className={styles.imageAndDescription}>
        <div className={styles.bigImage}>
          <div
            className={styles.scrollContainer}
            ref={scrollRef}
            onScroll={handleScroll}
          >
            {variants.map((variant, index) => {
              const image = getFirstImage(variant.images);
              const hasRealImage = Boolean(variant.images?.[0]);

              return (
                <div
                  key={variant.id}
                  className={styles.slide}
                  aria-hidden={index !== currentVariantIndex}
                >
                  <Image
                    src={image}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 40vw"
                    alt={hasRealImage ? product.title : "No image"}
                    className={styles.galleryImage}
                    onLoad={(e) =>
                      e.currentTarget.setAttribute("data-loaded", "true")
                    }
                  />
                </div>
              );
            })}
          </div>

          {/* Кнопки навігації між варіантами */}
          {totalVariants > 1 && (
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.prevButton}
                onClick={prevVariant}
                aria-label="Previous variant"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                className={styles.nextButton}
                onClick={nextVariant}
                aria-label="Next variant"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Лічильник варіантів */}
          {totalVariants > 1 && (
            <div className={styles.counter}>
              {currentVariantIndex + 1} / {totalVariants}
            </div>
          )}
        </div>

        {children}
      </div>
    </>
  );
}

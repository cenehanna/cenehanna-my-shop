"use client";

import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getProductsByIds } from "@/app/actions/getProductsByIds";
import ProductCard from "@/components/ProductCard/ProductCard";
import { useStorageSync } from "@/hooks/useStorageSync";
import {
  readViewedProductIds,
  VIEWED_PRODUCTS_UPDATED_EVENT,
  writeViewedProductIds,
} from "@/lib/viewedProductsStorage";
import styles from "./ProductCarousel.module.css";

export default function ProductCarousel({ title, initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
      align: "start",
      slidesToScroll: 4,
      containScroll: "trimSnaps",
      dragFree: true,
      breakpoints: {
        "(max-width: 768px)": {
          slidesToScroll: 1,
        },
      },
    },
    [WheelGesturesPlugin()],
  );

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const handlePrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const handleNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((api) => {
    if (!api) return;
    setPrevBtnDisabled(!api.canScrollPrev());
    setNextBtnDisabled(!api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const [scrollProgress, setScrollProgress] = useState(0);

  const loadViewedProducts = useCallback(async () => {
    if (initialProducts.length > 0) {
      setProducts(initialProducts);
      return;
    }

    const savedIds = readViewedProductIds();
    if (savedIds.length === 0) {
      setProducts([]);
      return;
    }

    try {
      const fetchedProducts = await getProductsByIds(savedIds);
      const validIds = fetchedProducts.map((product) => product.id);

      if (validIds.length !== savedIds.length) {
        writeViewedProductIds(validIds);
      }

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Не вдалося завантажити переглянуті товари:", error);
      setProducts([]);
    }
  }, [initialProducts]);

  useEffect(() => {
    if (initialProducts.length > 0) {
      setProducts(initialProducts);
      return;
    }

    loadViewedProducts();
  }, [initialProducts, loadViewedProducts]);

  useStorageSync(loadViewedProducts, VIEWED_PRODUCTS_UPDATED_EVENT);

  const onScroll = useCallback((api) => {
    if (!api) return;
    const progress = Math.max(0, Math.min(1, api.scrollProgress()));
    setScrollProgress(progress * 100);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll(emblaApi);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
  }, [emblaApi, onScroll]);

  if (products.length === 0) return null;

  return (
    <section className={`content ${styles.productCarousel}`}>
      <div className={styles.headerRow}>
        <h2 className="main-headings">{title}</h2>
        <button type="button" className={styles.seeAllButton}>
          <span>View all products</span>
          <MoveRight size={20} className={styles.arrowIcon} />
        </button>
      </div>

      <div className={styles.ProductCarousel}>
        <div className={`${styles.controls} controls`}>
          <button
            type="button"
            className={`${styles.arrowBtn} ${styles.prevBtn}`}
            onClick={handlePrev}
            disabled={prevBtnDisabled}
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </button>

          <button
            type="button"
            className={`${styles.arrowBtn} ${styles.nextBtn}`}
            onClick={handleNext}
            disabled={nextBtnDisabled}
            aria-label="Next slide"
          >
            <ChevronRight />
          </button>
        </div>

        <div className={styles.carouselTrack} ref={emblaRef}>
          <div className={styles.carousel}>
            {products.map((product) => (
              <div key={product.id} className={styles.carouselSlide}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ transform: `translateX(${scrollProgress - 100}%)` }}
        />
      </div>
    </section>
  );
}

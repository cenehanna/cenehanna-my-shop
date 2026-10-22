import { MoveRight } from "lucide-react";
import Link from "next/link";
import Image from "@/components/ui/ProductImage";
import { getFirstImage } from "@/lib/images";

import styles from "./Categories.module.css";

export default function Categories({ categories = [] }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className={`content ${styles.quickCategories}`}>
      <div className={styles.headings}>
        <h2 className="main-headings">Categories</h2>
        <Link href="/catalog" className={styles.viewAllLink}>
          <span>View all products</span>
          <MoveRight size={20} className={styles.arrowIcon} />
        </Link>
      </div>

      <div className={styles.categoriesCards}>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/catalog/${category.slug}`}
            className={styles.card}
          >
            <h3>{category.name}</h3>
            <div className={styles.photoWrap}>
              <Image
                src={getFirstImage(category.image)}
                alt={category.name}
                className={styles.cardPhoto}
                width={300}
                height={300}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

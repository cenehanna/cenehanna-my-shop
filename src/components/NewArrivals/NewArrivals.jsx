import { MoveRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard/ProductCard";
import Button from "@/components/ui";
import styles from "./NewArrivals.module.css";

export default function NewArrivals({ products }) {
  return (
    <section className={`content ${styles.content}`}>
      <h2 className="main-headings">New Arrivals</h2>

      <div className={styles.newArrivals}>
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            isPriority={index < 8}
          />
        ))}
      </div>

      <div className={styles.seeAll}>
        <Button
          as={Link}
          href="/catalog"
          shape="pill"
          variant="solid"
          className={styles.catalogButton}
        >
          View all products ({products.length})
          <MoveRight size={20} className={styles.arrowIcon} />
        </Button>
      </div>
    </section>
  );
}

import Link from "next/link";
import Button from "@/components/ui";
import styles from "./Hero.module.css";

const placeholderProducts = [
  { id: 1, name: "Product name", price: "$00.00" },
  { id: 2, name: "Product name", price: "$00.00" },
  { id: 3, name: "Product name", price: "$00.00" },
];

export default function Hero() {
  return (
    <section className={styles.heroBanner}>
      <div className={styles.inner}>
      <ul className={styles.cards}>
        {placeholderProducts.map((product) => (
          <li key={product.id} className={styles.card}>
            <div className={styles.cardImage} aria-hidden="true" />
            <div className={styles.cardInfo}>
              <h3 className={styles.cardName}>{product.name}</h3>
              <p className={styles.cardPrice}>{product.price}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>FRESH DROPS, JUST FOR YOU</h1>
        <h2 className={styles.heroSubtitle}>
          New arrivals land every week. Find your next favourite piece before
          someone else does.
        </h2>

        <Button
          as={Link}
          href="/catalog"
          variant="outline"
          shape="pill"
          className={styles.heroBtn}
        >
          SHOP NEW ARRIVALS
        </Button>
      </div>
      </div>
    </section>
  );
}
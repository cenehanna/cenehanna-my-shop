import Link from "next/link";
import Button from "@/components/ui";
import styles from "./Hero.module.css";
import HeroProductColumns from "./HeroProductColumns";

export default function Hero({ productColumns = [] }) {
  return (
    <section className={styles.heroBanner}>
      <div className={styles.inner}>
        <HeroProductColumns categories={productColumns} />

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
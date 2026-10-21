import styles from "./ProductBadge.module.css";

const BADGE_CONFIG = {
  new: { label: "NEW", className: "greenNote" },
  top: { label: "TOP", className: "pinkNote" },
  sale: { label: "SALE", className: "yellowNote" },
  rare: { label: "RARE", className: "blueNote" },
  vintage: { label: "VINTAGE", className: "violetNote" },
};

export default function ProductBadge({ badges }) {
  const badgeValue = badges?.find(
    (value) => typeof value === "string" && value.trim(),
  );
  const normalizedBadge =
    typeof badgeValue === "string" ? badgeValue.toLowerCase() : "";
  const badgeInfo = normalizedBadge ? BADGE_CONFIG[normalizedBadge] : null;

  if (!badgeInfo) {
    return <span className={styles.emptyBadge} aria-hidden="true" />;
  }

  return (
    <span className={`${styles.productNote} ${styles[badgeInfo.className]}`}>
      {badgeInfo.label}
    </span>
  );
}

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

export default function Breadcrumbs({ items = [] }) {
  const breadcrumbs =
    items.length > 0 ? items : [{ label: "Home", href: "/" }];

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbsContainer}>
        {breadcrumbs.map((item, index) => {
          const isCurrent = index === breadcrumbs.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className={styles.breadcrumbItem}
            >
              {item.href && !isCurrent ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span className={isCurrent ? styles.current : undefined}>
                  {item.label}
                </span>
              )}

              {!isCurrent && <ChevronRight size={14} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

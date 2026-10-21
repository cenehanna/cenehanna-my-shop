import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Блок з брендом */}
        <div className={styles.brandBlock}>
          <Link href="/" className={styles.logo}>
            @cenehanna
          </Link>
          <p className={styles.description}>
Fresh collections, effortless style. Find the pieces that define your look.          </p>
        </div>

        {/* Навігація */}
        <div className={styles.navBlock}>
          <h5 className={styles.title}>Navigation</h5>
          <ul className={styles.navList}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/catalog">Catalog</Link>
            </li>
            <li>
              <Link href="/#faq">Delivery & Payment</Link>
            </li>
 
          </ul>
        </div>

        {/* Соцмережі */}
        <div className={styles.socialBlock}>
          <h5 className={styles.title}>Contact & Socials</h5>
          <div className={styles.socialIcons}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={styles.socialLink}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className={styles.socialLink}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Копірайт */}
      <div className={styles.bottomBar}>
        <p>© {currentYear} @cenehanna. All rights reserved.</p>
      </div>
    </footer>
  );
}
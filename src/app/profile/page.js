import styles from "./ProfilePage.module.css";
import ProfilePage from "./ProfilePage.jsx";

export const metadata = {
  title: "My Profile | cenehanna-shop",
  description:
    "Manage personal details, orders, and account settings",
};

export default function Profile() {
  return (
    <main className={styles.container}>
      <ProfilePage />
    </main>
  );
}

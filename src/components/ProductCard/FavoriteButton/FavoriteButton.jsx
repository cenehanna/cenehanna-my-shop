import { Heart } from "lucide-react";
import Button from "@/components/ui";
import { useFavorite } from "@/lib/useFavorite";
import styles from "./FavoriteButton.module.css";

export default function FavoriteButton({ productId }) {
  const { isFavorite, toggleFavorite } = useFavorite(productId);

  return (
    <Button
      type="button"
      variant="solid"
      shape="rounded"
      className={styles.favoriteButton}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      onClick={toggleFavorite}
    >
      <Heart
        className={styles.icon}
        strokeWidth={1.5}
        fill={isFavorite ? "#D98FA7" : "none"}
        stroke={isFavorite ? "#D98FA7" : "currentColor"}
      />
    </Button>
  );
}

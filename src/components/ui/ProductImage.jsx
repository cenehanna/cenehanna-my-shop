import Image from "next/image";
import { isOracleObjectStorageImage, resolveImageSrc } from "@/lib/images";

export default function ProductImage({ src, unoptimized, ...props }) {
  const resolvedSrc = resolveImageSrc(src);

  return (
    <Image
      {...props}
      src={resolvedSrc}
      unoptimized={unoptimized || isOracleObjectStorageImage(resolvedSrc)}
    />
  );
}

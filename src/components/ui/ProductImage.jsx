"use client";

import Image from "next/image";
import { useState } from "react";
import { PLACEHOLDER, resolveImageSrc } from "@/lib/images";

export default function ProductImage({
  src,
  unoptimized,
  onError,
  style,
  ...props
}) {
  const resolvedSrc = resolveImageSrc(src || PLACEHOLDER);
  const [failedSrc, setFailedSrc] = useState(null);
  const imageSrc = failedSrc === resolvedSrc ? PLACEHOLDER : resolvedSrc;
  const isPlaceholder = imageSrc === PLACEHOLDER;

  const handleError = (event) => {
    if (imageSrc !== PLACEHOLDER) {
      setFailedSrc(resolvedSrc);
    }
    onError?.(event);
  };

  return (
    <Image
      {...props}
      src={imageSrc}
      onError={handleError}
      style={isPlaceholder ? { ...style, objectFit: "contain" } : style}
      unoptimized={unoptimized}
    />
  );
}

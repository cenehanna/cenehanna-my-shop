"use client";

import { useEffect } from "react";

export function useStorageSync(syncHandler, eventName) {
  useEffect(() => {
    syncHandler();

    window.addEventListener(eventName, syncHandler);
    window.addEventListener("storage", syncHandler);

    return () => {
      window.removeEventListener(eventName, syncHandler);
      window.removeEventListener("storage", syncHandler);
    };
  }, [syncHandler, eventName]);
}

"use client";

import { useEffect } from "react";

export function useScrollOnError(error: string | null | undefined) {
  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error]);
}

"use client";

import { useSearchParams } from "next/navigation";

export function getCode() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  if (code) {
    return code;
  } else {
    return null;
  }
}

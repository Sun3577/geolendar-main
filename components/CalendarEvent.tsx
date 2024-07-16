"use client";

import { useSearchParams } from "next/navigation";

export default function CalendarEvent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  return (
    <div>
      <p>{code}</p>
    </div>
  );
}

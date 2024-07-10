"use client";

import Link from "next/link";

export default function AccountProfile({ imageUrl }: any) {
  return (
    <Link href={imageUrl} scroll={true}>
      Link
    </Link>
  );
}

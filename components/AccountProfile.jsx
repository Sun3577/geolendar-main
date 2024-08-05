"use client";

import Image from "next/image";
import Link from "next/link";

export default function AccountProfile({ imageUrl }) {
  const profileLink = "/profile";
  return (
    <Link href={profileLink} scroll={true}>
      <Image src={imageUrl} width={100} height={100} alt="Profile Image" />
    </Link>
  );
}

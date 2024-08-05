"use client";

import { signOut } from "next-auth/react";

// client component

export default function SignOutButton() {
  return <button onClick={() => signOut()}>Sign Out</button>;
}

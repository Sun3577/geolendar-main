"use client";

import { signIn } from "next-auth/react";

// client component

export default function SignInButton() {
  return <button onClick={() => signIn("google")}>Sign In with Google</button>;
}

"use client";

import Calendar from "@/components/Calendar";
import ClientButton from "@/components/ClientButton";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  console.log("Session", session);

  const accessToken = session?.accessToken;

  if (session) {
    return (
      <>
        <h1>Welcome, {session.user?.name}</h1>
        <button onClick={() => signOut()}>Sign out</button>
        <div>
          <h2>Access Token</h2>
          <p>{session.accessToken}</p>
        </div>
        <div>
          <h2>Refresh Token</h2>
          <p>{session.refreshToken}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <nav></nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Calendar accessToken={accessToken} />
        <ClientButton />
        <h1>Please sign in</h1>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </main>
    </>
  );
}

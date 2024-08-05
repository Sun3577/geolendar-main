"use client";

import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";

export default function AuthComponent({ session }) {
  if (!session) {
    return (
      <div>
        <h1>Please Sign In</h1>
        <SignInButton />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Welcome, {session.user.name}</h1>
        <SignOutButton />
      </div>
    );
  }
}

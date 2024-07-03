"use client";

import { googleLogout, useGoogleLogin } from "@react-oauth/google";

interface GoogleSigninButtonProps {
  onLoginSuccess: (accessToken: string) => void;
}

export function GoogleSigninButton({
  onLoginSuccess,
}: GoogleSigninButtonProps) {
  const login = useGoogleLogin({
    onSuccess: (response) => {
      onLoginSuccess(response.access_token);
    },
    onError: () => {
      console.log("Login Failed");
    },
    scope: "https://www.googleapis.com/auth/calendar.readonly",
  });

  return <button onClick={() => login()}>Google Login</button>;
}

interface LogoutProps {
  onLogout: () => void;
}

export function Logout({ onLogout }: LogoutProps) {
  return (
    <button
      onClick={() => {
        googleLogout();
        onLogout();
      }}
    >
      Logout
    </button>
  );
}

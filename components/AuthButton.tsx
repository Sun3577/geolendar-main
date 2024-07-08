"use client";

import { googleLogout, useGoogleLogin } from "@react-oauth/google";

export function GoogleSigninButton({
  onLoginSuccess,
}: {
  onLoginSuccess: (token: string) => void;
}) {
  const login = useGoogleLogin({
    flow: "auth-code", // 인증 흐름을 'auth-code'로 설정합니다.
    onSuccess: (response) => {
      onLoginSuccess(response.code); // 'access_token' 대신 'code'를 반환합니다.
    },
    onError: () => {
      console.log("Login Failed");
    },
    scope: "https://www.googleapis.com/auth/calendar.readonly",
  });

  return <button onClick={() => login()}>Google Login</button>;
}

export function Logout({ onLogout }: { onLogout: () => void }) {
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

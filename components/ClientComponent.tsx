"use client";

import { useState } from "react";
import Calendar from "./Calendar";
import { GoogleSigninButton, Logout } from "./AuthButton";

export default function ClientComponent({ currentUser }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleLoginSuccess = (token: string) => {
    setAccessToken(token);
  };

  const handleLogout = () => {
    setAccessToken(null);
  };

  return (
    <div>
      <div>
        {currentUser ? (
          <Logout onLogout={handleLogout} />
        ) : (
          <GoogleSigninButton onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
      <Calendar accessToken={accessToken} />
    </div>
  );
}

import React from "react";
import "./globals.css";
import { getServerSession } from "next-auth";
import AuthComponent from "../components/AuthComponent";
import { authConfig } from "./api/auth/[...nextauth]/route";

export default async function RootLayout({ children }) {
  const session = await getServerSession(authConfig);
  return (
    <html lang="en">
      <body>
        <AuthComponent session={session} />
        {children}
      </body>
    </html>
  );
}

import React from "react";
import "./globals.css";
import { getServerSession, Session } from "next-auth";
import AuthComponent from "@/components/AuthComponent";
import { authConfig } from "./api/auth/[...nextauth]/route";

interface RootLayoutProps {
  children: React.ReactNode;
  session: Session | null;
}

export default async function RootLayout({ children }: RootLayoutProps) {
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

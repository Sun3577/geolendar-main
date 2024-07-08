import { NextResponse } from "next/server";
import { google } from "googleapis";

const REDIRECT_URI = "http://localhost:3000/api/auth/callback";

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

export async function GET() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.readonly"],
  });
  return NextResponse.redirect(authUrl);
}

import { NextResponse } from "next/server";
import { google } from "googleapis";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/api/auth/callback";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code not found" },
      { status: 400 }
    );
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 여기서 refresh token을 안전한 곳에 저장하세요 (예: 데이터베이스, 환경 변수 등)
    console.log("Refresh Token:", tokens.refresh_token);

    const redirectUrl = new URL("/", "http://localhost:3000/");
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return NextResponse.json(
      { error: "Error retrieving access token" },
      { status: 500 }
    );
  }
}

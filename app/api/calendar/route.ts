import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { authConfig } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authConfig);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL
  );

  oauth2Client.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    return NextResponse.json(events.data.items);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching calendar events" },
      { status: 500 }
    );
  }
}

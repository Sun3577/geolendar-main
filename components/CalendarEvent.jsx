"use client";

import { google } from "googleapis";
import { useSearchParams } from "next/navigation";

export default async function CalendarEvent() {
  if (code) {
    let { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // Save Token in DB
  }

  return <div>A</div>;
}

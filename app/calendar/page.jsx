import { getServerSession } from "next-auth";
import { authConfig } from "../api/auth/[...nextauth]/route";
import User from "../../lib/models/user.model";
import { connectToDB } from "../../lib/mongoose";
import { google } from "googleapis";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }) {
  const session = await getServerSession(authConfig);

  await connectToDB();

  const code = searchParams.code;

  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + "/calendar"
  );

  if (code) {
    let { tokens } = await oauth2Client.getToken(code);

    await User.findOneAndUpdate(
      { id: session?.user.id },
      { access_token: tokens.access_token, refresh_token: tokens.refresh_token }
    );

    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar("v3");

    let response;

    let events;

    try {
      const request = {
        auth: oauth2Client,
        calendarId: "primary",
        timeMax: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      };
      response = await calendar.events.list(request);
      events = response.data.items;
    } catch (error) {
      console.log("Response Error", error);
    }

    if (!events || events.length == 0) {
      console.log("No Events Found");
      redirect("/");
    } else {
      const eventItems = events.map((event) => ({
        id: event.id,
        title: event.summary,
        description: event.description || "",
        location: event.location || null,
        createdAt: event.created,
        start: event.start,
        end: event.end,
        color: event.colorId || "7",
      }));

      //save formatted events in db
      console.log(eventItems);

      redirect("/");
    }
  } else {
    console.log("No code");
  }

  return (
    <div>
      <div>A</div>
    </div>
  );
}

import { getServerSession } from "next-auth";
import { authConfig } from "../api/auth/[...nextauth]/route";
import User from "../../lib/models/user.model";
import { connectToDB } from "../../lib/mongoose";
import { google } from "googleapis";

export default async function Page({ searchParams }) {
  const session = await getServerSession(authConfig);

  await connectToDB();

  const code = searchParams.code;

  console.log("Code", code);

  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + "/calendar"
  );

  if (code) {
    let { tokens } = await oauth2Client.getToken(code);

    // Save Token in DB

    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar("v3");

    let response;

    let calendar_events;

    try {
      const request = {
        auth: oauth2Client,
        calendarId: "primary",
        timeMax: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 2500,
        orderBy: "startTime",
      };
      response = await calendar.events.list(request);
      calendar_events = response.data.items;
    } catch (error) {
      console.log("Response Error", error);
    }

    if (!calendar_events || calendar_events.length == 0) {
      console.log("No Events Found");
      return;
    } else {
      const output = calendar_events.reduce(
        (str, event) =>
          `${str}${event.summary} (${
            event.start.dateTime || event.start.date
          })\n`,
        "Events:\n"
      );
      console.log("Output", output);
    }
  } else {
    console.log("No code");
  }

  const currentUser = await User.findOne({ id: session?.user.id });

  return (
    <div>
      <div>A</div>
    </div>
  );
}

import { google } from "googleapis";
import { redirect } from "next/navigation";
import { connectToDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authConfig } from "../[...nextauth]/route";
import User from "@/lib/models/user.model";
import Calendar from "@/lib/models/calendar.model";

export async function GET() {
  await connectToDB();

  const session = await getServerSession(authConfig);

  const currentUser = await User.findOne({ id: session?.user.id });

  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + "/calendar"
  );

  const scopes = ["https://www.googleapis.com/auth/calendar"];

  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    /** Pass in the scopes array defined above.
     * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    // Include the state parameter to reduce the risk of CSRF attacks.
  });

  // Get User's Google Calendar Event

  await Calendar.create({
    event: [{ title: "New Title" }],
    owner: currentUser._id,
  });

  redirect(authorizationUrl);

  // redirect 후 localhost:3000으로 redirect되면서 받은 code로 token 교환
}

import { getServerSession } from "next-auth";
import { authConfig } from "../api/auth/[...nextauth]/route";
import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { google } from "googleapis";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authConfig);

  await connectToDB();

  const code = searchParams.code as string;

  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + "/calendar"
  );

  if (code) {
    let { tokens } = oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // Save Token in DB
    const calendar = google.calendar("v3");
    console.log("Calendar", calendar);
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

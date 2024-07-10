import Calendar from "@/components/Calendar";
import CalendarConnectButton from "@/components/CalendarConnectButton";
import { getServerSession } from "next-auth";
import { authConfig } from "./api/auth/[...nextauth]/route";
import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import AccountProfile from "@/components/AccountProfile";

export default async function Home() {
  connectToDB();

  const session = await getServerSession(authConfig);

  const currentUser = await User.findOne({ id: session?.user.id });
  const imageUrl = currentUser?.image;

  console.log("Session", session);

  console.log("User", currentUser);

  if (session) {
    return (
      <>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <AccountProfile imageUrl={imageUrl} />
          <CalendarConnectButton />
          <div>
            <h2>Access Token</h2>
            <p>{session.accessToken}</p>
          </div>
          <div>
            <h2>Refresh Token</h2>
            <p>{session.refreshToken}</p>
          </div>
          <Calendar accessToken={session.accessToken} />
        </main>
        ;
      </>
    );
  }
}

import { GoogleSigninButton, Logout } from "@/components/AuthButton";

import Calendar from "@/components/Calendar";
import { authConfig } from "@/lib/auth";
import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;

  await connectToDB();

  const currentUser = await User.findOne({ id: userId });

  console.log("Session", session);
  console.log("Current User", currentUser);

  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-700">Calendar</h1>
        <div>{currentUser ? <Logout /> : <GoogleSigninButton />}</div>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Calendar />
      </main>
    </>
  );
}

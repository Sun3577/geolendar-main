import CalendarEvent from "@/components/CalendarEvent";
import Calendar from "@/lib/models/calendar.model";
import { getServerSession } from "next-auth";
import { authConfig } from "../api/auth/[...nextauth]/route";
import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";

export default async function Page() {
  const session = await getServerSession(authConfig);

  await connectToDB();

  const currentUser = await User.findOne({ id: session?.user.id });
  return <CalendarEvent />;
}

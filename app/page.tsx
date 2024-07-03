import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import ClientComponent from "@/components/ClientComponent"; // 클라이언트 컴포넌트를 임포트합니다.
import { Logout } from "@/components/AuthButton";

export default async function Home() {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;

  await connectToDB();

  const currentUser = await User.findOne({ id: userId });

  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-700">Calendar</h1>
        <div>{currentUser ? <Logout /> : <GoogleSigninButton />}</div>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <ClientComponent currentUser={currentUser} />
      </main>
    </>
  );
}

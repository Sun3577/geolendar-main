import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";

import { connectToDB } from "../../../../lib/mongoose";

import { createUser } from "../../../../lib/actions/user.actions";
import User from "../../../../lib/models/user.model";

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const userInfo = {
        id: user?.id || "",
        username: user?.name || "",
        email: user?.email || "",
        image: user?.image || "",
        provider: account?.provider || "",
        calendar: [],
        access_token: "",
        refresh_token: "",
      };
      try {
        await connectToDB();
        const dbUser = await User.findOne({ id: userInfo.id });
        if (!dbUser) {
          await createUser(userInfo);
        } else {
          dbUser.calendar = userInfo.calendar;
          await dbUser.save();
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async jwt({ token, account, user }) {
      // OAuth access_token과 user id를 로그인 후 token에 저장합니다.
      if (account) {
        token.accessToken = account.access_token;
        token.id = user?.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };

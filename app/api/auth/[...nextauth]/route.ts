import NextAuth from "next-auth";

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { connectToDB } from "../../../../lib/mongoose";

import { createUser } from "../../../../lib/actions/user.actions";
import User from "../../../../lib/models/user.model";

// Google Login을 위한 코드

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      email?: string;
      name?: string;
      image?: string;
      provider?: string;
    };
  }

  interface User {
    id?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    id?: string;
  }
}

interface Props {
  id: string;
  username: string;
  email: string;
  image: string;
  provider: string;
  calendar: any;
}

export const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const userInfo: Props = {
        id: user?.id || "",
        username: user?.name || "",
        email: user?.email || "",
        image: user?.image || "",
        provider: account?.provider || "",
        calendar: [],
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

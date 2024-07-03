import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { connectToDB } from "./mongoose";

import { createUser } from "./actions/user.actions";
import User from "./models/user.model";
import { signIn } from "next-auth/react";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
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
}

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // OAuth access_token과 user id를 로그인 후 token에 저장합니다.
      if (account) {
        token.accessToken = account.access_token;
        token.id = user?.id;
      }
      return token;
    },
    async session({ session, token }) {
      // 클라이언트로 전송할 속성, 예를 들어 access_token과 사용자 id를 전송합니다.
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      if (token.id) {
        session.user = {
          ...session.user,
          id: token.id,
        };
      }
      return session;
    },
    async signIn({ user, account }) {
      const userInfo: Props = {
        id: user?.id || "",
        username: user?.name || "",
        email: user?.email || "",
        image: user?.image || "",
        provider: account?.provider || "",
      };
      try {
        await connectToDB();
        const dbUser = await User.findOne({ id: userInfo.id });
        if (!dbUser) {
          await createUser(userInfo);
        } else {
          const sns = dbUser.provider;
          signIn(sns);
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};

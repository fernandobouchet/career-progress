import NextAuth from "next-auth";
import authConfig from "../../auth.config";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, sessions, users } from "@/server/db/schema";
import { db } from "@/server/db/drizzle";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    session: async ({ session, user }) => {
      if (!user) return session; // Return session unchanged if no user

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
          isActive: user.isActive,
        },
      };
    },
  },
  secret: process.env.AUTH_SECRET,
  ...authConfig,
});

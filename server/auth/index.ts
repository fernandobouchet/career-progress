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
    session: async ({ session, token }) => {
      if (!token) return session;
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          isActive: token.isActive,
        },
      };
    },
    jwt: async ({ token, user }) => {
      if (user) {
        if (!user.id) {
          throw new Error("User ID is required for authentication");
        }
        token.id = user.id;
        token.role = user.role;
        token.isActive = user.isActive;
      }
      return token;
    },
  },

  secret: process.env.AUTH_SECRET,
  ...authConfig,
});

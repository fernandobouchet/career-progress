import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: rolesEnum;
      isActive: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: rolesEnum;
    isActive: boolean;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    id: string;
    role: rolesEnum;
    isActive: boolean;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: rolesEnum;
    isActive: boolean;
  }
}
